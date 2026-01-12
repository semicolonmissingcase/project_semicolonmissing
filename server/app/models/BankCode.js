/**
 * @file app/models/BankCode.js
 * @description BankCode Model file
 * 260112 v1.0.0 yh init
 */

import dayjs from 'dayjs';
import { DataTypes } from "sequelize";

// 테이블명 
const modelName = 'BankCode';

// 컬럼 정의
const attributes = {
  code: {
    field: 'code',
    type: DataTypes.CHAR(3),
    primaryKey: true,
    allowNull: false,
    comment: '은행 코드'
  },
  name: {
    field: 'name',
    type: DataTypes.STRING(15),
    allowNull: false,
    comment: '은행 명'
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

// 옵션 

const options = {
  tableName: 'bank_codes',  // 실제 DB 테이블명
  timestamps: true,             // createdAt, updatedAt를 자동 관리
  paranoid: true,              // soft delete 설정 (deletedAt 자동 관리)
}

const BankCode = {
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
    db.BankCode.hasMany(db.CleanerAccount, { sourceKey: 'code', foreignKey: 'bankCode', as: 'cleanerAccounts' });
  }
}

export default BankCode;