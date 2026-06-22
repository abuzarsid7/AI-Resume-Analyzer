const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

// In-memory users array to support signup
const users = [
  { id: '1', name: 'Test User', email: 'test@test.com', password: 'password123' }
];

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  res.json({ token, email: user.email, name: user.name });
};

exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password required' });
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password
  };

  users.push(newUser);

  const token = jwt.sign(
    { userId: newUser.id },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.status(201).json({ token, email: newUser.email, name: newUser.name });
};