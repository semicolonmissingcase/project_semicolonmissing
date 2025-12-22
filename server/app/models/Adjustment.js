/**
 * @file app/models/Adjustment.js
 * @description Adjustment model
 * 251222 v1.0.0 jae init
 */

import dayjs from 'dayjs';
import { DataTypes } from 'sequelize';

const modelName = 'Adjustment'; // 모델명

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '기사정산 PK',
  },
  cleanerId: {
    field: 'cleaner_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '기사 PK',
  },
  estimateId: {
    field: 'estimate_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '견적서 PK',
  },
  reservationId: {
    field: 'reservation_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '예약 PK',
  },
  paymentId: {
    field: 'payment_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '결제 PK',
  },
  bank: {
    field: 'bank',
    type: DataTypes.STRING(20),
    allowNull: false, 
    comment: '은행',
  },
  depositor: {
    field: 'depositor',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '예금주',
  },
  accountNumber: {
    field: 'account_nuber',
    type: DataTypes.STRING(20), // TO-DO 추가 논의 필요
    allowNull: false,
    comment: '계좌번호',
  },
  isPrimary: {
    field: 'is_primary',
    type: DataTypes.BOOLEAN,
    allowNull: true,   // TO-DO 추가 논의 필요
    comment: '주계좌여부'
  },
  status: {
    field: 'status',
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '상태(완료/미완료)'
  },
  settlementAmount: {
    field: 'settlement_amount',
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '정산금액'
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
  tableName: 'adjustments',        // 실제 DB 테이블명
  timestamps: true,             // createdAt, updatedAt를 자동 관리
  paranoid: true,              // soft delete 설정 (deletedAt 자동 관리)
}

const Adjustment = {
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
    db.Adjustment.belongsTo(db.Cleaner, { targetKey: 'id', foreignKey: 'cleanerId', as: 'cleaner' });
    db.Adjustment.belongsTo(db.Estimate, { targetKey: 'id', foreignKey: 'estimateId', as: 'estimate' });
    db.Adjustment.belongsTo(db.Reservation, { targetKey: 'id', foreignKey: 'reservationId', as: 'reservation' });
    db.Adjustment.belongsTo(db.Payment, { targetKey: 'id', foreignKey: 'paymentId', as: 'payment' });
  }
}

export default Adjustment;