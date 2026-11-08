const bcrypt = require('bcrypt');
const pool = require('../config/db');

(async () => {
  const hash = await bcrypt.hash('Test@1234', 10);
  await pool.query(
    'INSERT IGNORE INTO users (full_name, email, password_hash, role) VALUES (?,?,?,?), (?,?,?,?)',
    ['Admin User', 'admin@queueless.local', hash, 'ADMIN',
     'Staff User', 'staff@queueless.local', hash, 'STAFF']
  );
  console.log('Seed users created');
  process.exit();
})();