/**
 * @file app/services/owner/owners.quotations.service.js
 * @description owner quotations Service
 * 251229 jh init
 */

import { ALREADY_PROCESSED_ERROR } from "../../../configs/responseCode.config.js";
import myError from "../../errors/customs/my.error.js";
import ownersQuotationsRepository from "../../repositories/owner/owners.quotations.repository.js"

/**
 * 견적 요청서 전체 목록 (CleanersUserQuotationsTitle용)
 */
async function index() {
  // ID를 넘기지 않아야 Repository에서 전체 조회가 일어납니다.
  const submissions = await ownersQuotationsRepository.submissionFindByReservationId(null, null);
  
  // 데이터가 없을 경우를 대비해 빈 배열 보장
  return { submissions: submissions || [] };
}

async function show(id) {

  if (!id || id === 'undefined') {
    // Repository에 목록을 가져오는 함수가 있다고 가정 (예: findAll)
    // 만약 없다면 repository에도 findAll 관련 함수를 만들어야 합니다.
    const submissions = await ownersQuotationsRepository.submissionFindAll(null); 
    return { submissions }; 
  }

  // 예약 정보 획득
  const reservation = await ownersQuotationsRepository.reservationFindByIdAndStatusIsRequest(null, id);

  // 예약 정보 없을 경우 예외 처리
  if(!reservation) {
    throw myError('이미 처리된 견적서', ALREADY_PROCESSED_ERROR)
  }

  // 기사 찜 정보 획득
  const {ownerId, cleanerId} = reservation;
  const cleanerLike = await ownersQuotationsRepository.likeFindByOwnerIdAndCleanerId(null, {ownerId, cleanerId});

  // 질문정보 획득
  const submissions = await ownersQuotationsRepository.submissionFindByReservationId(null, id);

  return {cleanerLike, reservation, submissions};
}

export default {
  index,
  show,
}