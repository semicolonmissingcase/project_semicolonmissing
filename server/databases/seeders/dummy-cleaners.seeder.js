/**
 * @file databases/seeders/dummy-cleaners.seeder.js
 * @description cleaners table dummy data create
 * 251229 v1.0.0 jae init
 */
import bcrypt from 'bcrypt';
import db from '../../app/models/index.js';
const { Cleaner } = db;

// 테이블명 
const tableName = 'Cleaners';

/**@type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    // 레코드 정보 
    const records = [
      {
        email: 'cleaner@cleaner.com',
        password: bcrypt.hashSync('asd12312', 10),
        name: '곽기사',
        gender: 'F',
        provider: 'NONE',
        phoneNumber: '010-2222-2222',
        profile: '',
        // created_at: new Date(),
        // updated_at: new Date(),
      },
    ];

    // 데이터 생성 : queryInterface.bulkInsert(tabelName, records, options)
    // await queryInterface.bulkInsert(tableName, records, {});
    await Cleaner.bulkCreate(records);
  },

  async down (queryInterface, Sequelize) {
    // 데이터 삭제 : queryInterface.bulkDelete(tabelName, null, options)
    await queryInterface.bulkDelete(tableName, null, {});
  }
};