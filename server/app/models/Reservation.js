/**
 * @file app/models/Reservation.js
 * @description Reservation model
 * 251222 v1.0.0 jae init
 */

import dayjs from 'dayjs';
import { DataTypes } from 'sequelize';

const modelName = 'Reservation'; // 모델명

// 컬럼 정의
// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '예약 PK',
  },
  ownerId: {
    field: 'owner_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '점주 PK',
  },
  storeId: {
    field: 'store_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '매장 PK',
  },
  date: {
    field: 'date',
    type: DataTypes.DATE,
    allowNull: false,
    comment: '희망 날짜',
  },
  time: {
    field: 'time',
    type: DataTypes.TIME,
    allowNull: false,
    comment: '희망 시간(nullable 고려중)', 
  },
  status: {
    field: 'status',
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '상태(요청, 승인, 진행중, 완료, 동의, 취소)'
  },
  CleanerId: {
    field: 'cleaner_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    comment: '기사 PK(nullable 고려)'
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
  tableName: 'reservations',  // 실제 DB 테이블명
  timestamps: true,             // createdAt, updatedAt를 자동 관리
  paranoid: true,              // soft delete 설정 (deletedAt 자동 관리)
}

const Reservation = {
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
    db.Reservation.belongsTo(db.Owner, { targetKey: 'id', foreignKey: 'ownerId', as: 'owner' });
    db.Reservation.belongsTo(db.Cleaner, { targetKey: 'id', foreignKey: 'cleanerId', as: 'cleaner' });
    db.Reservation.belongsTo(db.Store, { targetKey: 'id', foreignKey: 'storeId', as: 'store' });
  }
}

export default Reservation;