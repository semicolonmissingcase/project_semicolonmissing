/**
 * @file app/repositories/admin/admin.inquiry.repository.js
 * @description 관리자 문의 및 답변 관리 Repository
 * 260112 seon init
 */

import { Sequelize, Op } from "sequelize";
import db from '../../models/index.js';
const { Inquiry, Answer, Owner, Cleaner, sequelize } = db;

/**
 * 문의 목록 조회
 */
async function findInquiryList({ limit, offset, search }) {
  const whereCondition = {
    deleted_at: null,
  };

  // 검색어가 있을 때만 실행
  if (search && search.trim() !== "") {
    whereCondition[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { guestName: { [Op.like]: `%${search}%` } }, 
      { '$owner.name$': { [Op.like]: `%${search}%` } },
      { '$cleaner.name$': { [Op.like]: `%${search}%` } }
    ];
  }

  const { count, rows } = await Inquiry.findAndCountAll({
    limit,
    offset,
    where: whereCondition,
    include: [
      {
        model: Owner,
        as: 'owner',
        attributes: ['name'],
        required: false
      },
      {
        model: Cleaner,
        as: 'cleaner',
        attributes: ['name'],
        required: false
      }
    ],
    subQuery: false, 
    order: [['created_at', 'DESC']],
    nest: true,
    raw: true 
  });

  return { count, inquiries: rows };
}

/**
 * 문의 통계 조회 (오늘 문의, 답변 완료, 대기중)
 */
async function findInquiryStats() {
  const today = new Date().toISOString().slice(0, 10);

  const stats = await Inquiry.findAll({
    attributes: [
      'status',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
    ],
    where: { deleted_at: null },
    group: ['status'],
    raw: true
  });

  const todayCount = await Inquiry.count({
    where: {
      created_at: { [Op.startsWith]: today },
      deleted_at: null
    }
  });

  const statusMap = stats.reduce((acc, cur) => {
    acc[cur.status] = cur.count;
    return acc;
  }, {});

  return {
    todayInquiry: todayCount,
    completedInquiry: statusMap['답변 완료'] || 0, 
    pendingInquiry: statusMap['대기중'] || 0      
  };
}
/**
 * 문의 단일 상세 조회
 */
async function findInquiryById(inquiryId) {
  return await Inquiry.findOne({
    where: { 
      id: inquiryId,
      deleted_at: null 
    },
    include: [
      {
        model: Owner,
        as: 'owner',
        attributes: ['name', 'phone_number'], 
        required: false
      },
      {
        model: Cleaner,
        as: 'cleaner',
        attributes: ['name', 'phone_number'],
        required: false
      },
      {
        model: Answer,
        as: 'answer',
        attributes: ['content', 'createdAt'],
        required: false
      }
    ],
  });
}

/**
 * 답변 등록 및 문의 상태 업데이트
 */
async function createAnswerAndUpdateStatus({ inquiryId, adminId, content }) {
  return await sequelize.transaction(async (t) => {
    const newAnswer = await Answer.create({
      inquiryId: inquiryId,
      adminId: adminId,
      content: content,
    }, { transaction: t });

    await Inquiry.update(
      { 
        status: '답변 완료' 
      },
      { 
        where: { id: inquiryId }, 
        transaction: t 
      }
    );

    return newAnswer;
  });
}

export default {
  findInquiryList,
  findInquiryStats,
  createAnswerAndUpdateStatus,
  findInquiryById
};