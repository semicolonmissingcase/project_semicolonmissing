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
    field: 'credated_at',
    type: DataTypes.DATE,
    allowNull: true,
    get() {
      const val = this.getDataValue('createdAt')
      if(!val) {
        return null;
      }
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
    } 
  },
  deletedAt: {
    field: 'deleted_at',
    type: DataTypes.DATE,
    allowNull: true,
    get() {
      const val = this.getDataValue('deletedAt')
      if(!val) {
        return null;
      }
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
    }    
  }
};

const options = {
  tableName: 'chat_rooms',  // 실제 DB 테이블명
  timestams: true,      // createdAt, updatedAt를 자동 관리
  paranoid: true,       // soft delete 설정 (deletedAt 자동 관리)
}

const ChatRoom = {
  init: (sequelize) => {
    const define = sequelize.define(modelName, attributes, options);

    return define;
  },
  associate: (db) => {
    db.ChatRoom.belongsTo(db.Owner, { tragetKey: 'id', foreignKey: 'ownerId', as: 'owner'});
    db.ChatRoom.belongsTo(db.Cleaner, { tragetKey: 'id', foreignKey: 'cleanerId', as: 'cleaner'});
    db.ChatRoom.belongsTo(db.Estimate, { tragetKey: 'id', foreignKey: 'estimateId', as: 'estimate'});
    db.ChatRoom.hasMany(db.ChatMessage, { sourceKey: 'id', foreignKey: 'chatRoomId', as: 'chatMessages'}); 
  }
}

export default ChatRoom;