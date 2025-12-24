/**
 * @file app/models/ChatRoom.js
 * @description ChatRoom model
 * 251219 v1.0.0 jae init
 */

import dayjs from 'dayjs';
import { DataTypes } from 'sequelize';

const modelName = 'ChatRoom'; // 모델명

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
    allowNull: true,
    comment: '점주가 체팅방을 나간 시간',
  },
  cleanerLeavedAt: {
    field: 'cleaner_leaved_at',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '기사가 채팅방을 나간 시간',
  }
};

const options = {
  tableName: 'chat_rooms',  // 실제 DB 테이블명
  timestamps: true,      // createdAt, updatedAt를 자동 관리
  paranoid: false,       // soft delete 설정 (deletedAt 자동 관리), leaved_at이 관리하고, deleatedAt이 없으므로 false로 바꿈.
}

const ChatRoom = {
  init: (sequelize) => {
    const define = sequelize.define(modelName, attributes, options);

    return define;
  },
  associate: (db) => {
    db.ChatRoom.belongsTo(db.Owner, { targetKey: 'id', foreignKey: 'ownerId', as: 'owner'});
    db.ChatRoom.belongsTo(db.Cleaner, { targetKey: 'id', foreignKey: 'cleanerId', as: 'cleaner'});
    db.ChatRoom.belongsTo(db.Estimate, { targetKey: 'id', foreignKey: 'estimateId', as: 'estimate'});
    db.ChatRoom.hasMany(db.ChatMessage, { sourceKey: 'id', foreignKey: 'chatRoomId', as: 'chatMessages'}); 
  }
}

export default ChatRoom;