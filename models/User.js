const pool = require('../config/db');

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

async function findByStudentId(studentId) {
  const [rows] = await pool.query('SELECT id FROM users WHERE student_id = ?', [studentId]);
  return rows[0] || null;
}

async function create({ fullName, email, studentId, passwordHash, role = 'STUDENT' }) {
  const [result] = await pool.query(
    'INSERT INTO users (full_name, email, student_id, password_hash, role) VALUES (?, ?, ?, ?, ?)',
    [fullName, email, studentId || null, passwordHash, role]
  );
  return result.insertId;
}

module.exports = { findByEmail, findByStudentId, create };