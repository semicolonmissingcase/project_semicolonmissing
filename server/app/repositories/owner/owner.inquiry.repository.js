/**
 * @file app/repositories/owner/owner.inquiry.repository.js
 * @description 문의글 관련 Repository
 * 260102 v1.0.0 ck init
 */

import { Sequelize } from 'sequelize';
import db from '../../models/index.js';
import dayjs from 'dayjs';
const { Inquiry, Owner, Cleaner, Admin, Answer, Review, Reservation, Store, Like, Estimate } = db;

/**
 * 점주 문의 생성
 * @param {object} inquiryData 
 */
async function createInquiry(inquiryData) {
  const dataForInquiryCreate = {
    ownerId: inquiryData.ownerId || null,
    cleanerId: inquiryData.cleanerId || null,
    title: inquiryData.title,
    category: inquiryData.category,
    content: inquiryData.content,
    guestName: inquiryData.guestName || null,
    guestPassword: inquiryData.guestPassword || null,
    status: inquiryData.status || '대기중',
  };

  console.log("--- [DEBUG] Inquiry.create에 최종 전달될 dataForInquiryCreate:", dataForInquiryCreate);
  const newInquiry = await Inquiry.create(dataForInquiryCreate);
  return newInquiry;
}

/**
 * 점주ID로 검색
 * @param {number} ownerId 
 */
async function findInquiriesByOwnerId(ownerId) {
  const inquiries = await Inquiry.findAll({
    where: { ownerId: ownerId },
    order: [['createdAt', 'DESC']], // 최신 문의
  });
  return inquiries;  
}

/**
 * 점주ID + 문의글ID
 * @param {object} param0 
 * @returns 
 */
async function findInquiryByIdAndOwnerId({ inquiryId, ownerId }) {
  const inquiries = await Inquiry.findAll({
    where: {
      id: inquiryId,
      ownerId: ownerId,
    },
    include: [
      {
        model: Answer, as: 'answers'
      },
    ],
  });
  return inquiries;  
}

/**
 * 모든 문의 목록 조회
 * @returns 
 */
async function findAllInquiries(limit, offset) {
  const { count, rows } = await Inquiry.findAndCountAll({
    attributes: [
      'id',
      'title',
      'category',
      'createdAt',
      'content',
      'guestName', // 비회원은 이메일이 됨
      'ownerId',
      'cleanerId',
      'status',
    ],
    include: [
      {
        model: Owner,
        as: 'owner',
        attributes: ['name', 'email'],
        required: false,
      },
      {
        model: Cleaner,
        as: 'cleaner',
        attributes: ['name', 'email'],
        required: false,
      }
    ],
    order: [['createdAt', 'DESC']],
    limit: limit,
    offset: offset,
  });  
  return { count, rows };
}

// -----------------------리뷰관련----------------------- 
/**
 * 점주 ID로 리뷰 목록 조회
 * @param {number} ownderId 
 */
async function findReviewsByOwnerId(ownerId) {
  const reviews = await Review.findAll({
    where: { ownerId },
    include: [
      {
        model: Cleaner,
        as: 'cleaner',
        attributes: ['id', 'name', 'profile'],
        required: true,
        include: [{
          model: Like, 
          as: 'likes',
          where: { ownerId: ownerId },
          required: false,
          attributes: ['id'],
        }]
      },
      {
        model: Reservation,
        as: 'reservationData',
        attributes: ['id', 'date', 'time', 'status'],
        required: false,
        include: [
          {
            model: Store,
            as: 'store',
            attributes: ['name'],
            required: false,
          },
          {
            model: Estimate,
            as: 'estimate',
            attributes: ['estimatedAmount'],
            required: false,
          }
        ]
      },
    ],
    order: [['createdAt', 'DESC']],
    replacements: { ownerId: ownerId },
  });
  return reviews.map(review => {
    const plainReview = review.get({ plain: true });
    const heartStatus = plainReview.cleaner?.likes?.length > 0;
    const estimatedAmount = plainReview.reservationData?.estimate?.estimatedAmount;
    const price = estimatedAmount ? estimatedAmount.toLocaleString() : '정보없음';

    return {
      id: plainReview.id,
      name: plainReview.cleaner?.name || '기사님 정보 없음',
      cleanerProfile: plainReview.cleaner?.profile || '/icons/default-profile.png',
      heart: heartStatus,
      time: `${dayjs(plainReview.reservationData?.date).format('YYYY-MM-DD')}${plainReview.reservationData?.time}`,
      store: plainReview.reservationData?.store?.name || '매장 정보 없음',
      price: price,
      star: plainReview.star,
      content: plainReview.content,
      createdAt: plainReview.createdAt,
      cleanerId: plainReview.cleaner?.id,
    };
  });
}

/**
 * 점주 내 특정 리뷰 상세 조회
 * @param {number} reviewId 
 * @param {number} ownerId 
 */
async function findReviewByIdAndOwnerId(reviewId, ownerId) {
  const review = await Review.findOne({
    where: {
      id: reviewId,
      ownerId: ownerId,
    },
    include: [
      {
        model: Cleaner,
        as: 'cleaner',
        attributes: [ 
          'id', 'name', 'profile', 
          [
            Sequelize.literal(`(
              SELECT COALESCE(AVG(star), 0)
              FROM reviews
              WHERE reviews.cleaner_id = cleaner.id
            )`), 'avgReviewScore'
          ]
        ],
        include: [{
          model: Like,
          as: 'likes',
          where: { ownerId: ownerId },
          required: false,
          attributes: ['id'],
        }],
      },
      {
        model: Reservation,
        as: 'reservationData',
        attributes: ['id', 'date', 'time', 'status'],
        include: [
          {
            model: Store,
            as: 'store',
            attributes: ['name'],
          },
          {
            model: Estimate,
            as: 'estimate',
            attributes: ['estimatedAmount'],
            required: false,
          },
        ],
      },
    ],
  });

  if(!review) {
    return null;
  }

  const plainReview = review.get({ plain: true });

  const heartStatus = plainReview.cleaner?.likes?.length > 0;
  const avgReviewScore = plainReview.cleaner?.avgReviewScore
      ? Number(plainReview.cleaner.avgReviewScore).toFixed(1)
      : '0.0';
  const price = plainReview.reservationData?.estimate?.estimatedAmount
      ? plainReview.reservationData.estimate.estimatedAmount.toLocaleString()
      : '미정';
  
  return {
    id: plainReview.id,
    cleanerId: plainReview.cleaner?.id,
    cleanerName: plainReview.cleaner?.name || '정보 없음',
    cleanerProfile: plainReview.cleaner?.profile || '/icons/default-profile.png',
    avgReviewScore: avgReviewScore,
    reservationDate: plainReview.reservationData?.date,
    reservationTime: plainReview.reservationData?.time,
    storeName: plainReview.reservationData?.store?.name || '정보 없음',
    price: price,
    star: plainReview.star,
    content: plainReview.content,
    reviewPicture1: plainReview.reviewPicture1,
    reviewPicture2: plainReview.reviewPicture2,
    createdAt: plainReview.createdAt,
    heart: heartStatus,
  };
}

export default {
  createInquiry,
  findInquiriesByOwnerId,
  findInquiryByIdAndOwnerId,
  findAllInquiries,
  findReviewsByOwnerId,
  findReviewByIdAndOwnerId,
}