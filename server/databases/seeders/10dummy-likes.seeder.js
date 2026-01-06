/**
 * @file databases/seeders/dummy-likes.seeder.js
 * @description likes table dummy data create
 * 231231 v1.0.0 jae init
 */
import db from '../../app/models/index.js';
const { Like } = db;

// 테이블명 (down 메소드에서 사용)
const tableName = 'likes';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    // 레코드 정보
    const records = [
      {
        ownerId: 1,
        cleanerId: 1,
      },
    ];

    // 데이터 생성: 모델의 bulkCreate 사용
    await Like.bulkCreate(records);
  },

  async down (queryInterface, Sequelize) {
    // 데이터 삭제
    await Like.destroy({ truncate: true, force: true });
  }
};