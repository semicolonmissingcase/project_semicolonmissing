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
        isAssign: '일반',
        cleanerId: null,
      },
      {
        id: 2,
        ownerId: 2,
        storeId: 2, 
        date: '2025-12-31',
        time: '10:00:00',
        status: '승인',
        status: '일반',
        cleanerId: null,
      },
      {
        id: 3,
        ownerId: 3,
        storeId: 3,
        date: '2025-12-26',
        time: '12:00:00',
        status: '완료',
        status: '요청',
        cleanerId: 1, 
      },
      {
        id: 4,
        ownerId: 4,
        storeId: 4,
        date: '2025-12-28',
        time: '09:30:00',
        status: '취소',
        status: '지정',
        cleanerId: null,
      },
      {
        id: 5,
        ownerId: 5,
        storeId: 5,
        date: '2025-12-20',
        time: '15:00:00',
        status: '완료',
        status: '지정',
        cleanerId: 2,
      },
      {
        id: 6,
        ownerId: 6,
        storeId: 6,
        date: '2025-12-22',
        time: '11:00:00',
        status: '요청',
        status: '지정',
        cleanerId: 1,
      },
      {
        id: 7,
        ownerId: 7,
        storeId: 7,
        date: '2025-12-25',
        time: '13:00:00',
        status: '승인',
        status: '일반',
        cleanerId: null,
      },
      {
        id: 8,
        ownerId: 8,
        storeId: 8,
        date: '2025-12-27',
        time: '16:00:00',
        status: '취소',
        status: '일반',
        cleanerId: null,
      },
      {
        id: 9,
        ownerId: 9,
        storeId: 9,
        date: '2025-12-19',
        time: '10:30:00',
        status: '요청',
        status: '일반',
        cleanerId: null,
      },
      {
        id: 10,
        ownerId: 10,
        storeId: 10,
        date: '2025-12-21',
        time: '14:00:00',
        status: '승인',
        status: '일반',
        cleanerId: null,
      }
    ];

    // 데이터 생성: 모델의 bulkCreate 사용
    await Reservation.bulkCreate(records);
  },

  async down (queryInterface, Sequelize) {
    // 데이터 삭제
    await queryInterface.bulkDelete(tableName, null, {});
  }
};