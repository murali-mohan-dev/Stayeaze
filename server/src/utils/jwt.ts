import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'stayease_super_secret_jwt_key_2025_luxury_hotel_system';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
