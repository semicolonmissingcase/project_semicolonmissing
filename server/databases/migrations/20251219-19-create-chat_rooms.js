/**
 * @file databases/migrations/20251218-13-create-chat_rooms.js
 * @description chatRooms migration file
 * 251218 v1.0.0 jae init
 */

import { DataTypes } from "sequelize";

// 테이블명 
const tableName = 'chat_rooms';

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '채팅방 PK',
  },
  ownerId: {
    field: 'owner_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '점주 PK',
  },
  cleanerId: {
    field: 'cleaner_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    unique: true, 
    comment: '기사 PK',
  },
  estimateId: {
    field: 'estimate_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    unique: true,
    comment: '견적서 PK',
  },
  status: {
    field: 'status',
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '채팅방 상태',
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
  ownerLeavedAt: {
    field: 'owner_leaved_at',
    type: DataTypes.DATE,
    allowNull: false,
    comment: '점주가 체팅방을 나간 시간',
  },
  cleanerLeavedAt: {
    field: 'cleaner_leaved_at',
    type: DataTypes.DATE,
    allowNull: false,
    comment: '기사가 채팅방을 나간 시간',
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