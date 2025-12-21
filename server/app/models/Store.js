/**
 * @file app/models/Store.js
 * @description Store model
 * 251222 v1.0.0 jae init
 */

import dayjs from 'dayjs';
import { DataTypes } from 'sequelize';

const modelName = 'Store'; // 모델명

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '매장 PK',
  },
  ownerId: {
    field: 'owner_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '점주 PK',
  },
  name: {
    field: 'name',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '매장명',
  },
  addr1: {
    field: 'addr1',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '시/도',
  },
  addr2: {
    field: 'addr2',
    type: DataTypes.STRING(40),
    allowNull: false,
    comment: '군/구/읍/면/동',
  },
  addr3: {
    field: 'addr3',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '상세주소',
  },
  phoneNumber: {
    field: 'phone_number',
    type: DataTypes.STRING(12),
    allowNull: true,
    comment: '매장번호',
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
  tableName: 'stores',  // 실제 DB 테이블명
  timestams: true,      // createdAt, updatedAt를 자동 관리
  paranoid: true,       // soft delete 설정 (deletedAt 자동 관리)
}

const Store = {
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
    db.Store.belongsTo(db.Owner, { targetKey: 'id', foreignKey: 'ownerId', as: 'owner' });
    db.Store.hasMany(db.Reservation, { sourceKey: 'id', foreignKey: 'storeId', as: 'reservations' });
  }
}

export default Store;