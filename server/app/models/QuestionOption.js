/**
 * @file app/models/QuestionOption.js
 * @description QuestionOption model
 * 251229 v1.0.0 yh init
 */

import dayjs from 'dayjs';
import { DataTypes } from 'sequelize';

const modelName = 'QuestionOption'; // 모델명

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '질문 선다 PK',
  },
  questionId: {
    field: 'question_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '질문 PK',
  },
  correct: {
    field: 'correct',
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '답변 항목 내용'
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
  tableName: 'question_options',  // 실제 DB 테이블명
  timestamps: true,             // createdAt, updatedAt를 자동 관리
  paranoid: true,              // soft delete 설정 (deletedAt 자동 관리)
}

const QuestionOption = {
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
    db.QuestionOption.belongsTo(db.Question, { targetKey: 'id', foreignKey: 'questionId', as: 'question' });
    db.QuestionOption.hasMany(db.Submission, { sourcKey: 'id', foreignKey: 'questionOptionId', as: 'submissions' });
  }
}

export default QuestionOption;