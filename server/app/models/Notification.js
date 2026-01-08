/**
 * @file app/models/Notification.js
 * @description Notification model
 * 260107 v1.0.0 jae init
 */

import dayjs from 'dayjs';
import { DataTypes } from 'sequelize';

const modelName = 'Notification'; // 모델명

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '알림 PK',
  },
  ownerId: {
    field: 'owner_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '점주 PK'
  },
  cleanerId: {
    field: 'cleaner_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '기사 PK',
  },
  title: {
    field: 'title',
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: '제목',
  },
  content: {
    field: 'content',
    type: DataTypes.STRING(1000),
    allowNull: false,
    comment: '내용'
  },
  isRead: {
    field: 'is_read',
    type: DataTypes.BOOLEAN,
    allowNull: false,
    comment: '읽음 여부'
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
  tableName: 'notifications',           // 실제 DB 테이블명
  timestamps: true,                     // createdAt, updatedAt를 자동 관리
  paranoid: true,                       // soft delete 설정 (deletedAt 자동 관리)
}

const Notification = {
  init: (sequelize) => {
    const define = sequelize.define(modelName, attributes, options);

    // JSON으로 serialize시, 제외할 컬럼을 지정
    define.prototype.toJSON = function() {
      const attributes = this.get();

      return attributes;
    }

    return define;
  },
  associate: (db) => {
    db.Notification.belongsTo(db.Owner, { targetKey: 'id', foreignKey: 'ownerId', as: 'owner' });
    db.Notification.belongsTo(db.Cleaner, { targetKey: 'id', foreignKey: 'cleanerId', as: 'cleaner' });
  }
}

export default Notification;