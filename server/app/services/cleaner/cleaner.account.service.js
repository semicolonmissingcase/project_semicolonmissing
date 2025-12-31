/**
 * @file app/services/cleaner/cleaner.account.service.js
 * @description cleaner account Service
 * 251230 yh init
 */

import { ALREADY_PROCESSED_ERROR } from "../../../configs/responseCode.config.js";
// 저장했는데 또 저장 버튼 눌렀을 때?
import myError from "../../errors/customs/my.error.js";
import cleanerAccountRepository from "../../repositories/cleaner/cleaner.account.repository.js";

/**
 * 견적 요청서 상세
 * @param {number} id Adjustment PK
 * @returns {import("../../models/index.js").Adjustment}
 */
  async function accountinfo(data) {
 // 계좌 정보 획득
 // ⚠️ 'await'를 제거하고 일반 객체 분해 할당을 사용합니다.
 const { id, cleanerId } = data; // Postman에서 보낸 'cleaner_id'로 통일

  // cleaner_id가 undefined인지 검사하는 방어 코드 (선택적)
  if (!cleanerId) {
     throw myError('클리너 ID가 누락되었습니다.', ALREADY_PROCESSED_ERROR);
  }
 

 // Repository 호출 시 cleaner_id를 사용합니다.
 const adjustment = await cleanerAccountRepository.adjustmentsAccountInfo(null, { cleanerId, id });

  return {adjustment};

}

export default {
  accountinfo
}