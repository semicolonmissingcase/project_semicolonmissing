/**
 * @file app/services/owner/owners.quotations.service.js
 * @description owner quotations Service
 * 251229 jh init
 */

import { ALREADY_PROCESSED_ERROR } from "../../../configs/responseCode.config.js";
import modelsConstants from "../../constants/models.constants.js";
import myError from "../../errors/customs/my.error.js";
import ownersQuotationsRepository from "../../repositories/owner/owners.quotations.repository.js"
import db from '../../models/index.js';
import pathUtil from "../../utils/path/path.util.js";
const { ReservationStatus, IsAssignStatus } = modelsConstants;
const { sequelize, Submission } = db



/**
 * 견적 요청서 전체 목록 (CleanersUserQuotationsTitle용)
 */// cleanerId를 인자로 받도록 수정
async function index(cleanerId) {
  // 세 번째 인자로 cleanerId 전달
  const submissions = await ownersQuotationsRepository.submissionFindByReservationId(null, null, cleanerId);


  return { submissions: submissions || [] };
}

/**
 * 견적 요청서 상세
 * @param {number} id Reservation PK
 * @returns {import("../../models/index.js").Reservation}
 */
async function show(id) {
  // 예약 정보 획득
  const reservation = await ownersQuotationsRepository.reservationFindByIdAndStatusIsRequest(null, id);

  // 예약 정보 없을 경우 예외 처리
  if(!reservation) {
    throw myError('이미 처리된 견적서', ALREADY_PROCESSED_ERROR)
  }

  // 질문정보 획득
  const submissions = await ownersQuotationsRepository.submissionFindByReservationId(null, id);

  return {reservation, submissions};
}

/**
 * 새로운 견적 요청서 작성
 */
async function createReservation(t_unused = null, { ownerId, storeId, date, time, cleanerId = null, submissions = [], files = [] }) {
  let transaction;

  try {
    transaction = await sequelize.transaction();
    
    // 1. 상태 설정 (cleanerId가 지정되어 오면 바로 '승인', 아니면 '요청')
    const status = cleanerId 
      ? ReservationStatus.APPROVED
      : ReservationStatus.REQUEST;

    const isAssign = cleanerId
      ? IsAssignStatus.ASSIGNED
      : IsAssignStatus.NORMAL;

    const reservationData = { ownerId, storeId, date, time, status, isAssign, cleanerId };

    // 2. 예약 생성
    const newReservation = await ownersQuotationsRepository.createReservation(transaction, reservationData);

    // 3. 질문 답변(submissions) 처리
    if(submissions && submissions.length > 0) {
      for (const sub of submissions) {
        let questionId = null;
        let answerText = sub.answer;
        let questionOptionId = null;

        if (sub.questionCode === 'Q99') {
          answerText = sub.answer;
        } else {
          const question = await ownersQuotationsRepository.findQuestionByCode(transaction, sub.questionCode);
          if(!question) {
            throw new Error(`Question with code ${sub.questionCode} not found.`);
          }
          questionId = question.id;

          // 답변 텍스트로 옵션 조회
          const questionOption = await ownersQuotationsRepository.findQuestionOptionByText(transaction, {
            questionId: question.id,
            answerText: sub.answer
          });

          if (questionOption) {
            questionOptionId = questionOption.id;
            answerText = null;
          }
        }

        const submissionData = {
          reservationId: newReservation.id,
          questionId: questionId,
          answerText: answerText,
          questionOptionId: questionOptionId,
        };

        await ownersQuotationsRepository.createSubmission(transaction, submissionData);
      }
    }

    // 4. 업로드된 파일 처리 
    if(files && files.length > 0) { 
      const reservationImagePath = pathUtil.getReservationImagePath();

      for (const file of files) {
        // public 경로를 제외한 저장용 상대 경로 구성
        const filePath = `${process.env.APP_URL}/${reservationImagePath}/${file.filename}`.replace(/\\/g, "/");

        await ownersQuotationsRepository.createReservationImage(transaction, {
          reservationId: newReservation.id,
          imagePath: filePath,
          originalname: file.originalname,
          mimetype: file.mimetype, 
          size: file.size,
          fieldname: file.fieldname
        });
      }
    }

    await transaction.commit();
    return newReservation; 

  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }   
}

// 견적 요청서 질문 목록 조회
async function getQuestions() {
  const questions = await ownersQuotationsRepository.findAllQuestions();
  
  return questions.map(q => ({
    id: q.id,
    type: q.type,
    text: q.content,
    options: q.QuestionOptions ? q.QuestionOptions.map(opt => opt.correct) : [],
    questionCode: q.code,
  }));  
}


export default {
  index,
  show,
  createReservation,
  getQuestions,
}