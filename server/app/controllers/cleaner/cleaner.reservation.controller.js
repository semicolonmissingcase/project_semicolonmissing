/**
 * @file app/controllers/cleaner/cleaner.reservation.controller.js
 * @description 기사님 예약 및 마이페이지 관리 컨트롤러
 * 260106 seon init
 */
import cleanerMypageRepository from '../../repositories/cleaner/cleaner.mypage.repository.js';

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
 * 기사님 본인에게 달린 리뷰 목록 조회
 */
async function getCleanerReviews(req, res, next) {
  try {
    const { id } = req.user;
    const reviews = await cleanerMypageRepository.reviewFindByCleanerId(null, id);

    return res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error("❌ getCleanerReviews Error:", error);
    next(error);
  }
}

// 라우터에서 사용할 수 있도록 export
export default {
  getPendingJobs,
  getTodayJobs,
  updateReservationStatus,
  getCleanerReviews
};