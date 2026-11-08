const pool = require('./config/db');

(async () => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    console.log('Database connected:', rows);
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
  process.exit();
})();