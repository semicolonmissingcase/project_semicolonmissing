/**
 * @file app/repositories/owner/owners.quotations.repository.js
 * @description Owner quotations Repository
 * 251229 v1.0.0 jh init
 */

import modelsConstants from '../../constants/models.constants.js';
import db from '../../models/index.js';
const { sequelize, Reservation, Submission, Question, QuestionOption, Store, Owner, Like } = db;

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
        [sequelize.literal('`Question`.`code` IS NULL'), 'ASC'],
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

export default {
  reservationFindByIdAndStatusIsRequest,
  submissionFindByReservationId,
  likeFindByOwnerIdAndCleanerId,
}