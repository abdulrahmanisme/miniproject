import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'devsecret';

export const authMiddleware = {
  required: (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'No token' });
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;
      return next();
    } catch (e) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  },
  optional: (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return next();
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;
    } catch (e) {
      // ignore
    }
    return next();
  },
};
