/**
 * @file app/models/Question.js
 * @description Question model
 * 251222 v1.0.0 jae init
 */

import dayjs from 'dayjs';
import { DataTypes } from 'sequelize';

const modelName = 'Question'; // 모델명

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '질문 PK',
  },
  code: {
    field: 'code',
    type: DataTypes.CHAR(3),
    allowNull: false,
    comment: '객관식 질문 코드(Q01, Q02, Q03...)',
  },
  content: {
    field: 'content',
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '객관식 질문 내용'
  },
  isActive: {
    field: 'is_active',
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 1, 
    comment: '질문 활성화 여부',
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
  tableName: 'questions',  // 실제 DB 테이블명
  timestamps: true,             // createdAt, updatedAt를 자동 관리
  paranoid: true,              // soft delete 설정 (deletedAt 자동 관리)
}

const Question = {
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
    db.Question.hasMany(db.QuestionOption, { sourcKey: 'id', foreignKey: 'questionId', as: 'questionOptions' });
    db.Question.hasMany(db.Submission, { sourcKey: 'id', foreignKey: 'questionId', as: 'submissions' });
  }
}

export default Question;