/**
 * @file databases/seeders/dummy-owners.seeder.js
 * @description owners table dummy data create
 * 251229 v1.0.0 jae init
 */
import bcrypt from 'bcrypt';
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
      {
        email: 'kimowner@kimowner.com',
        password: await bcrypt.hash('kim12312', 10),
        name: '김점주',
        gender: 'M',
        provider: 'NONE',
        phoneNumber: '010-9999-9999',
        profile: '',
      },
      {
        email: 'leeowner@leeowner.com',
        password: await bcrypt.hash('lee12312', 10),
        name: '이점주',
        gender: 'F',
        provider: 'NONE',
        phoneNumber: '010-3333-3333',
        profile: '',
      },
      {
        email: 'parkowner@parkowner.com',
        password: await bcrypt.hash('park12312', 10),
        name: '박점주',
        gender: 'F',
        provider: 'NONE',
        phoneNumber: '010-4444-4444',
        profile: '',
      },
      {
        email: 'jungowner@jungowner.com',
        password: await bcrypt.hash('jung12312', 10),
        name: '정점주',
        gender: 'M',
        provider: 'NONE',
        phoneNumber: '010-5555-5555',
        profile: '',
      },
      {
        email: 'dbdbowner@dbdbowner.com',
        password: await bcrypt.hash('dbdb12312', 10),
        name: '유점주',
        gender: 'M',
        provider: 'NONE',
        phoneNumber: '010-6666-6666',
        profile: '',
      },
      {
        email: 'fiveowner@fiveowner.com',
        password: await bcrypt.hash('five12312', 10),
        name: '오점주',
        gender: 'F',
        provider: 'NONE',
        phoneNumber: '010-7777-7777',
        profile: '',

      },
      {
        email: 'hahaowner@hahaowner.com',
        password: await bcrypt.hash('haha12312', 10),
        name: '하점주',
        gender: 'M',
        provider: 'NONE',
        phoneNumber: '010-8888-8888',
        profile: '',
      },
      {
        email: 'rtyowner@rtyowner.com',
        password: await bcrypt.hash('rty12312', 10),
        name: '이오너',
        gender: 'M',
        provider: 'NONE',
        phoneNumber: '010-7171-7171',
        profile: '',
      },     
      {
        email: 'kangowner@kangowner.com',
        password: await bcrypt.hash('kang12312', 10),
        name: '강오너',
        gender: 'F',
        provider: 'NONE',
        phoneNumber: '010-7272-7272',
        profile: '',
      },     
      {
        email: 'xogkowner@xogkowner.com',
        password: await bcrypt.hash('xogk12312', 10),
        name: '이태하',
        gender: 'M',
        provider: 'NONE',
        phoneNumber: '010-7373-7373',
        profile: '',
      },     
      {
        email: 'charowner@charowner.com',
        password: await bcrypt.hash('char12312', 10),
        name: '이덕후',
        gender: 'M',
        provider: 'NONE',
        phoneNumber: '010-7474-7474',
        profile: '',
      },     
      {
        email: 'yngownerh@ynghowner.com',
        password: await bcrypt.hash('yngh12312', 10),
        name: '김덕후',
        gender: 'M',
        provider: 'NONE',
        phoneNumber: '010-7575-7575',
        profile: '',
      },     
      {
        email: 'iveowner@iveowner.com',
        password: await bcrypt.hash('ive12312', 10),
        name: '김민주',
        gender: 'F',
        provider: 'NONE',
        phoneNumber: '010-7676-7676',
        profile: '',
      },     
      {
        email: 'starowner@starowner.com',
        password: await bcrypt.hash('star12312', 10),
        name: '하혜성',
        gender: 'M',
        provider: 'NONE',
        phoneNumber: '010-7878-7878',
        profile: '',
      },     
      {
        email: 'ckstjdowner@ckstjdowner.com',
        password: await bcrypt.hash('cks12312', 10),
        name: '허찬성',
        gender: 'M',
        provider: 'NONE',
        phoneNumber: '010-7979-7979',
        profile: '',
      },     
      {
        email: 'tjdwpowner@tjdwpowner.com',
        password: await bcrypt.hash('tjd12312', 10),
        name: '박성제',
        gender: 'M',
        provider: 'NONE',
        phoneNumber: '010-8181-8181',
        profile: '',
      },     
      {
        email: 'iopowner@iopowner.com',
        password: await bcrypt.hash('iop12312', 10),
        name: '박찬승',
        gender: 'M',
        provider: 'NONE',
        phoneNumber: '010-8282-8282',
        profile: '',
      },     
      {
        email: 'jklowner@jklowner.com',
        password: await bcrypt.hash('jkl12312', 10),
        name: '강수연',
        gender: 'F',
        provider: 'NONE',
        phoneNumber: '010-8383-8383',
        profile: '',
      },     
      {
        email: 'bnmowner@bnmowner.com',
        password: await bcrypt.hash('bnm12312', 10),
        name: '강지영',
        gender: 'F',
        provider: 'NONE',
        phoneNumber: '010-8484-8484',
        profile: '',
      },
    ];

    // 데이터 생성 : queryInterface.bulkInsert(tabelName, records, options)
    await Owner.bulkCreate(records);
  },

  async down (queryInterface, Sequelize) {
    // 데이터 삭제 : queryInterface.bulkDelete(tabelName, null, options)
    await Owner.destroy({ truncate: true, force: true });
  }
};