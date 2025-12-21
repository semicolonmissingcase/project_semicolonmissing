/**
 * @file databases/migrations/20251219-19-create-adjustments.js
 * @description adjustments migration file
 * 251219 v1.0.0 jae init
 */

import { DataTypes } from "sequelize";

// 테이블명 
const tableName = 'adjustments';

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '기사정산 PK',
  },
  cleanerId: {
    field: 'cleaner_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '기사 PK',
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
  paymentId: {
    field: 'payment_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '결제 PK',
  },
  bank: {
    field: 'bank',
    type: DataTypes.STRING(20),
    allowNull: false, 
    comment: '은행',
  },
  depositor: {
    field: 'depositor',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '예금주',
  },
  accountNumber: {
    field: 'account_nuber',
    type: DataTypes.STRING(20), // TO-DO 추가 논의 필요
    allowNull: false,
    comment: '계좌번호',
  },
  isPrimary: {
    field: 'is_primary',
    type: DataTypes.BOOLEAN,
    allowNull: true,   // TO-DO 추가 논의 필요
    comment: '주계좌여부'
  },
  status: {
    field: 'status',
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '상태(완료/미완료)'
  },
  settlementAmount: {
    field: 'settlement_amount',
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '정산금액'
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