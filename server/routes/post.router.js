/**
 * @file routes/post.router.js
 * @description 글쓰기 관련 라우터
 * 260102 v1.0.0 ck init
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import ownerInquiryController from '../app/controllers/owner/owner.inquiry.controller.js';
import multerMiddleware from '../app/middlewares/multer/multer.middleware.js';

const postsRouter = express.Router();

// 문의사항 페이지 테이블 조회(비회원도 가능)
postsRouter.get('/inquiries', ownerInquiryController.getAllInquiries);
// 문의사항 작성(회원용)
postsRouter.post('/inquiries', authMiddleware, ownerInquiryController.ownerCreateInquiry);
// 문의사항 작성(비회원용)
postsRouter.post('/inquiries/guest', multerMiddleware.inquiryImageUploader, ownerInquiryController.guestCreateInquiry);

// 내 문의사항 조회(점주)
postsRouter.get('/owner/inquiries', authMiddleware, ownerInquiryController.getOwnerInquiries);
// 내 문의상세 조회(점주)
postsRouter.get('/owner/inquiries/:inquiryId', authMiddleware, ownerInquiryController.getOwnerInquiriesShow);

// 문의사항 답변(관리자 전용)
// postsRouter.post('/inquiries/:inquiryId/answers', authAdminMiddleware, ownerInquiryController.createAnswer);

// 리뷰 작성
// postsRouter.post('/reviews', authUserMiddleware, ownerInquiryController.createReview);
// 리뷰 목록 조회
postsRouter.get('/owner/reviews', authMiddleware, ownerInquiryController.getOwnerReviews);

export default postsRouter;
