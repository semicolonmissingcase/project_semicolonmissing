/**
 * @file app/models/Certification.js
 * @description Certification model
 * 251222 v1.0.0 jae init
 */

import dayjs from 'dayjs';
import { DataTypes } from 'sequelize';

const modelName = 'Certification'; // 모델명

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '자격증 PK',
  },
  cleanerId: {
    field: 'cleaner_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '기사 PK',
  },
  name: {
    field: 'name',
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: '자격증제목'
  },
  number: {
    field: 'number',
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '자격증번호',
  },
  image: {
    field: 'image',
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '자격증이미지',
  },
  status: {
    field: 'status',
    type: DataTypes.STRING(30),
    allowNull: true,
    comment: '상태(보류, 승인, 거절)' 
  },
  submittedAt: {
    field: 'submitted_at',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '업로드한 시간',
  },
  reviewedAt: {
    field: 'reviewed_at',
    type: DataTypes.DATE,
    allowNull: true,
    comment: '승인/반려 시간',
  },
  reason: {
    field: 'reason',
    type: DataTypes.STRING(400),
    allowNull: true,
    comment: '반려시 사유'
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
  tableName: 'certifications',  // 실제 DB 테이블명
  timestamps: true,             // createdAt, updatedAt를 자동 관리
  paranoid: true,              // soft delete 설정 (deletedAt 자동 관리)
}

const Certification = {
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
    db.Certification.belongsTo(db.Cleaner, { targetKey: 'id', foreignKey: 'cleanerId', as: 'cleaner' });
  }
}

export default Certification;