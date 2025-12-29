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

import usersRouter from './routes/user.router.js'; // 회원가입 관련
import storesRouter from './routes/store.router.js'; // 매장 관리 관련

// 채팅 관련 import
import { createServer } from 'http'; // HTTP 서버 생성
import { Server } from 'socket.io';   // 소켓 모듈
import chatRouter from './routes/chatRoutes.js'; // 채팅 라우트
import socketHandler from './app/sockets/socketHandler.js'; // 소켓 로직

const app = express();
app.use(cors({
  origin: "http://localhost:5173", // 프론트 주소
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"]
}));
app.use(express.json()); // JSON 요청 파싱 처리
app.use(cookieParser()); // 쿠키 파서
app.use('/uploads', express.static('uploads'));

// -----------------
// 라우터 정의
// -----------------
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/users', usersRouter); // 회원가입 관련
app.use('/api/stores', storesRouter); // 매장관리 관련

// 에러 핸들러 등록
app.use(errorHandler);

// -----------------
// Socket.io 설정
// -----------------
// 1. Express 앱을 HTTP 서버로 감싸기
const httpServer = createServer(app);

// 2. Socket.io 서버 객체 생성
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
  console.log(`💬 실시간 채팅 기능 활성화됨`);
});