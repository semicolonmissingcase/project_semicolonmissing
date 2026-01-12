/**
 * @file app/models/CleanerAccount.js
 * @description CleanerAccount model
 * 260103 v1.0.0 jae init
 */

import dayjs from 'dayjs';
import { DataTypes } from 'sequelize';

const modelName = 'CleanerAccount'; // 모델명

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '기사계좌PK',
  },
  cleanerId: {
    field: 'cleaner_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '기사 PK',
  },
  bankCode: {
    field: 'bank_code',
    type: DataTypes.STRING(20),
    allownull: true,
    comment: '은행코드',
  },
  depositor: {
    field: 'depositor',
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '예금주',
  },
  accountNumber: {
    field: 'accountNumber',
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '계좌번호',
  },
  isDefault: {
    field: 'is_default',
    type: DataTypes.BOOLEAN,
    allowNull: true,
    comment: '주계좌'
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
  tableName: 'cleaner_accounts',  // 실제 DB 테이블명
  timestams: true,               // createdAt, updatedAt를 자동 관리
  paranoid: true,               // soft delete 설정 (deletedAt 자동 관리)
}

const CleanerAccount = {
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
    db.CleanerAccount.belongsTo(db.Cleaner, { targetKey: 'id', foreignKey: 'cleanerId', as: 'cleaner' });
    db.CleanerAccount.belongsTo(db.BankCode, { targetKey: 'code', foreignKey: 'bankCode', as: 'bank' });
  }
}

export default CleanerAccount;