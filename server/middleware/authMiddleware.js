import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export const authMiddleware = (req, res, next) => {
  // 쿠키 또는 헤더에서 토큰 추출
  const token = req.cookies?.admin_token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Authentication required'
    });
  }

  try {
    // 토큰 검증
    const decoded = jwt.verify(token, config.jwtSecret);
    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Invalid or expired token'
    });
  }
};
