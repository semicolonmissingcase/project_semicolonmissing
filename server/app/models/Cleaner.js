/**
 * @file app/models/Cleaner.js
 * @description Cleaner model
 * 251219 v1.0.0 jae init
 */

import dayjs from 'dayjs';
import { DataTypes } from 'sequelize';

const modelName = 'Cleaner'; // 모델명

// 컬럼 정의
const attributes = {
  id: {
    field: 'id',
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    comment: '기사 PK',
  },
  name: {
    field: 'name',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '기사 이름',
  },
  gender: {
    field: 'gender',
    type: DataTypes.CHAR(1),
    allowNull: false,
    comment: '기사 성별',
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
    comment: '기사 전화번호',
  },
  profile: {
    field: 'profile',
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '기사 프로필',
  },
  introduction: {
    field: 'introduction',
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: '한줄 소개',
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
  tableName: 'cleaners',  // 실제 DB 테이블명
  timestams: true,      // createdAt, updatedAt를 자동 관리
  paranoid: true,       // soft delete 설정 (deletedAt 자동 관리)
}

const Cleaner = {
  init: (sequelize) => {
    const define = sequelize.define(modelName, attributes, options);

    // JSON으로 serialize시, 제외할 컬럼을 지정
    define.prototype.toJSON = function () {
      const attributes = this.get();
      delete attributes.password;
      delete attributes.refreshToken;

      return attributes;
    }

    return define;
  },
  associate: (db) => {
    db.Cleaner.hasMany(db.ChatRoom, { sourceKey: 'id', foreignKey: 'cleanerId', as: 'chatRooms' });
    db.Cleaner.hasMany(db.Estimate, { sourceKey: 'id', foreignKey: 'cleanerId', as: 'estimates' });
    db.Cleaner.hasMany(db.Reservation, { sourceKey: 'id', foreignKey: 'cleanerId', as: 'reservations' });
    db.Cleaner.hasMany(db.DriverRegion, { sourceKey: 'id', foreignKey: 'cleanerId', as: 'driverRegions' });
    db.Cleaner.belongsToMany(db.Location, { through: db.DriverRegion, foreignKey: 'cleanerId', otherKey: 'locationId', as: 'locations' });
    db.Cleaner.hasMany(db.Certification, { sourceKey: 'id', foreignKey: 'cleanerId', as: 'certification' });
    db.Cleaner.hasMany(db.Inquiry, { sourceKey: 'id', foreignKey: 'cleanerId', as: 'inquiries' });
    db.Cleaner.hasMany(db.CleanerAccount, { sourceKey: 'id', foreignKey: 'cleanerId', as: 'cleanerAccounts' });
    db.Cleaner.hasMany(db.Like, { sourceKey: 'id', foreignKey: 'cleanerId', as: 'likes' });
    db.Cleaner.hasMany(db.Review, { sourceKey: 'id', foreignKey: 'cleanerId', as: 'reviews' });
  }
}

export default Cleaner;