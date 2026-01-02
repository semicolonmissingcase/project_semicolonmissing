/**
 * @file app/repositories/owner/owner.inquiry.repository.js
 * @description 문의글 관련 Repository
 * 260102 v1.0.0 ck init
 */

import db from '../../models/index.js';
const { Inquiry, Owner, Cleaner, Admin, Answer } = db;

/**
 * 점주 문의 생성
 * @param {object} inquiryData 
 */
async function createInquiry(inquiryData) {
  const newInquiry = await Inquiry.create({
    ownerId: inquiryData.ownerId,
    title: inquiryData.title,
    content: inquiryData.content,
  });
  return newInquiry;
}

/**
 * 점주ID로 검색
 * @param {number} ownderId 
 */
async function findInquiriesByOwnerId(ownderId) {
  const inquiries = await Inquiry.findAll({
    where: { ownerId: ownderId },
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

export default {
  createInquiry,
  findInquiriesByOwnerId,
  findInquiryByIdAndOwnerId
}