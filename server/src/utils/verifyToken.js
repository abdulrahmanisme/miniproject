import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';

export function signToken(payload, expiresIn = '10m') {
  return jwt.sign(payload, jwtConfig.secret, { expiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, jwtConfig.secret);
}
