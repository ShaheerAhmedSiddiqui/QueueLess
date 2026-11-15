
const { pool } = require('../config/database');

async function findByEmail(email) {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function findByStudentId(studentId) {
  const [rows] = await pool.query(
    'SELECT id FROM users WHERE student_id = ?',
    [studentId]
  );
  return rows[0] || null;
}

async function create({ fullName, email, studentId, passwordHash, role = 'STUDENT' }) {
  const [result] = await pool.query(
    'INSERT INTO users (full_name, email, student_id, password_hash, role) VALUES (?, ?, ?, ?, ?)',
    [fullName, email, studentId || null, passwordHash, role]
  );
  return result.insertId;
}

async function updateProfile(id, fullName) {
  const [result] = await pool.query(
    'UPDATE users SET full_name = ? WHERE id = ?',
    [fullName, id]
  );
  return result.affectedRows;
}

async function updatePassword(id, passwordHash) {
  const [result] = await pool.query(
    'UPDATE users SET password_hash = ? WHERE id = ?',
    [passwordHash, id]
  );
  return result.affectedRows;
}

module.exports = {
  findByEmail,
  findById,
  findByStudentId,
  create,
  updateProfile,
  updatePassword
};
