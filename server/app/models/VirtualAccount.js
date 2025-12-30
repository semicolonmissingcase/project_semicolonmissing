/**
 * @file app/models/VirtualAccount.js
 * @description VirtualAccount model
 * 251230 v1.0.0 jae init
 */

import dayjs from 'dayjs';
import { DataTypes } from 'sequelize';

const modelName = 'VirtualAccount'; // 모델명

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '가상계좌대기 PK',
  },
  reservationId: {
    field: 'reservation_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '예약 PK',
  },
  orderId: {
    field: 'order_id',
    type: DataTypes.STRING(64),
    allowNull: false,
    comment: '주문번호'
  },
  bankCode: {
    field: 'bank_code',
    type: DataTypes.STRING(10),
    allownull: false,
    comment: '은행코드',
  },
  accountNumber: {
    field: 'account_number',
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: '가상계좌번호',
  },
  accountType: {
    field: 'account_type',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '계좌 타입',
  },
  customerName: {
    field: 'customer_name',
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '입금자명',
  },
  dueDate: {
    field: 'due_date',
    type: DataTypes.DATE,
    allowNull: false,
    comment: '입금기한',
  },
  isSettlement: {
    field: 'is_settlement',
    type: DataTypes.BOOLEAN,
    allowNull: false,
    comment: '입금완료여부',
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
  tableName: 'virtual_accounts',        // 실제 DB 테이블명
  timestamps: true,                     // createdAt, updatedAt를 자동 관리
  paranoid: true,                       // soft delete 설정 (deletedAt 자동 관리)
}

const VirtualAccount = {
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
    db.VirtualAccount.belongsTo(db.Reservation, { targetKey: 'id', foreignKey: 'reservationId', as: 'reservation' });
  }
}

export default VirtualAccount;