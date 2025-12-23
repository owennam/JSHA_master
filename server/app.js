import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import cookieParser from 'cookie-parser';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const CLIENT_PORT = config.clientPort;
const TOSS_SECRET_KEY = config.tossSecretKey;

// CORS 설정 - 여러 클라이언트 URL 허용
const allowedOrigins = [
  `http://localhost:${CLIENT_PORT}`,
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:8082',
  'http://localhost:8083',
  'http://localhost:5173',
  'https://jsha-master.vercel.app',
  'https://www.jshamaster.com',
  'https://jshamaster.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// Admin Routes
app.use('/api/admin', adminRoutes);

// 서버 상태 확인 엔드포인트
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Payment server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: 'The requested endpoint does not exist'
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred'
  });
});

export default app;
