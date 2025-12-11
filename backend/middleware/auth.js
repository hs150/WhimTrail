const jwt = require('jsonwebtoken');
const { getUserById } = require('../models/supabase/User');

// Verify any logged-in user
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token', error: err.message });
    }
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  });
};

// Verify admin user
const verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token', error: err.message });
    }

    req.userId = decoded.userId;

    try {
      const user = await getUserById(req.userId);
      if (!user || !user.is_admin) {
        return res.status(403).json({ message: 'Admin access required' });
      }

      req.isAdmin = true;
      next();
    } catch (error) {
      return res.status(500).json({ message: 'Error verifying admin', error: error.message });
    }
  });
};

module.exports = { verifyToken, verifyAdmin };