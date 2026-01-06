/**
 * @file databases/seeders/dummy-adjustments.seeder.js
 * @description adjustments table dummy data create
 * 231231 v1.0.0 jae init
 */
import db from '../../app/models/index.js';
const { Adjustment } = db;

// 테이블명 (down 메소드에서 사용)
const tableName = 'adjustments';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    // 레코드 정보
    const records = [
      {
        cleanerId: 1,
        estimateId: 2,
        reservationId: 3,
        paymentId: 1,
        bank: 'IBK기업은행',
        depositor: '곽기사',
        accountNumber: '000-00000-00-000',
        status: '완료',
        settlementAmount: 250000,
      },
    ];

    // 데이터 생성: 모델의 bulkCreate 사용
    await Adjustment.bulkCreate(records);
  },

  async down (queryInterface, Sequelize) {
    // 데이터 삭제
    await Adjustment.destroy({ truncate: true, force: true });
  }
};