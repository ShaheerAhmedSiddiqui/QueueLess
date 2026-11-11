
const { pool } = require('../config/database');

const serviceIcons = {
    SA: 'bi-people',
    FEE: 'bi-wallet2',
    ADM: 'bi-mortarboard',
    EX: 'bi-journal-check',
    IT: 'bi-pc-display',
    DV: 'bi-file-earmark-check'
};

// Get all university services
async function getAllServices() {
    const [rows] = await pool.query(`
        SELECT
            s.id,
            s.name,
            s.code,
            s.description,
            s.is_active AS available,
            (
                SELECT COUNT(*)
                FROM queue_tokens q
                WHERE q.service_id = s.id
                AND q.status = 'WAITING'
            ) AS queue
        FROM services s
        ORDER BY s.id ASC
    `);

    return rows.map(service => ({
        ...service,
        available: Boolean(service.available),
        icon: serviceIcons[service.code] || 'bi-building',
        queue: Number(service.queue),
        wait: null
    }));
}

// Get a particular service
async function getServiceById(id) {
    const [rows] = await pool.query(
        `SELECT id, name, code, description, is_active
         FROM services
         WHERE id = ?`,
        [id]
    );

    return rows[0] || null;
}

module.exports = {
    getAllServices,
    getServiceById
};
