/**
 * @file app/models/Inquiry.js
 * @description Inquiry model
 * 251222 v1.0.0 jae init
 */

import dayjs from 'dayjs';
import { DataTypes } from 'sequelize';

const modelName = 'Inquiry'; // 모델명

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '문의 PK',
  },
 ownerId: {
  field: 'owner_id',
  type: DataTypes.BIGINT.UNSIGNED,
  allowNull: true,
  comment: '점주 PK(nullable 설정해야함)',
 },
 cleanerId: {
  field: 'cleaner_id',
  type: DataTypes.BIGINT.UNSIGNED,
  allowNull: true,
  comment: '기사 PK(nullable 설정해야함)',
 },
  title: {
    field: 'title',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '제목',
  },
  content: {
    field: 'content',
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '문의내용',
  },
  guestName: {
    field: 'guest_name',
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '비회원 이름(nullable 설정해야함)'
  },
  guestPassword: {
    field: 'guest_password',
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '비회원 비밀번호(nullable)'
  },
  status: {
    field: 'status',
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'PENDING',
    comment: '상태(PENDING, COMPLETED)',
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
  tableName: 'inquiries',  // 실제 DB 테이블명
  timestamps: true,             // createdAt, updatedAt를 자동 관리
  paranoid: true,              // soft delete 설정 (deletedAt 자동 관리)
}

const Inquiry = {
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
    db.Inquiry.belongsTo(db.Owner, { targetKey: 'id', foreignKey: 'ownerId', as: 'owner' });
    db.Inquiry.belongsTo(db.Cleaner, { targetKey: 'id', foreignKey: 'cleanerId', as: 'cleaner' });
  }
}

export default Inquiry;