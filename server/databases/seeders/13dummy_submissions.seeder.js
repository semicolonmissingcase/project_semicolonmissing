/**
 * @file databases/seeders/13dummy-submissions.seeder.js
 * @description submissions table dummy data create with real question-option mapping
 * 2026-01-01 v1.0.3 yh updated (Alias fix: questionOptions)
 */

import db from '../../app/models/index.js';
const { Submission, Reservation, Question, QuestionOption } = db;

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // 1. 예약 정보 가져오기
    const reservation = await Reservation.findOne({
      where: { id: "1" },
      order: [['id', 'DESC']]
    });

    if (!reservation) {
      console.log('데이터를 생성할 예약(ID: 2)이 존재하지 않습니다.');
      return;
    }

    // 2. 모든 활성화된 질문과 그에 딸린 옵션들을 한꺼번에 가져오기
    // 에러 메시지에 따라 별칭을 'questionOptions'로 수정했습니다.
    const questions = await Question.findAll({
      where: { is_active: 1 },
      include: [{ 
        model: QuestionOption, 
        as: 'questionOptions' // 에러 메시지에서 제안한 별칭으로 변경
      }]
    });

    const records = [];

    // 3. 질문 데이터를 순회하며 답변 생성
    for (const question of questions) {
      // include를 통해 가져온 옵션 배열 사용 (없으면 빈 배열)
      const options = question.questionOptions || [];

      if (options.length > 0) {
        // 첫 번째 옵션을 선택 (또는 Math.random()을 사용하여 랜덤 선택 가능)
        const selectedOption = options[0]; 

        records.push({
          reservationId: reservation.id,
          questionId: question.id,
          questionOptionId: selectedOption.id,
          answerText: null,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    // 4. 주관식 건의사항 추가
    records.push({
      reservationId: reservation.id,
      questionId: null,
      questionOptionId: null,
      answerText: '제빙기 소음이 심하고 얼음 모양이 불규칙하여 빠른 점검 부탁드립니다.',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    if (records.length > 0) {
      await Submission.bulkCreate(records);
      console.log(`[Success] 예약 ID ${reservation.id}: ${records.length}개의 답변 생성 완료.`);
    }
  },

  async down(queryInterface, Sequelize) {
    await Submission.destroy({ where: {}, force: true });
  }
};