/**
 * @file databases/seeders/dummy-cleaners.seeder.js
 * @description cleaners table dummy data create
 * 251229 v1.0.0 jae init
 */
import bcrypt from 'bcrypt';
import { fakerKO as faker } from '@faker-js/faker';
import db from '../../app/models/index.js';
const { Cleaner } = db;

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const records = [];
    const commonPassword = await bcrypt.hash('asd12312', 10);

    // 1. 고정 레코드 정보 (곽기사님)
    records.push({
      email: 'cleaner@cleaner.com',
      password: commonPassword, // 미리 생성한 해시값 사용
      name: '곽기사',
      gender: 'F',
      provider: 'NONE',
      phoneNumber: '010-2222-2222',
      profile: '',
      introduction: '제빙기 청소 전문 기사 곽기사입니다.',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 2. Faker.js를 이용한 랜덤 데이터 29개 추가
    for (let i = 0; i < 29; i++) {
      records.push({
        name: faker.person.fullName(),
        gender: faker.helpers.arrayElement(['M', 'F']),
        email: faker.internet.email(),
        password: commonPassword,
        provider: 'NONE',
        phoneNumber: `010-${faker.string.numeric(4)}-${faker.string.numeric(4)}`,
        profile: faker.image.avatar(),
        // 기사님 특화: 한 줄 소개 생성
        introduction: faker.helpers.arrayElement([
          '꼼꼼하고 깨끗하게 청소해 드립니다.',
          '제빙기 분해 세척 전문입니다!',
          '합리적인 가격으로 모시겠습니다.',
          '서울 전 지역 출장 가능합니다.',
          '청결을 최우선으로 생각합니다.'
        ]),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // 3. 데이터 일괄 생성
    await Cleaner.bulkCreate(records);
  },

  async down(queryInterface, Sequelize) {
    // 데이터 삭제
    await Cleaner.destroy({ truncate: { cascade: true }, force: true });
  }
};