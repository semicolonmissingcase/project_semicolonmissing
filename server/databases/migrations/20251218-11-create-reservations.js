/**
 * @file databases/migrations/20251218-06-create-reservations.js
 * @description reservations migration file
 * 251218 v1.0.0 jae init
 */

import { DataTypes } from "sequelize";

// 테이블명 
const tableName = 'reservations';

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '예약 PK',
  },
  ownerId: {
    field: 'owner_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '점주 PK',
  },
  storeId: {
    field: 'store_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '매장 PK',
  },
  date: {
    field: 'date',
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: '희망 날짜',
  },
  time: {
    field: 'time',
    type: DataTypes.TIME,
    allowNull: false,
    comment: '희망 시간(nullable 고려중)',
  },
  status: {
    field: 'status',
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '상태(요청, 승인, 완료, 취소)'
  },
  isAssign: {
    field: 'is_assign',
    type: DataTypes.ENUM('지정', '일반'),
    allowNull: false,
    comment: '기사 지정 상태'
  },
  dateAgreedUpon: {
    field: 'date_agreed_upon',
    type: DataTypes.BOOLEAN,
    allowNull: true,
    comment: '날짜 협의 가능',
  },
  cleanerId: {
    field: 'cleaner_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    comment: '기사 PK'
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
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, attributes, options);
  },

  // 마이그레이션을 롤백 시 호출되는 메소드 (스키마 제거, 수정)
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tableName);
  }
};