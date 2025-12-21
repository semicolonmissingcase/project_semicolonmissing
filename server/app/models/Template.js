/**
 * @file app/models/Template.js
 * @description Template model
 * 251222 v1.0.0 jae init
 */

import dayjs from 'dayjs';
import { DataTypes } from 'sequelize';

const modelName = 'Template'; // 모델명

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '템플릿 PK',
  },
  cleanerId: {
    field: 'cleaner_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '기사 PK',
  },
  estimatedAmount: {
    field: 'estimated_amount',
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '견적 금액',
  },
  description: {
    field: 'description',
    type: DataTypes.STRING(400),
    allowNull: true,
    comment: '견적설명',
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
  tableName: 'templates',  // 실제 DB 테이블명
  timestams: true,             // createdAt, updatedAt를 자동 관리
  paranoid: true,              // soft delete 설정 (deletedAt 자동 관리)
}

const Template = {
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
    db.Template.belongsTo(db.Cleaner, { targetKey: 'id', foreignKey: 'cleanerId', as: 'cleaner' });
  }
}

export default Template;