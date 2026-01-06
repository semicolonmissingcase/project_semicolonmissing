/**
 * @file databases/seeders/dummy-admins.seeder.js
 * @description admins table dummy data create
 * 260103 v1.0.0 jae init
 */
import bcrypt from 'bcrypt';
import db from '../../app/models/index.js';
const { Admin } = db;

// 테이블명 
const tableName = 'admins';

/**@type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    // 레코드 정보 
    const records = [
      {
        email: 'admin@admin.com',
        password: bcrypt.hashSync('zxc12312', 10),
        name: '미어캣',
        // created_at: new Date(),
        // updated_at: new Date(),
      },
    ];

    // 데이터 생성 : queryInterface.bulkInsert(tabelName, records, options)
    // await queryInterface.bulkInsert(tableName, records, {});
    await Admin.bulkCreate(records);
  },

  async down (queryInterface, Sequelize) {
    // 데이터 삭제 : queryInterface.bulkDelete(tabelName, null, options)
    await queryInterface.bulkDelete(tableName, null, {});
  }
};