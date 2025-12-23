import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';

export function authRequired(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = decoded;
    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export function authOptional(req, res, next) {
  const token = req.cookies.token;
  if (token) {
    try {
      req.user = jwt.verify(token, jwtConfig.secret);
    } catch (e) {
      // ignore invalid optional token
    }
  }
  return next();
}
