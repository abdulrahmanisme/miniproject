export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'devsecret',
  expiresIn: '1d',
};
