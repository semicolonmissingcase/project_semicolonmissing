/**
 * @file app/repositories/owner/owners.quotations.repository.js
 * @description Owner quotations Repository
 * 251229 v1.0.0 jh init
 */

import modelsConstants from '../../constants/models.constants.js';
import db from '../../models/index.js';
const { sequelize, Reservation, Submission, Question, QuestionOption, Store, Owner, Like, ReservationImage } = db;

async function reservationFindByIdAndStatusIsRequest(t = null, id) {
  return await Reservation.findOne(
    {
      where: {
        id: id,
        status: modelsConstants.ReservationStatus.REQUEST
      },
      include: [
        {
          model: Store,
          as: 'store',
          required: true
        },
        {
          model: Owner,
          as: 'owner',
          required: true
        },
        // TODO: 이미지 모델 추가 필요
      ]
    },
    {
      transaction: t
    }
  );
}

async function submissionFindByReservationId(t = null, id) {
  return await Submission.findAll(
    {
      where: {
        reservationId: id
      },
      include: [
        {
          attributes: ['id', 'code', 'content'],
          model: Question,
          as: 'question',
          required: false,
          include: [
            {
              attributes: ['id', 'correct'],
              model: QuestionOption,
              as: 'questionOptions',
              required: false
            },
          ],
        },

      ],
      order: [
        [sequelize.literal('`question`.`code` IS NULL'), 'ASC'],
        [{ model: Question, as: 'question' }, 'code', 'ASC']
      ]
    },
    {
      transaction: t
    }
  );
}

async function likeFindByOwnerIdAndCleanerId(t = null, {ownerId, cleanerId}) {
  return await Like.findOne(
    {
      attributes: ['id', 'ownerId', 'cleanerId'],
      where: {
        ownerId: ownerId,
        cleanerId: cleanerId,
      }
    },
    {
      transaction: t
    }
  );
}

/**
 * 새로운 견적 요청서 작성
 * @param {object | null} t 
 * @param {object} reservationData 
 */
async function createReservation(t = null, reservationData) {
  const newReservation = await Reservation.create(reservationData, { transaction: t });
  return newReservation;
}

async function findQuestionByCode(t = null, code) {
  return await Question.findOne({ where: { code } }, { transaction: t });
}

async function createSubmission(t = null, submissionData) {
  return await Submission.create(submissionData, { transaction: t });
}

async function createReservationImage(t = null, imageData) {
  return await ReservationImage.create(imageData, { transaction: t });
}

// 답변 텍스트로 옵션 조회
async function findQuestionOptionByText(t = null, { questionId, answerText }) {
  return await QuestionOption.findOne({
    where: {
      questionId: questionId,
      correct: answerText
    },
  }
,  { transaction: t });
}

// 추가 질문, 옵션 목록 조회
async function findAllQuestions() {
  return await Question.findAll({
    include: [
      {
        model: QuestionOption,
        as: 'questionOptions',
        attributes: ['id', 'correct'],
      },
    ],
    attributes: ['id', 'code', 'content', 'meta'],
    order: [['id', 'ASC']],
  })
}

export default {
  reservationFindByIdAndStatusIsRequest,
  submissionFindByReservationId,
  likeFindByOwnerIdAndCleanerId,
  createReservation,
  findQuestionByCode,
  createSubmission,
  createReservationImage,
  findAllQuestions,
  findQuestionOptionByText,
}