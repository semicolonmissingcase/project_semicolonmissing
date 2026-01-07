/**
 * @file app.js
 * @description Entry Point
 * 251217 v1.0.0 jae
 */
import express from 'express';
import './configs/env.config.js';
import authRouter from './routes/auth.router.js';
import errorHandler from './app/errors/errorHandler.js';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import adminRouter from './routes/admin.router.js';
import usersRouter from './routes/user.router.js'; // 회원가입 관련
import storesRouter from './routes/store.router.js'; // 매장 관리 관련
import postsRouter from './routes/post.router.js'; // 글쓰기 관려(문의, 리뷰)

// 채팅 관련 import
import { createServer } from 'http'; // HTTP 서버 생성
import { Server } from 'socket.io';   // 소켓 모듈
import chatRouter from './routes/chat.router.js'; // 채팅 라우트
import socketHandler from './app/sockets/socketHandler.js'; // 소켓 로직
// import cleanersRouter from './routes/cleaners.router.js'; // TODO: 추후 코멘트 해제
import ownersRouter from './routes/owners.routes.js';
import filesRouter from './routes/files.router.js';
import cleanersRouter from './routes/cleaners.router.js';
import estimateRouter from './routes/estimate.router.js';

// 결제 관련 import
import paymentsRouter from './routes/payments.router.js';

const app = express();
app.use(cors({
  origin: "http://localhost:5173", // 프론트 주소
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"]
}));
app.use(express.json()); // JSON 요청 파싱 처리
app.use(cookieParser()); // 쿠키 파서
app.use('/storage/images/posts', express.static('storage/images/posts'));
app.use('/storage/images/profiles', express.static('storage/images/profiles'));
app.use('/storage/images/chat', express.static('storage/images/chat'));
app.use('/uploads', express.static('uploads'));

// -----------------
// 라우터 정의
// -----------------
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/users', usersRouter); // 회원가입 관련
app.use('/api/owners', ownersRouter);
app.use('/api/files', filesRouter);
app.use('/api/cleaners', cleanersRouter); // TODO: 추후 코멘트 해제
app.use('/api/payments', paymentsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/stores', storesRouter); // 매장관리 관련
app.use('/api/reservations', estimateRouter); // 견적서 관련 
app.use('/api/posts', postsRouter); // 글쓰기 관련

// 에러 핸들러 등록
app.use(errorHandler);

// -----------------
// Socket.io 설정
// -----------------
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

socketHandler(io);

// -----------------------
// 서버 실행 (httpServer로 실행해야 소켓이 작동함)
// -----------------------
const PORT = parseInt(process.env.APP_PORT) || 3000;
httpServer.listen(PORT, () => {
});