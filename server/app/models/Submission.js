/**
 * @file app/models/Submission.js
 * @description Submission model
 * 251222 v1.0.0 jae init
 */

import dayjs from 'dayjs';
import { DataTypes } from 'sequelize';

const modelName = 'Submission'; // 모델명

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '제출 PK',
  },
  questionId: {
    field: 'question_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    comment: '질문 PK',
  },
  reservationId: {
    field: 'reservation_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '예약 PK',
  },
  questionOptionId: {
    field: 'question_option_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    comment: '질문 선다 PK(객관식 답변)',
  },
  answerText: {
    field: 'answer_text',
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '추가 요청 사항 답변',
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
  tableName: 'submissions',  // 실제 DB 테이블명
  timestamps: true,             // createdAt, updatedAt를 자동 관리
  paranoid: true,              // soft delete 설정 (deletedAt 자동 관리)
}

const Submission = {
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
    db.Submission.belongsTo(db.Question, { targetKey: 'id', foreignKey: 'questionId', as: 'question' });
    db.Submission.belongsTo(db.QuestionOption, { targetKey: 'id', foreignKey: 'questionOptionId', as: 'questionOption' });
    db.Submission.belongsTo(db.Reservation, { targetKey: 'id', foreignKey: 'reservationId', as: 'reservation' });
  }
}

export default Submission;