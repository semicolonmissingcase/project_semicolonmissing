/**
 * @file databases/migrations/20251218-13-create-chat_rooms.js
 * @description chatRooms migration file
 * 251218 v1.0.0 jae init
 */

import { DataTypes } from "sequelize";

const tableName = 'chat_rooms';

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
    unique: false,
    comment: '기사 PK',
  },
  estimateId: {
    field: 'estimate_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    unique: false,
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
    allowNull: true,
    comment: '점주가 채팅방을 나간 시간',
  },
  cleanerLeavedAt: {
    field: 'cleaner_leaved_at',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '기사가 채팅방을 나간 시간',
  }
};

const options = {
  charset: 'utf8mb4',
  collate: 'utf8mb4_bin',
  engine: 'InnoDB'
};

export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, attributes, options);

    await queryInterface.addIndex(tableName, ['owner_id', 'cleaner_id', 'estimate_id'], {
      unique: true,
      name: 'unique_chat_room_per_estimate'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(tableName);
  }
};