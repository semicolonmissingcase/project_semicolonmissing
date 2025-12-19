/**
 * @file app/models/Estimate.js
 * @description Estimate model
 * 251219 v1.0.0 jae init
 */

import dayjs from 'dayjs';
import { DataTypes } from 'sequelize';

const modelName = 'Estimate'; // 모델명

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '견적서 PK',
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
  status: {
    field: 'status',
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '상태(전송, 수락)'
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
  upatedAt: {
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
  tableName: 'estimates',     // 실제 DB 테이블명
  timestams: true,            // createdAt, updatedAt를 자동 관리
  paranoid: true,             // soft delete 설정 (deletedAt 자동 관리)
}

const Estimate = {
  init: (sequelize) => {
    const define = sequelize.define(modelName, attributes, options);

    return define;
  },
  associate: (db) => {
    db.Estimate.hasMany(db.ChatRoom, { sourceKey: 'id', foreignKey: 'estimateId', as: 'chatRooms'});
    db.Estimate.belongsTo(db.Cleaner, { targetKey: 'id', foreignKey: 'cleanerId', as: 'cleaner'});
  }
}

export default Estimate;