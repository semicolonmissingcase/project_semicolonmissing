/**
 * @file databases/seeders/dummy-stores.seeder.js
 * @description stores table dummy data create based on Store model
 * 231223 v1.0.0 seon init
 */
import { fakerKO as faker } from '@faker-js/faker';
import db from '../../app/models/index.js';
const { Store } = db;

export default {
  async up(queryInterface, Sequelize) {
    // 1. 첫 번째 고정 데이터 (깨끗한 제빙기 카페)
    const records = [
      {
        ownerId: 1,
        name: '깨끗한 제빙기 카페',
        addr1: '서울특별시',
        addr2: '강남구 역삼동',
        addr3: '1-45번지 1층',
        phoneNumber: '0212345678',
      }
    ];

    // 2. 나머지 29개 랜덤 데이터 생성 (ownerId 2번부터 30번까지 연결)
    for (let i = 2; i <= 30; i++) {
      records.push({
        ownerId: i, // 앞서 생성한 점주들의 ID와 매칭
        name: `${faker.person.lastName()}${faker.helpers.arrayElement(['카페', '커피숍', '커피', '플레이스'])}`,
        addr1: faker.location.state(), // 시/도 (예: 경기도)
        addr2: `${faker.location.city()} ${faker.location.street()}`, // 구/동 (예: 성남시 분당구)
        addr3: `${faker.string.numeric(2)}-${faker.string.numeric(1)}번지 ${faker.helpers.arrayElement(['1층', '2층', 'B1층'])}`,
        phoneNumber: `02${faker.string.numeric(8)}`, // 랜덤 서울 지역 번호 형태
      });
    }

    // bulkCreate로 데이터 삽입
    await Store.bulkCreate(records);
  },

  async down(queryInterface, Sequelize) {
    // 데이터 삭제
    await Store.destroy({ truncate: { cascade: true }, force: true });
  }
};