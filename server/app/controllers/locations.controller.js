// locationsController.js

import db from '../models/index.js';

/**
 * 💡 [GET /locations] 모든 활동 가능 지역 목록을 조회합니다.
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
async function getCleanerRegions(req, res, next) {
    try {
        // 1. Location 테이블에서 모든 데이터를 가져옴 (선택 가능한 지역)
        const allLocations = await db.Location.findAll({
            attributes: ['id', 'city', 'district'],
            order: [['city', 'ASC'], ['district', 'ASC']]
        });

        // 2. 클라이언트 응답 포맷에 맞게 데이터 가공
        const formattedRows = allLocations.map(loc => ({
            id: loc.id,
            city: loc.city,
            district: loc.district,
        }));

        // 3. 응답 전송 (GET 요청 완료)
        return res.status(200).json({
            table: "locations",
            rows: formattedRows
        });

    } catch (error) {
        console.error('Error fetching all locations:', error);
        // 에러 핸들러 미들웨어로 넘기거나, 여기서 500 응답 전송
        return res.status(500).json({
            message: "지역 정보 불러오기 실패",
            error: error.message
        });
    }
}

/**
 * 💡 [POST /cleaner] 기사 회원가입 시 Cleaner 및 DriverRegion 데이터를 DB에 저장합니다.
 * 이 함수는 CleanerController의 registerCleaner 미들웨어 뒤에 실행된다고 가정합니다.
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */

export default {
    getCleanerRegions, 
}