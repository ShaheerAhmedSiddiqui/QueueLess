const bcrypt = require('bcrypt');
const User = require('../models/User');

const HOME = {
  STUDENT: '/student/dashboard',
  STAFF: '/staff/dashboard',
  ADMIN: '/admin/dashboard',
};

const register = async (req, res, next) => {
  try {
    const { fullName, email, studentId, password, confirmPassword } = req.body;

    if (!fullName || !email || !studentId || !password)
      return res.status(400).send('All fields are required.');
    if (password.length < 8)
      return res.status(400).send('Password must be at least 8 characters.');
    if (password !== confirmPassword)
      return res.status(400).send('Passwords do not match.');
    if (await User.findByEmail(email.trim().toLowerCase()))
      return res.status(409).send('Email already registered.');
    if (await User.findByStudentId(studentId.trim()))
      return res.status(409).send('Student ID already registered.');

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      studentId: studentId.trim(),
      passwordHash,
    });

    res.redirect('/login');
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail((email || '').trim().toLowerCase());

    // one message for both cases, so attackers can't tell which part was wrong
    if (!user || !user.is_active || !(await bcrypt.compare(password || '', user.password_hash)))
      return res.status(401).send('Invalid email or password.');

    req.session.regenerate((err) => {
      if (err) return next(err);
      req.session.user = { id: user.id, name: user.full_name, role: user.role };
      res.redirect(HOME[user.role]);
    });
  } catch (err) { next(err); }
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('queueless.sid');
    res.redirect('/login');
  });
};

module.exports = {
  register,
  login,
  logout
}