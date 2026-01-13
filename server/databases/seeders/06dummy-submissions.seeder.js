/**
 * @file databases/seeders/06dummy-submissions.seeder.js
 * @description submissions table dummy data create
 * 251229 v1.0.0 jh init
 */


import modelsConstants from '../../app/constants/models.constants.js';
import db from '../../app/models/index.js';
const { Submission, Reservation, Question, QuestionOption } = db;

/**@type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    const reservation = await Reservation.findOne({where: {status: modelsConstants.ReservationStatus.REQUEST}});
    const questions = await Question.findAll();

    // 레코드 정보 
    const records = [
      {
        reservationId: reservation.id,
        answerText: '테스트 데이터 인데요.'
      }
    ];

    for (const question of questions) {
      const questionOption = await QuestionOption.findOne({where: {questionId: question.id}});
      records.push({
        reservationId: reservation.id,
        questionId: question.id,
        questionOptionId: questionOption.id
      });
    }

    await Submission.bulkCreate(records);
  },

  async down (queryInterface, Sequelize) {
    // 데이터 삭제 : queryInterface.bulkDelete(tabelName, null, options)
    await Submission.destroy({ truncate: true, force: true });
  }
};