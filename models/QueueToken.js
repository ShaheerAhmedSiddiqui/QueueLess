
const { pool } = require('../config/database');

// Create a new queue token
async function createToken(studentId, serviceId) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Lock the service row while generating its next token
        const [services] = await connection.query(
            `SELECT code, is_active
             FROM services
             WHERE id = ?
             FOR UPDATE`,
            [serviceId]
        );

        if (!services.length || !services[0].is_active) {
            throw new Error('Service is unavailable');
        }

        const serviceCode = services[0].code;

        // Prevent duplicate active queues
        const [existing] = await connection.query(
            `SELECT id
             FROM queue_tokens
             WHERE student_id = ?
             AND service_id = ?
             AND status IN ('WAITING', 'CALLED', 'SERVING')
             LIMIT 1`,
            [studentId, serviceId]
        );

        if (existing.length) {
            throw new Error('You already have an active token for this service');
        }

        // Find the last token number for this service
        const [lastTokens] = await connection.query(
            `SELECT token_number
             FROM queue_tokens
             WHERE service_id = ?
             ORDER BY id DESC
             LIMIT 1`,
            [serviceId]
        );

        const lastNumber = lastTokens.length
            ? Number(lastTokens[0].token_number.split('-').pop()) || 0
            : 0;

        const tokenNumber =
            `${serviceCode}-${String(lastNumber + 1).padStart(3, '0')}`;

        // Insert new token
        const [result] = await connection.query(
            `INSERT INTO queue_tokens
             (student_id, service_id, token_number, status)
             VALUES (?, ?, ?, 'WAITING')`,
            [studentId, serviceId, tokenNumber]
        );

        // Record queue history
        await connection.query(
            `INSERT INTO queue_history
             (queue_token_id, actor_user_id, action, notes)
             VALUES (?, ?, 'JOINED', 'Student joined the queue')`,
            [result.insertId, studentId]
        );

        await connection.commit();

        return {
            id: result.insertId,
            token: tokenNumber
        };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

// Get all active queues of a student
async function getActiveQueues(studentId) {
    const [rows] = await pool.query(
        `SELECT
            q.id,
            q.token_number,
            q.status,
            q.joined_at,
            q.service_id,
            s.name AS service_name,
            c.name AS counter_name,
            (
                SELECT COUNT(*)
                FROM queue_tokens ahead
                WHERE ahead.service_id = q.service_id
                AND ahead.status = 'WAITING'
                AND (
                    ahead.joined_at < q.joined_at
                    OR (
                        ahead.joined_at = q.joined_at
                        AND ahead.id < q.id
                    )
                )
            ) AS ahead
         FROM queue_tokens q
         JOIN services s ON q.service_id = s.id
         LEFT JOIN counters c ON q.counter_id = c.id
         WHERE q.student_id = ?
         AND q.status IN ('WAITING', 'CALLED', 'SERVING')
         ORDER BY q.joined_at DESC`,
        [studentId]
    );

    return rows.map(row => ({
        ...row,
        ahead: Number(row.ahead),
        position: row.status === 'WAITING'
            ? Number(row.ahead) + 1
            : null
    }));
}

// Get completed and cancelled queue history
async function getQueueHistory(studentId) {
    const [rows] = await pool.query(
        `SELECT
            q.id,
            q.token_number,
            q.status,
            q.joined_at,
            q.completed_at,
            s.name AS service_name
         FROM queue_tokens q
         JOIN services s ON q.service_id = s.id
         WHERE q.student_id = ?
         AND q.status IN ('COMPLETED', 'CANCELLED', 'SKIPPED')
         ORDER BY q.joined_at DESC`,
        [studentId]
    );

    return rows;
}

// Get position of a particular token
async function getQueuePosition(tokenId, studentId) {
    const [rows] = await pool.query(
        `SELECT
            q.id,
            q.status,
            (
                SELECT COUNT(*)
                FROM queue_tokens ahead
                WHERE ahead.service_id = q.service_id
                AND ahead.status = 'WAITING'
                AND (
                    ahead.joined_at < q.joined_at
                    OR (
                        ahead.joined_at = q.joined_at
                        AND ahead.id < q.id
                    )
                )
            ) AS ahead
         FROM queue_tokens q
         WHERE q.id = ?
         AND q.student_id = ?`,
        [tokenId, studentId]
    );

    if (!rows.length) {
        return null;
    }

    return {
        status: rows[0].status,
        ahead: Number(rows[0].ahead),
        position: rows[0].status === 'WAITING'
            ? Number(rows[0].ahead) + 1
            : null
    };
}

// Cancel a student's waiting token
async function cancelToken(tokenId, studentId) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            `UPDATE queue_tokens
             SET status = 'CANCELLED'
             WHERE id = ?
             AND student_id = ?
             AND status = 'WAITING'`,
            [tokenId, studentId]
        );

        if (result.affectedRows) {
            await connection.query(
                `INSERT INTO queue_history
                 (queue_token_id, actor_user_id, action, notes)
                 VALUES (?, ?, 'CANCELLED', 'Student cancelled the queue')`,
                [tokenId, studentId]
            );
        }

        await connection.commit();

        return result.affectedRows > 0;

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    createToken,
    getActiveQueues,
    getQueueHistory,
    getQueuePosition,
    cancelToken
};
