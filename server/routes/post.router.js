/**
 * @file routes/post.router.js
 * @description 글쓰기 관련 라우터
 * 260102 v1.0.0 ck init
 */

import express from 'express';
import authUserMiddleware from '../app/middlewares/auth/auth.user.middleware.js';
import authAdminMiddleware from '../app/middlewares/auth/auth.admin.middleware.js';
import ownerInquiryController from '../app/controllers/owner/owner.inquiry.controller.js';

const postsRouter = express.Router();

// 문의사항 작성
postsRouter.post('/inquiries', authUserMiddleware, ownerInquiryController.ownerCreateInquiry);
// 내 문의사항 조회(점주)
postsRouter.get('/owner/inquiries', authUserMiddleware, ownerInquiryController.getOwnerInquiries);
// 내 문의상세 조회(점주)
postsRouter.get('/owner/inquiries/:inquiryId', authUserMiddleware, ownerInquiryController.getOwnerInquiriesShow);

// 문의사항 답변(관리자 전용)
// postsRouter.post('/inquiries/:inquiryId/answers', authAdminMiddleware, ownerInquiryController.createAnswer);

// 리뷰 작성
// postsRouter.post('/reviews', authUserMiddleware, ownerInquiryController.createReview);
// 리뷰 목록 조회
// postsRouter.get('/reviews', authUserMiddleware, ownerInquiryController.getReviews);

export default postsRouter;