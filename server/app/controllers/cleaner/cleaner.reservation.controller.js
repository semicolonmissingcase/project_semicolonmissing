/**
 * @file app/controllers/cleaner/cleaner.reservation.controller.js
 * @description 기사님 예약 및 마이페이지 관리 컨트롤러
 * 260105 seon init
 */
import cleanerMypageRepository from '../../repositories/cleaner/cleaner.mypage.repository.js';
import constants from '../../constants/models.constants.js';
import db from '../../models/index.js'

const { ReservationStatus } = constants;

/**
 * 작업 완료 처리 및 정산 데이터 생성
 */
async function completeJob(req, res, next) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ success: false, message: "인증 정보가 없습니다." });
  }

  const { id: cleanerId } = req.user;
  const { id: reservationId } = req.params;

  let transaction;
  try {
    transaction = await db.sequelize.transaction();

    // 1. 예약 및 견적 정보 조회
    const reservation = await cleanerMypageRepository.reservationFindById(transaction, reservationId);
    if (!reservation) {
      if (transaction) await transaction.rollback();
      return res.status(404).json({ success: false, message: "의뢰 정보를 찾을 수 없습니다." });
    }

    // 2. 결제 정보 별도 조회 (관계 설정 오류 우회)
    const payment = await db.Payment.findOne({
      where: { reservation_id: reservationId },
      transaction
    });

    if (!payment) {
      if (transaction) await transaction.rollback();
      return res.status(400).json({ 
        success: false, 
        message: "연결된 결제 내역이 없어 정산 등록이 불가능합니다. 결제 상태를 확인해주세요." 
      });
    }

    const estimateData = reservation.estimate;
    const finalAmount = estimateData?.get('estimated_amount') || estimateData?.estimated_amount || 0;

    await cleanerMypageRepository.reservationUpdateStatus(transaction, {
      id: reservationId,
      status: constants.ReservationStatus.COMPLETED,
    });

    await cleanerMypageRepository.adjustmentUpsert(transaction, {
      cleanerId: cleanerId,
      reservationId: reservationId,
      estimateId: estimateData?.id, 
      paymentId: payment.id, 
      settlementAmount: finalAmount, 
      status: constants.AdjustmentStatus.PENDING,
    });

    await transaction.commit();
    return res.status(200).json({ 
      success: true, 
      message: "작업 완료 및 정산 처리가 완료되었습니다.",
      data: { amount: finalAmount }
    });

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("❌ completeJob 최종 에러:", error);
    next(error);
  }
}


async function getPendingJobs(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "인증 정보가 없습니다." });
    }
    const { id, role } = req.user;
    const pendingJobs = await cleanerMypageRepository.reservationFindPendingByCleanerIdAndRole(null, { cleanerId: id, userRole: role });
    return res.status(200).json({ success: true, message: "대기 작업 목록 조회 성공", data: pendingJobs });
  } catch (error) {
    console.error("🔥 [getPendingJobs] 에러 발생:", error);
    next(error);
  }
}

async function getTodayJobs(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "인증 정보가 없습니다." });
    const { id, role } = req.user;
    const todayJobs = await cleanerMypageRepository.reservationFindTodayByCleanerId(null, { cleanerId: id, userRole: role });
    return res.status(200).json({ success: true, message: "오늘 일정 조회 성공", data: todayJobs });
  } catch (error) {
    next(error);
  }
}

async function updateReservationStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await cleanerMypageRepository.reservationUpdateStatus(null, { id, status });
    return res.status(200).json({ success: true, message: `예약 상태가 ${status}(으)로 변경되었습니다.` });
  } catch (error) {
    next(error);
  }
}

async function getSettlementSummary(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "인증 정보가 없습니다." });
    const { id } = req.user;
    const { yearMonth } = req.query; 
    const targetDate = yearMonth || new Date().toISOString().slice(0, 7);

    const summary = await cleanerMypageRepository.settlementFindSummaryByCleanerId(null, { cleanerId: id, yearMonth: targetDate });
    const list = await cleanerMypageRepository.settlementFindListWithStoreByCleanerId(null, { cleanerId: id, yearMonth: targetDate });

    return res.status(200).json({
      success: true,
      message: `${targetDate} 정산 정보 조회 성공`,
      data: { summary, list }
    });
  } catch (error) {
    next(error);
  }
}

async function getCleanerReviews(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "인증 정보가 없습니다." });
    const reviews = await cleanerMypageRepository.reviewFindByCleanerId(null, req.user.id);
    return res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
}

const getCleanerInquiries = async (req, res, next) => {
  try {
    const inquiries = await cleanerMypageRepository.inquiryFindByCleanerId(null, req.user.id);
    return res.status(200).json({ success: true, data: inquiries });
  } catch (error) {
    next(error);
  }
};

const getJobDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!req.user) return res.status(401).json({ success: false, message: "인증 정보가 없습니다." });
    
    const reservation = await cleanerMypageRepository.reservationFindById(null, id);
    if (!reservation) return res.status(404).json({ success: false, message: "의뢰를 찾을 수 없습니다." });
    if (reservation.cleanerId !== req.user.id) return res.status(403).json({ success: false, message: "접근 권한이 없습니다." });

    const submissions = await cleanerMypageRepository.submissionFindByReservationId(null, id);
    return res.status(200).json({ success: true, data: { reservation, submissions } });
  } catch (error) {
    next(error);
  }
};

export default {
  getPendingJobs,
  getTodayJobs,
  updateReservationStatus,
  getCleanerReviews,
  getCleanerInquiries,
  getSettlementSummary,
  getJobDetail,
  completeJob
};