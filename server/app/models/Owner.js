/**
 * @file app/models/Owner.js
 * @description owner model
 * 251219 v1.0.0 jae init
 */

import dayjs from 'dayjs';
import { DataTypes } from 'sequelize';

const modelName = 'Owner'; // 모델명

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true, 
    allowNull: false,
    autoIncrement: true,
    comment: '점주 PK',
  },
  name: {
    field: 'name',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '점주 이름',
  },
  gender: {
    field: 'gender',
    type: DataTypes.CHAR(1),
    allowNull: false,
    comment: '점주 성별',
  },
  email: {
    field: 'email',
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: '이메일(로그인ID)',
  },
  password: {
    field: 'password',
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '비밀번호',
  },
  provider: {
    field: 'provider',
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '로그인 제공자(NONE, KAKAO, NAVER...)',
  },
  phoneNumber: {
    field: 'phone_number',
    type: DataTypes.STRING(13),
    allowNull: false,
    unique: true,  // 중복 가입 방지
    comment: '점주 전화번호',
  },
  profile: {
    field: 'profile',
    type: DataTypes.STRING(100),
    allowNull: true, 
    comment: '점주 프로필',
  },
  refreshToken: {
    field: 'refresh_token',
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '리프레시 토큰',
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
  tableName: 'owners',  // 실제 DB 테이블명
  timestams: true,      // createdAt, updatedAt를 자동 관리
  paranoid: true,       // soft delete 설정 (deletedAt 자동 관리)
}

const Owner = {
  init: (sequelize) => {
    const define = sequelize.define(modelName, attributes, options);

    // JSON으로 serialize시, 제외할 컬럼을 지정
    define.prototype.toJSON = function() {
      const attributes = this.get();
      delete attributes.password;
      delete attributes.refreshToken;

      return attributes;
    }

    return define;
  },
  associate: (db) => {
    db.Owner.hasMany(db.ChatRoom, { sourceKey: 'id', foreignKey: 'ownerId', as: 'chatRooms'});
    db.Owner.hasMany(db.Store, { sourceKey: 'id', foreignKey: 'ownerId', as: 'stores'});
    db.Owner.hasMany(db.Question, { sourceKey: 'id', foreignKey: 'ownerId', as: 'questions'});
    db.Owner.hasMany(db.PushSubscription, { sourceKey: 'id', foreignKey: 'ownerId', as: 'pushSubscriptions'});
    db.Owner.hasMany(db.Review, { sourceKey: 'id', foreignKey: 'ownerId', as: 'reviews'});
    db.Owner.hasMany(db.Like, { sourceKey: 'id', foreignKey: 'ownerId', as: 'likes'});
    db.Owner.hasMany(db.Inquiry, { sourceKey: 'id', foreignKey: 'ownerId', as: 'inquiries'});
  }
}

export default Owner;