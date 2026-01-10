/**
 * @file databases/seeders/dummy-owners.seeder.js
 * @description owners table dummy data create
 * 251229 v1.0.0 jae init
 */
import bcrypt from 'bcrypt';
import { fakerKO as faker } from '@faker-js/faker';
import db from '../../app/models/index.js';
const { Owner } = db;

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
      },
    ];

    const commonPassword = await bcrypt.hash('qwe12312', 10);
    
    for (let i = 0; i < 29; i++) {
      records.push({
        email: faker.internet.email(),
        password: commonPassword,
        name: faker.person.fullName(),
        gender: faker.helpers.arrayElement(['M', 'F']),
        provider: 'NONE',
        phoneNumber: `010-${faker.string.numeric(4)}-${faker.string.numeric(4)}`,
        profile: faker.image.avatar(),
      });
    }

    // 데이터 생성 : queryInterface.bulkInsert(tabelName, records, options)
    await Owner.bulkCreate(records);
  },

  async down (queryInterface, Sequelize) {
    // 데이터 삭제 : queryInterface.bulkDelete(tabelName, null, options)
    await Owner.destroy({ truncate: { cascade: true }, force: true });
  }
};