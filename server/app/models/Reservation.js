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
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: '희망 날짜',
    get() {
      const val = this.getDataValue('date')
      if(!val) {
        return null;
      }
      return dayjs(val).format('YYYY-MM-DD');
    }  
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
  isAssign: {
    field: 'is_assign',
    type: DataTypes.ENUM('지정', '일반'),
    allowNull: false,
    comment: '기사 지정 상태'
  },
  dateAgreedUpon: {
    field: 'date_agreed_upon',
    type: DataTypes.BOOLEAN,
    allowNull: true,
    comment: '날짜 협의 가능',
  },
  cleanerId: {
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
    db.Reservation.hasMany(db.Submission, { sourceKey: 'id', foreignKey: 'reservationId', as: 'submission' });
    db.Reservation.hasMany(db.ReservationImage, { sourceKey: 'id', foreignKey: 'reservationId', as: 'ReservationImage' });
    db.Reservation.hasMany(db.VirtualAccount, { sourceKey: 'id', foreignKey: 'reservationId', as: 'virtualAccount' });
    db.Reservation.hasMany(db.Review, { sourceKey: 'id', foreignKey: 'reservationId', as: 'reviews' });
    db.Reservation.hasOne(db.Estimate, { sourceKey: 'id', foreignKey: 'reservationId', as: 'estimate' });
  }
}

export default Reservation;