/**
 * @file databases/migrations/20251218-14-create-chatMessages.js
 * @description chatMessages migration file
 * 251218 v1.0.0 jae init
 */

import { DataTypes, TINYINT } from "sequelize";

// 테이블명 
const tableName = 'chatMessages';

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '채팅메세지 PK',
  },
  chatRoomId: {
    field: 'chat_room_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '채팅방 PK',
  },
  content: {
    field: 'content',
    type: DataTypes.STRING(2000),
    allowNull: false,
    comment: '내용', 
  },
  isRead: {
    field: 'is_read',
    type: TINYINT(1),
    defaultValue: 0,
    allowNull: false,
    comment: '읽음 여부',
  },
  senderId: {
    field: 'sender_id',
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: '발신자',
  },
  senderRole: {
    field: 'sender_role',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '발신자 역할',
  },
  createdAt: {
    field: 'credated_at',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '작성일', 
  },
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