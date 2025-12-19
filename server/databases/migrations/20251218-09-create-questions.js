/**
 * @file databases/migrations/20251218-09-create-questions.js
 * @description questions migration file
 * 251218 v1.0.0 jae init
 */

import { DataTypes } from "sequelize";

// 테이블명 
const tableName = 'questions';

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '질문 PK',
  },
  questionCode: {
    field: 'question_code',
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    comment: '질문코드'
  },
  content: {
    field: 'content',
    type: DataTypes.STRING(250),
    allowNull: true,
    comment: '질문',
  },
  questionType: {
    field: 'question_type',
    type: DataTypes.ENUM('RADIO', 'STRING'),
    defaultValue: 'RADIO',
    allowNull: false,
    comment: '질문타입',
  },
  sortOrder: {
    field: 'sort_order',
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment : '순서배치',
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '작성일', 
  },
  upatedAt: {
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