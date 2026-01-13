/**
 * @file databases/seeders/meta/meta-01-questions.seeder.js
 * @description questions table meta data
 * 251229 v1.0.0 jh init
 */

import db from '../../../app/models/index.js';
const { Question, QuestionOption } = db;

/**@type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    const options = {
      'Q01': ['5시간 미만', '5시간 ~ 13시간', '13시간 초과'],
      'Q02': ['1주일', '1개월', '3개월', '4개월 이상', '한적 없음'],
      'Q03': ['1대', '2대', '3대이상'],
      'Q04': ['네', '아니요'],
      'Q05': ['네', '아니요'],
      'Q06': ['네', '아니요'],
      'Q07': ['네', '아니요'],
      'Q08': ['네', '아니요'],
      'Q09': ['네', '아니요'],
    };

    // 레코드 정보 
    const records = [];

    const questions = await Question.findAll({where: {isActive: true}});

    for (const question of questions) {
      for (const correct of options[question.code]) {
        records.push({
          questionId: question.id,
          correct: correct
        });
      }
    }

    await QuestionOption.bulkCreate(records);
  },

  async down (queryInterface, Sequelize) {
    await QuestionOption.destroy({ force: true });
  }
};