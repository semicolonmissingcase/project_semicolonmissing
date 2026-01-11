/**
 * @file app/models/Notification.js
 * @description Notification model
 * 260107 v1.0.0 jae init
 */

import dayjs from 'dayjs';
import { DataTypes } from 'sequelize';

const modelName = 'Notification'; // 모델명

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '알림 PK',
  },
  receiverId: {
    field: 'receiver_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    comment: '수신자 pk'
  },
  receiverRole: {
    field: 'receiver_role',
    type: DataTypes.ENUM('OWNER', 'CLEANER'),
    allowNull: false,
    comment: '수신자 유형 (OWNER, CLEANER)',
  },
  senderId: {
    field: 'sender_id',
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    comment: '발신자 PK (관리자, 점주, 기사 ID / 시스템 발송 시 null)',
  },
  senderRole: {
    field: 'sender_role',
    type: DataTypes.ENUM('OWNER', 'CLEANER', 'ADMIN', 'SYSTEM'),
    allowNull: false,
    comment: '발신자 유형 (ADMIN, SYSTEM)',
  },
  type: {
    field: 'type',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '알림 유형',
  },
  title: {
    field: 'title',
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: '제목',
  },
  content: {
    field: 'content',
    type: DataTypes.STRING(1000),
    allowNull: false,
    comment: '내용'
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    allowNull: true,
    get() {
      const val = this.getDataValue('createdAt')
      if (!val) {
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
      if (!val) {
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
      if (!val) {
        return null;
      }
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
    }
  }
};

const options = {
  tableName: 'notifications',           // 실제 DB 테이블명
  timestamps: true,                     // createdAt, updatedAt를 자동 관리
  paranoid: true,                       // soft delete 설정 (deletedAt 자동 관리)
}

const Notification = {
  init: (sequelize) => {
    const define = sequelize.define(modelName, attributes, options);

    // JSON으로 serialize시, 제외할 컬럼을 지정
    define.prototype.toJSON = function () {
      const attributes = this.get();

      return attributes;
    }

    return define;
  },
}

export default Notification;