/**
 * @file app/models/Payment.js
 * @description Payment model
 * 251222 v1.0.0 jae init
 */

import dayjs from 'dayjs';
import { DataTypes } from 'sequelize';

const modelName = 'Payment'; // 모델명

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '결제 PK',
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
  totalAmount: {
    field: 'total_amount',
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '실제 결제 금액',
  },
  status: {
    field: 'status',
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '상태(대기, 성공, 취소, 만료, 실패)'
  },
  paymentKey: {
    field: 'payment_key',
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '결제고유키'
  },
  orderId: {
    field: 'order_id',
    type: DataTypes.STRING(64),
    allowNull: false,
    comment: '주문 번호',
  },
  method: {
    field: 'method',
    type: DataTypes.STRING(30),
    allowNull: true,
    comment: '결제 수단',
  },
  approvedAt: {
    field: 'approved_at',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '결제 승인 일시',
  },
  receiptUrl: {
    field: 'recipt_url',
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '영수증 주소',
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
  tableName: 'payments',        // 실제 DB 테이블명
  timestamps: true,             // createdAt, updatedAt를 자동 관리
  paranoid: true,              // soft delete 설정 (deletedAt 자동 관리)
}

const Payment = {
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
    db.Payment.belongsTo(db.Estimate, { targetKey: 'id', foreignKey: 'estimateId', as: 'estimate' });
    db.Payment.belongsTo(db.Reservation, { targetKey: 'id', foreignKey: 'reservationId', as: 'reservation' });
  }
}

export default Payment;