import 'dotenv/config';

export default {
  port: process.env.PORT || 3000,
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
};
