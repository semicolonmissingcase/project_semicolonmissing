/**
 * @file databases/seeders/dummy-cleaners.seeder.js
 * @description cleaners table dummy data create
 * 251229 v1.0.0 jae init
 */
import bcrypt from 'bcrypt';
import db from '../../app/models/index.js';
const { Cleaner } = db;

// 테이블명 
const tableName = 'cleaners';

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
      },
      {
        email: 'hong@hong.com',
        password: bcrypt.hashSync('hong12312', 10),
        name: '홍기사',
        gender: 'M',
        provider: 'NONE',
        phoneNumber: '010-2323-2323',
        profile: '',
      },
      {
        email: 'sucleaner@sucleaner.com',
        password: bcrypt.hashSync('su12312', 10),
        name: '수기사',
        gender: 'F',
        provider: 'NONE',
        phoneNumber: '010-2424-2424',
        profile: '',
      },
      {
        email: 'vycleaner@vycleaner.com',
        password: bcrypt.hashSync('vy12312', 10),
        name: '표기사',
        gender: 'F',
        provider: 'NONE',
        phoneNumber: '010-2525-2525',
        profile: '',
      },
      {
        email: 'macleaner@macleaner.com',
        password: bcrypt.hashSync('ma12312', 10),
        name: '마기사',
        gender: 'F',
        provider: 'NONE',
        phoneNumber: '010-2626-2626',
        profile: '',
      },
      {
        email: 'juncleaner@juncleaner.com',
        password: bcrypt.hashSync('jun12312', 10),
        name: '전기사',
        gender: 'F',
        provider: 'NONE',
        phoneNumber: '010-2727-2727',
        profile: '',
      },
      {
        email: 'baecleaner@baecleaner.com',
        password: bcrypt.hashSync('bae12312', 10),
        name: '배기사',
        gender: 'M',
        provider: 'NONE',
        phoneNumber: '010-2828-2828',
        profile: '',
      },
      {
        email: 'jegalcleaner@jegalcleaner.com',
        password: bcrypt.hashSync('jegal12312', 10),
        name: '제갈기사',
        gender: 'F',
        provider: 'NONE',
        phoneNumber: '010-2929-2929',
        profile: '',
      },
      {
        email: 'kingcleaner@kingcleaner.com',
        password: bcrypt.hashSync('king12312', 10),
        name: '왕기사',
        gender: 'M',
        provider: 'NONE',
        phoneNumber: '010-3030-3030',
        profile: '',
      },
      {
        email: 'songcleaner@songcleaner.com',
        password: bcrypt.hashSync('song12312', 10),
        name: '송기사',
        gender: 'F',
        provider: 'NONE',
        phoneNumber: '010-3131-3131',
        profile: '',
      },
    ];

    // 데이터 생성 : queryInterface.bulkInsert(tabelName, records, options)
    // await queryInterface.bulkInsert(tableName, records, {});
    await Cleaner.bulkCreate(records);
  },

  async down (queryInterface, Sequelize) {
    // 데이터 삭제 : queryInterface.bulkDelete(tabelName, null, options)
    await Cleaner.destroy({ truncate: true, force: true });
  }
};