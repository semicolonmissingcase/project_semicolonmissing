/**
 * @file app/controllers/cleaner/cleaner.resrvation.controller.js
 * @description cleaner resrvation 관련 컨트롤러
 * 260105 seon init
 */
import cleanerMypageRepository from '../../repositories/cleaner/cleaner.mypage.repository.js';

const cleanerReservationController = {
  /**
   * 대기 작업 목록 조회 (상태: '승인')
   * 점주가 결제를 완료하여 기사님의 수락/수행을 기다리는 목록
   */
  getPendingJobs: async (req, res) => {
    try {
      const cleanerId = req.user.id; // 인증 미들웨어에서 보낸 정보
      const userRole = req.user.role;

      const pendingJobs = await cleanerMypageRepository.reservationFindPendingByCleanerIdAndRole(
        null, 
        { cleanerId, role: userRole }
      );

      return res.status(200).json({
        success: true,
        message: "대기 작업 목록 조회 성공",
        data: pendingJobs
      });
    } catch (error) {
      console.error("getPendingJobs Error:", error);
      return res.status(500).json({
        success: false,
        message: "대기 작업을 불러오는 중 오류가 발생했습니다."
      });
    }
  },

  /**
   * 오늘 일정 조회 (상태: '승인' + 오늘 날짜)
   */
  getTodayJobs: async (req, res) => {
    try {
      const cleanerId = req.user.id;
      const userRole = req.user.role;

      const todayJobs = await cleanerMypageRepository.reservationFindTodayByCleanerIdAndRole(
        null,
        { cleanerId, role: userRole }
      );

      return res.status(200).json({
        success: true,
        message: "오늘 일정 조회 성공",
        data: todayJobs
      });
    } catch (error) {
      console.error("getTodayJobs Error:", error);
      return res.status(500).json({
        success: false,
        message: "오늘 일정을 불러오는 중 오류가 발생했습니다."
      });
    }
  }
};

export default cleanerReservationController;