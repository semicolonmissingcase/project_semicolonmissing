/**
 * @file databases/seeders/dummy-owners.seeder.js
 * @description owners table dummy data create
 * 251229 v1.0.0 jae init
 */
import bcrypt from 'bcrypt';

// 테이블명 
const tableName = 'owners';

/**@type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    // 레코드 정보 
    const records = [
      {
        email: 'owner@owner.com',
        password: await bcrypt.hash('qwe12312', 10),
        name: '차점주',
        gender: 'F',
        provider: 'NONE',
        phoneNumber: '010-1111-1111',
        profile: '',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    // 데이터 생성 : queryInterface.bulkInsert(tabelName, records, options)
    await queryInterface.bulkInsert(tableName, records, {});
  },

  async down (queryInterface, Sequelize) {
    // 데이터 삭제 : queryInterface.bulkDelete(tabelName, null, options)
    await queryInterface.bulkDelete(tableName, null, {});
  }
};