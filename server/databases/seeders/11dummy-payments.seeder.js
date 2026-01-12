/**
 * @file databases/seeders/dummy-payments.seeder.js
 * @description payments table dummy data create
 * 231231 v1.0.0 jae init
 */
import db from '../../app/models/index.js';
const { Payment } = db;

// 테이블명 (down 메소드에서 사용)
const tableName = 'payments';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    // 레코드 정보
    const records = [
      {
        estimateId: 2,
        reservationId: 3,
        totalAmount: 250000,
        status: '성공',
        paymentKey: 'test_payment_key_0001',
        orderId: 'ORDER-20231027-0001',
        method: 'CARD',
        approvedAt: new Date(),
        reciptUrl: 'https://confirm.toss.im/receipt/v1/test_url_001',
      },
    ];

    // 데이터 생성: 모델의 bulkCreate 사용
    await Payment.bulkCreate(records);
  },

  async down (queryInterface, Sequelize) {
    // 데이터 삭제
    await Payment.destroy({ truncate: true, force: true });
  }
};