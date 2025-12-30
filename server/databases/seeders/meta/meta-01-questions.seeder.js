/**
 * @file databases/seeders/meta/meta-01-questions.seeder.js
 * @description questions table meta data
 * 251229 v1.0.0 jh init
 */

import db from '../../../app/models/index.js';
const { Question } = db;

/**@type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    // 레코드 정보 
    const records = [
      {
        code: 'Q01',
        content: '하루에 제빙기 가동시간은 얼마나 되나요?'
      },
      {
        code: 'Q02',
        content: '제빙기 내부 청소 주기는 어떻게 되나요?'
      },
      {
        code: 'Q03',
        content: '청소를 할 제빙기는 몇 대 인가요?'
      },
      {
        code: 'Q04',
        content: '곰팡이 냄새나 악취가 나나요?'
      },
      {
        code: 'Q05',
        content: '얼음이 탁한가요?'
      },
      {
        code: 'Q06',
        content: '얼음의 맛이 평소와 다른가요?'
      },
      {
        code: 'Q07',
        content: '제빙량이 감소했나요?'
      },
      {
        code: 'Q08',
        content: '기계에서 평소와 다른 소음이 있나요?'
      },
      {
        code: 'Q09',
        content: '기계 주변은 청결한가요?'
      },
    ];

    await Question.bulkCreate(records);
  },

  async down (queryInterface, Sequelize) {
    await Question.destroy({ force: true });
  }
};