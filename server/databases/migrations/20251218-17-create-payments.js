/**
 * @file databases/migrations/20251218-15-create-payments.js
 * @description payments migration file
 * 251218 v1.0.0 jae init
 */

import { DataTypes } from "sequelize";

// 테이블명 
const tableName = 'payments';

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '결제 PK',
  },
  estimateId: {
    field: 'estimate_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '견적서 PK',
  },
  reservationId: {
    field: 'reservation_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '예약 PK',
  },
  totalAmount: {
    field: 'total_amount',
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '실제 결제 금액',
  },
  status: {
    field: 'status',
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '상태(대기, 성공, 취소, 만료, 실패)'
  },
  paymentKey: {
    field: 'payment_key',
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '결제고유키'
  },
  orderId: {
    field: 'order_id',
    type: DataTypes.STRING(64),
    allowNull: false,
    comment: '주문 번호',
  },
  method: {
    field: 'method',
    type: DataTypes.STRING(30),
    allowNull: true,
    comment: '결제 수단',
  },
  approvedAt: {
    field: 'approved_at',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '결제 승인 일시',
  },
  receiptUrl: {
    field: 'recipt_url',
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '영수증 주소',
  },
  cancelReason: {
    field: 'cancel_reason',
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: '취소 이유',
  },
  cancelAt: {
    field: 'cancel_at',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '취소 날짜',
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