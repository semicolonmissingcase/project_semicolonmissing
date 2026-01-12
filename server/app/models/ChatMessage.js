/**
 * @file app/models/ChatMessage.js
 * @description ChatMessage model
 * 251219 v1.0.0 jae init
 */

import dayjs from 'dayjs';
import { DataTypes } from 'sequelize';

const modelName = 'ChatMessage'; // 모델명

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
  senderId: {
    field: 'sender_id',
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: '발신자',
  },
  senderType: {
    field: 'sender_type',
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '발신자 유형(OWNER 또는 CLEANER)'
  },
  content: {
    field: 'content',
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '내용', 
  },
  messageType: {
    field: 'message_type',
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'TEXT', 
    comment: '메시지 유형 (TEXT 또는 IMAGE)',
  },
  isRead: {
    field: 'is_read',
    type: DataTypes.TINYINT(1),
    defaultValue: 0,
    allowNull: false,
    comment: '읽음 여부',
  },
    createdAt: {
      field: 'created_at',
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
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
      allowNull: true,
      get() {
        const val = this.getDataValue('updatedAt')
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
  tableName: 'chat_messages',  // 실제 DB 테이블명
  timestamps: true,      // createdAt, updatedAt를 자동 관리
  paranoid: true,       // soft delete 설정 (deletedAt 자동 관리)
}

const ChatMessage = {
  init: (sequelize) => {
    const define = sequelize.define(modelName, attributes, options);

    return define;
  },
  associate: (db) => {
    db.ChatMessage.belongsTo(db.ChatRoom, { targetKey: 'id', foreignKey: 'chatRoomId', as: 'chatRoom'});
  }
}

export default ChatMessage;