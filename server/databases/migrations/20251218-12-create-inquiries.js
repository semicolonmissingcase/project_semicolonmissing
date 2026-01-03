/**
 * @file databases/migrations/20251218-07-create-inquiries.js
 * @description inquiries migration file
 * 251218 v1.0.0 jae init
 */

import { DataTypes } from "sequelize";

// 테이블명 
const tableName = 'inquiries';

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '문의 PK',
  },
 ownerId: {
  field: 'owner_id',
  type: DataTypes.BIGINT.UNSIGNED,
  allowNull: true,
  comment: '점주 PK',
 },
 cleanerId: {
  field: 'cleaner_id',
  type: DataTypes.BIGINT.UNSIGNED,
  allowNull: true,
  comment: '기사 PK',
 },
  title: {
    field: 'title',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '제목',
  },
  category: {
    field: 'category',
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '카테고리(견적문의, 서비스 문의, 기술지원, 불만/개선사항, 기타)',
  },
  content: {
    field: 'content',
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '문의내용',
  },
  guestName: {
    field: 'guest_name',
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '비회원 이름'
  },
  guestPassword: {
    field: 'guest_password',
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '비회원 비밀번호(nullable)'
  },
  status: {
    field: 'status',
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '상태(대기중, 답변완료)',
  },
  inquiryPicture1: {
    field: 'inquiry_picture_1',
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '문의사진1',
  },
  inquiryPicture2: {
    field: 'inquiry_picture_2',
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '문의사진2',
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '작성일', 
  },
  updatedAt: {
    field: 'updated_at',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '수정일',
  },
  deletedAt: {
    field: 'deleted_at',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '삭제일',
  }
};

// 옵션 
const options = {
  charset: 'utf8mb4',      // 테이블 문자셋 설정 (이모지 지원)
  collate: 'utf8mb4_bin',  // 정렬 방식 설정 (영어 대소문자 구분 정렬)
  engine: 'InnoDB'         // 사용 엔진 설정, 대량의 데이터 조회에 특화 
};

/** @type {import('sequelize-cli').Migration} */
export default {
  // 마이그레이션 실행 시 호출되는 메소드 (스키마 생성, 수정)
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, attributes, options);
  },

  // 마이그레이션을 롤백 시 호출되는 메소드 (스키마 제거, 수정)
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(tableName);
  }
};