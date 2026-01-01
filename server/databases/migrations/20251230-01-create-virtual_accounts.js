/**
 * @file databases/migrations/20251230-01-create-virtual_accounts.js
 * @description virtualAccounts migration file
 * 251230 v1.0.0 jae init
 */

import { DataTypes } from "sequelize";

// 테이블명 
const tableName = 'virtual_accounts';

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '가상계좌대기 PK',
  },
  reservationId: {
    field: 'reservation_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '예약 PK',
  },
  orderId: {
    field: 'order_id',
    type: DataTypes.STRING(64),
    allowNull: false,
    comment: '주문번호'
  },
  bankCode: {
    field: 'bank_code',
    type: DataTypes.STRING(10),
    allownull: false,
    comment: '은행코드',
  },
  accountNumber: {
    field: 'account_number',
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: '가상계좌번호',
  },
  accountType: {
    field: 'account_type',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '계좌 타입',
  },
  customerName: {
    field: 'customer_name',
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '입금자명',
  },
  dueDate: {
    field: 'due_date',
    type: DataTypes.DATE,
    allowNull: false,
    comment: '입금기한',
  },
  isSettlement: {
    field: 'is_settlement',
    type: DataTypes.BOOLEAN,
    allowNull: false,
    comment: '입금완료여부',
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