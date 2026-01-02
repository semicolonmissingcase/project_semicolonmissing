/**
 * @file app/services/owner/owner.inquiry.service.js
 * @description 문의글 Service
 * 260102 CK init
 */

import ownerInquiryRepository from "../../repositories/owner/owner.inquiry.repository.js";
import {  } from "../../../configs/responseCode.config.js";

/**
 * 점주 새로운 문의 생성
 * @param {number} ownerId 
 * @param {string} title 
 * @param {string} content 
 * @returns 
 */
async function createInquiry(ownerId, title, content) {
  const inquiryData = { ownerId, title, content };
  const newInquiry = await ownerInquiryRepository.createInquiry(inquiryData);
  
  if(!newInquiry) {
    throw myErrorError('문의 생성에 실패했습니다.')
  }

  return {
    id: newInquiry.id,
    ownerId: newInquiry.ownerId,
    title: newInquiry.title,
    content: newInquiry.content,
    status: newInquiry.status,
    createAt: newInquiry.createdAt,
  }    
}

/**
 * 특정 점주가 작성한 모든 문의 목록 조회
 * @param {number} ownerId 
 * @returns 
 */
async function getInquiriesByOwner(ownerId) {
  const inquiries = await ownerInquiryRepository.findInquiriesByOwnerId(ownerId);
  
  if (!inquiries) {
    throw new Error('문의 목록을 찾을 수 없습니다.');
  }

  return inquiries.map(inquiry => ({
    id: inquiry.id,
    ownerId: inquiry.ownerId,
    title: inquiry.title,
    status: inquiry.status,
    createdAt: inquiry.createdAt,
  }));
}

/**
 * 특정 점주가 작성한 문의 중, 특정 문의 ID를 가진 문의의 상세 정보 조회
 * @param {number}} inquiryId 
 * @param {number} ownerId 
 * @returns 
 */
async function  getInquiryDetailsForOwner(inquiryId, ownerId) {
  const inquiry = await ownerInquiryRepository.findInquiryByIdAndOwnerId({ inquiryId, ownerId });
  
  if (!inquiries) {
    throw new Error('해당 문의를 찾을 수 없거나 접근 권한이 없습니다.');
  }

  return {
    id: inquiry.id,
    ownerId: inquiry.ownerId,
    title: inquiry.title,
    status: inquiry.status,
    createdAt: inquiry.createdAt,
    updateAt: inquiry.updateAt,
    answers: inquiry.answers ? inquiry.answers.map(answer => ({
      id: answer.id,
      adminId: answer.adminId,
      content: answer.content,
      createdAt: answer.createdAt,
    })) : [],
  };
}

export default {
  createInquiry,
  getInquiriesByOwner,
  getInquiryDetailsForOwner,
}