/**
 * @file app/controllers/cleaner/cleaner.reservation.controller.js
 * @description 기사님 예약 및 마이페이지 관리 컨트롤러
 * 260106 seon init
 */
import cleanerMypageRepository from '../../repositories/cleaner/cleaner.mypage.repository.js';
import constants from '../../constants/models.constants.js';

const { ReservationStatus } = constants;

/**
 * 대기 작업 목록 조회
 */
async function getPendingJobs(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "인증 정보가 없습니다." });
    }

    const { id, role } = req.user;

    const pendingJobs = await cleanerMypageRepository.reservationFindPendingByCleanerIdAndRole(
      null, 
      { 
        cleanerId: id, 
        userRole: role 
      }
    );

    return res.status(200).json({
      success: true,
      message: "대기 작업 목록 조회 성공",
      data: pendingJobs
    });
  } catch (error) {
    console.error("❌ getPendingJobs Error:", error);
    next(error);
  }
}

/**
 * 오늘 일정 조회
 */
async function getTodayJobs(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "인증 정보가 없습니다." });
    }

    const { id, role } = req.user;

    const todayJobs = await cleanerMypageRepository.reservationFindTodayByCleanerId(
      null, 
      { 
        cleanerId: id, 
        userRole: role 
      }
    );

    return res.status(200).json({
      success: true,
      message: "오늘 일정 조회 성공",
      data: todayJobs
    });
  } catch (error) {
    console.error("❌ getTodayJobs Error:", error);
    next(error);
  }
}

/**
 * 예약 상태 업데이트 (작업 완료 등)
 */
async function updateReservationStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await cleanerMypageRepository.reservationUpdateStatus(null, { id, status });

    return res.status(200).json({
      success: true,
      message: `예약 상태가 ${status}(으)로 변경되었습니다.`
    });
  } catch (error) {
    console.error("❌ updateReservationStatus Error:", error);
    next(error);
  }
}

/**
 * 정산 요약 정보 조회 (추가됨 ✨)
 */
/**
 * 정산 요약 및 상세 리스트 조회 (수정됨 ✨)
 */
async function getSettlementSummary(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "인증 정보가 없습니다." });
    }

    const { id } = req.user;
    const { yearMonth } = req.query; 
    const targetDate = yearMonth || new Date().toISOString().slice(0, 7);

    // 1. 요약 정보 가져오기 (기존)
    const summary = await cleanerMypageRepository.settlementFindSummaryByCleanerId(null, {
      cleanerId: id,
      yearMonth: targetDate
    });

    // 2. [추가] 상세 리스트 가져오기 (가게명 조인 포함)
    const list = await cleanerMypageRepository.settlementFindListWithStoreByCleanerId(null, {
      cleanerId: id,
      yearMonth: targetDate
    });

    // 3. 응답 데이터 구조 결합 (summary와 list를 함께 보냄)
    return res.status(200).json({
      success: true,
      message: `${targetDate} 정산 정보 조회 성공`,
      data: {
        summary: summary, // { pending: 300000, completed: 0 }
        list: list        // [ { settlement_amount: 300000, reservation: { store: { name: '...' } }, ... } ]
      }
    });
  } catch (error) {
    console.error("❌ getSettlementSummary Error:", error);
    next(error);
  }
}

/**
 * 기사님에게 작성된 리뷰 목록 조회
 */
async function getCleanerReviews(req, res, next) {
  try {
    // 1. req.user 존재 여부 확인 (에러 방지 핵심)
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: "인증 정보가 없습니다. 다시 로그인해주세요." 
      });
    }

    const { id } = req.user; 

    const reviews = await cleanerMypageRepository.reviewFindByCleanerId(null, id);

    return res.status(200).json({
      success: true,
      message: "리뷰 목록 조회 성공",
      data: reviews
    });
  } catch (error) {
    console.error("❌ getCleanerReviews Error:", error);
    next(error);
  }
}

/**
 * 기사님이 작성한 문의 목록 조회
 */
const getCleanerInquiries = async (req, res, next) => {
  try {
    const cleanerId = req.user.id; 

    const inquiries = await cleanerMypageRepository.inquiryFindByCleanerId(null, cleanerId);

  return res.status(200).json({
        success: true,
        message: "문의 내역 조회 성공",
        data: inquiries
      });
    } catch (error) {
      console.error("❌ getCleanerInquiries Controller Error:", error);
      next(error);
  }
};

export default {
  getPendingJobs,
  getTodayJobs,
  updateReservationStatus,
  getCleanerReviews,
  getCleanerInquiries,
  getSettlementSummary
};