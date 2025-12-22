/**
 * @file app/models/Answer.js
 * @description Answer model
 * 251222 v1.0.0 jae init
 */

import dayjs from 'dayjs';
import { DataTypes } from 'sequelize';

const modelName = 'Answer'; // 모델명

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '문의 답변 PK',
  },
  inquiryId: {
    field: 'inquiry_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '문의 PK',
  },
  adminId: {
    field: 'admin_id',
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    comment: '관리자 PK',
  },
  content: {
    field: 'content',
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '문의답변',
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
  tableName: 'answers',  // 실제 DB 테이블명
  timestams: true,             // createdAt, updatedAt를 자동 관리
  paranoid: true,              // soft delete 설정 (deletedAt 자동 관리)
}

const Answer = {
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
    db.Answer.belongsTo(db.Inquiry, { targetKey: 'id', foreignKey: 'inquiryId', as: 'inquiry' });
    db.Answer.belongsTo(db.Admin, { targetKey: 'id', foreignKey: 'adminId', as: 'admin' });
  }
}

export default Answer;