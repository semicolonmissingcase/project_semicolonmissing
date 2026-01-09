import cleanerAccountService from '../../services/cleaner/cleaner.account.service.js';

/**
 *  계좌 목록 조회
 */
async function getAccounts(req, res) {
  try {
    const { cleanerId } = req.body;
    const result = await cleanerAccountService.getAccounts(cleanerId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ msg: "계좌 조회 중 서버 오류 발생", debug: error.message });
  }
}

/**
 *  새 계좌 등록
 */
async function createAccount(req, res) {
  try {
    const { cleanerId } = req.body; 
    const accountData = {
      ...req.body,
      cleanerId: cleanerId 
    };
    const result = await cleanerAccountService.saveAccount(accountData);
    return res.status(201).json({ msg: "계좌가 등록되었습니다.", data: result });
  } catch (error) {
    console.error("등록 에러:", error);
    return res.status(500).json({ msg: "계좌 등록 중 서버 오류 발생", debug: error.message });
  }
}

/**
 *  계좌 정보 수정
 */
  async function updateAccount(req, res) {
  try {
    const { cleanerId } = req.body; 
    const { id, bankCode, accountNumber, depositor, isDefault } = req.body;

    await cleanerAccountService.updateAccount(id, {
      cleanerId,      // 누가 수정했는지 확인용
      bankCode,       // 필드명이 모델(CleanerAccount.js)과 반드시 일치해야 함
      accountNumber,  // accountNumber (O), account_number (X)
      depositor,
      isDefault
    });

    return res.status(200).json({ msg: "계좌 정보가 수정되었습니다." });
  } catch (error) {
    console.error("수정 에러:", error);
    return res.status(500).json({ msg: "수정 중 오류 발생", debug: error.message });
  }
}

/**
 *  계좌 삭제
 */
async function deleteAccount(req, res) {
  try {
    const { cleanerId } = req.body;

    await cleanerAccountService.deleteAccount(cleanerId);
    return res.status(200).json({ msg: "계좌가 삭제되었습니다." });
  } catch (error) {
    console.error("삭제 에러:", error);
    return res.status(500).json({ msg: "계좌 삭제 중 서버 오류 발생", debug: error.message });
  }
}



export default {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount
};