/**
 * @file databases/seeders/dummy-reservations.seeder.js
 * @description reservations table dummy data create
 * 231223 v1.0.0 seon init
 */
import db from '../../app/models/index.js';
const { Reservation } = db;

// 테이블명 (down 메소드에서 사용)
const tableName = 'reservations';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    // 레코드 정보
    const records = [
      {
        id: 1,
        ownerId: 1,
        storeId: 1,
        date: '2025-12-30',
        time: '14:00:00',
        status: '요청',
        cleanerId: null, // 요청 단계라 기사가 아직 배정 안 된 경우
      },
      {
        id: 2,
        ownerId: 1,
        storeId: 2,
        date: '2025-12-31',
        time: '10:00:00',
        status: '승인',
        cleanerId: null,
      },
      {
        id: 3,
        ownerId: 1,
        storeId: 3,
        date: '2025-12-26',
        time: '12:00:00',
        status: '완료',
        cleanerId: 1,
      },
    ];

    // 데이터 생성: 모델의 bulkCreate 사용
    await Reservation.bulkCreate(records);
  },

  async down (queryInterface, Sequelize) {
    // 데이터 삭제
    await queryInterface.bulkDelete(tableName, null, {});
  }
};