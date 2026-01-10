/**
 * @file app/controllers/admin/admin.adjustments.controller.js
 * @description 관리자 adjustments Controller
 * 260110 v1.0.0 jae init
 */

/**
 * 정산 관리 메인 인덱스
 */
async function adjustmentIndex(req, res, next) {
  try {
    // 1. 페이지네이션 설정
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.offset ? Number(req.query.offset) : 10;
    const offset = (page - 1) * limit;

    // 2. 서비스 호출
    const [adjustmentData, statistics] = await Promise.all([
      adminAdjustmentsService.getAdjustments({ limit, offset }),
      adminAdjustmentsService.getStatistics()
    ]);

    // 3. 성공 응답 반환
    return res.status(SUCCESS.status).send(
      createBaseResponse(SUCCESS, {
        statistics,               // 상단 카드용: 전체, 지급대기, 완료, 보류 건수
        total: adjustmentData.total, // 전체 아이템 수
        currentPage: page,
        adjustments: adjustmentData.adjustments // 리스트: 기사명, 금액, 상태, 예정일
      })
    );
  } catch (error) {
    next(error);
  }
}

/**
 * 정산 건수 집계
 */
async function adjustmentStatisticsIndex(t = null, paramWhere) {
  let where = {};
  
  // 1. 기간 필터 (정산 예정일 기준)
  if (paramWhere?.startAt) {
    where.scheduledAt = { [Op.gte]: paramWhere.startAt };
  }
  if (paramWhere?.endAt) {
    where.scheduledAt = { [Op.lte]: paramWhere.endAt };
  }

  // 2. 상태 필터 (정산 대기, 지급 대기, 완료, 보류 등)
  if (paramWhere?.status) {
    where.status = paramWhere.status;
  }

  return await Adjustment.count({
    where,
    transaction: t,
  });
}

export default {
  adjustmentIndex,
  adjustmentStatisticsIndex,
};