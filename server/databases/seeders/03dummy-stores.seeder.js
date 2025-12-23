/**
 * @file databases/seeders/dummy-stores.seeder.js
 * @description stores table dummy data create based on Store model
 * 231223 v1.0.0 seon init
 */
import db from '../../app/models/index.js';
const { Store } = db;

const tableName = 'stores';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    const records = [
      {
        id: 1,
        ownerId: 1,
        name: '깨끗한 제빙기 카페',
        addr1: '서울특별시',        // 모델의 addr1 (시/도)
        addr2: '강남구 역삼동',      // 모델의 addr2 (군/구/읍/면/동)
        addr3: '1-45번지 1층',    // 모델의 addr3 (상세주소)
        phoneNumber: '0212345678', // 모델의 phoneNumber
      },
      {
        id: 2,
        ownerId: 1,
        name: '차점주 강북점',
        addr1: '서울특별시',
        addr2: '노원구 상계동',
        addr3: '789빌딩 2층',
        phoneNumber: '029876543',
      },
    ];

    // 모델의 bulkCreate 사용
    await Store.bulkCreate(records);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(tableName, null, {});
  }
};