import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
export interface IJwtPayload {
  id: string;        
  role: string;       
  email?: string;      
  iat?: number;        
  exp?: number;        
}

// 🔐 Token তৈরি করার জন্য
const createToken = (
  payload: object,
  secret: Secret,
  expiresIn: string
): string => {
  return jwt.sign(payload, secret, { expiresIn });
};

// 🔍 Token verify করার জন্য
const verifyToken = (token: string, secret: Secret): IJwtPayload => {
  return jwt.verify(token, secret) as IJwtPayload;
};

export const jwtHelper = {
  createToken,
  verifyToken,
};
