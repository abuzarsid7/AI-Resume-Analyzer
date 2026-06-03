const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
//hardcoded test user to save time
const TEST_USER = { id: '1', email: 'test@test.com', password: 'password123' };

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  if (email !== TEST_USER.email || password !== TEST_USER.password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign(
    { userId: TEST_USER.id },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  res.json({ token, email });
};