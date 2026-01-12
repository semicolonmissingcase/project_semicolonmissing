/**
 * @file databases/migrations/20260112-01-create-bank_codes.js
 * @description bank_codes migration file
 * 260112 v1.0.0 yh init
 */

import { DataTypes } from "sequelize";

// 테이블명 
const tableName = 'bank_codes';

// 컬럼 정의
const attributes = {
  code: {
    field: 'code',
    type: DataTypes.CHAR(3),
    primaryKey: true,
    allowNull: false,
    comment: '은행 코드'
  },
  name: {
    field: 'name',
    type: DataTypes.STRING(15),
    allowNull: false,
    comment: '은행 명'
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