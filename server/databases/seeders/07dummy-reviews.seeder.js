/**
 * @file databases/seeders/dummy-reviews.seeder.js
 * @description reviews table dummy data create
 * 231231 v1.0.0 jae init
 */
import db from '../../app/models/index.js';
const { Review } = db;

// 테이블명 (down 메소드에서 사용)
const tableName = 'reviews';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    // 레코드 정보
    const records = [
      {
        ownerId: 1,
        reservationId: 3,
        content: '청소 과정도 상세히 설명해 주시고, 평소 관리 방법까지 친절하게 알려주셔서 큰 도움이 되었습니다. 다음에도 꼭 이 기사님께 부탁드리고 싶어요.',
        star: 5,
      },
    ];

    // 데이터 생성: 모델의 bulkCreate 사용
    await Review.bulkCreate(records);
  },

  async down (queryInterface, Sequelize) {
    // 데이터 삭제
    await queryInterface.bulkDelete(tableName, null, {});
  }
};