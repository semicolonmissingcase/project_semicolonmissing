/**
 * @file databases/seeders/dummy-reservations.seeder.js
 * @description reservations table dummy data create
 * 231223 v1.0.0 seon init
 */
import { fakerKO as faker } from '@faker-js/faker';
import db from '../../app/models/index.js';
const { Reservation } = db;

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // 1. 첫 번째 고정 데이터
    const records = [
      {
        ownerId: 1,
        storeId: 1,
        date: '2025-12-30',
        time: '14:00:00',
        status: '요청',
        isAssign: '일반',
        cleanerId: null,
      },
    ];

    // 2. 나머지 29명의 점주(ownerId 2~30)에 대한 랜덤 예약 생성
    for (let i = 2; i <= 30; i++) {
      // 예약 상태를 다양하게 설정
      const statusList = ['요청', '승인', '취소', '완료'];
      const randomStatus = faker.helpers.arrayElement(statusList);
      
      // 상태가 '완료'나 '승인'일 때만 기사(cleanerId)가 배정된 것으로 설정 (1~30번 기사 중 랜덤)
      const assignedCleanerId = (randomStatus === '승인' || randomStatus === '완료') 
        ? faker.number.int({ min: 1, max: 30 }) 
        : null;

      records.push({
        ownerId: i, // 점주 ID
        storeId: i, // 점주와 매장이 1:1로 생성되었다면 ID가 같습니다.
        // 현재 날짜 기준 미래의 날짜 생성
        date: faker.date.future({ years: 0.1 }).toISOString().split('T')[0], 
        time: `${faker.number.int({ min: 9, max: 18 }).toString().padStart(2, '0')}:00:00`, // 09시~18시 정각
        status: randomStatus,
        isAssign: faker.helpers.arrayElement(['일반', '지정']),
        cleanerId: assignedCleanerId,
      });
    }

    // 데이터 일괄 생성
    await Reservation.bulkCreate(records);
  },

  async down(queryInterface, Sequelize) {
    // 데이터 삭제
    await Reservation.destroy({ truncate: { cascade: true }, force: true });
  }
};