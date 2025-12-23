/**
 * @file databases/seeders/dummy-estimates.seeder.js
 * @description estimates table dummy data create
 * 251222 v1.0.0 jae init
 */

import db from '../../app/models/index.js';
const { Estimate } = db;

// 테이블명 
const tableName = 'estimates';

/**@type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    // 레코드 정보 
    const records = [
      {
        cleanerId: 1,
        reservationId: 1,
        estimatedAmount: 300000,
        description: '사장님, 제빙기 내부 상태 확인해봤는데요. 스케일이랑 물때가 꽤 쌓여 있어서 분해 세척이 필요합니다.',
        status: '전송',
        // created_at: new Date(),
        // updated_at: new Date(),
      },
       {
        cleanerId: 1,
        reservationId: 2,
        estimatedAmount: 250000,
        description: '견적 금액 확인 부탁드립니다.',
        status: '수락',
        // created_at: new Date(),
        // updated_at: new Date(),
      },
    ];

    // 데이터 생성 : queryInterface.bulkInsert(tabelName, records, options)
    // await queryInterface.bulkInsert(tableName, records, {});
    await Estimate.bulkCreate(records);
  },

  async down (queryInterface, Sequelize) {
    // 데이터 삭제 : queryInterface.bulkDelete(tabelName, null, options)
    await queryInterface.bulkDelete(tableName, null, {});
  }
};