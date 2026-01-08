/**
 * @file app/controllers/cleaners/cleaner.user.controller.js
 * @description 기사 회원가입 컨트롤러
 * 20260108 yh init
 */

import db from '../../models/index.js';
import { SUCCESS } from "../../../configs/responseCode.config.js";
import { createBaseResponse } from "../../../app/utils/createBaseResponse.util.js";


async function registerCleaner(req, res, next) {

    const {
        name, gender, email, password, phoneNumber,
        locationId 
    } = req.body;
    
 
    const hashedPassword = password; 
    
    const validLocationIds = locationId 
        ? (Array.isArray(locationId) ? locationId : [locationId]) //
            .map(id => parseInt(id))
            .filter(id => !isNaN(id))
        : [];
    
    // 트랜잭션 시작
    const transaction = await db.sequelize.transaction();

    try {
       
        const newCleaner = await db.Cleaner.create({
            name,
            gender,
            email,
            password,
            phoneNumber,
            provider: req.params.provider || req.body.provider || 'NONE',
        }, { transaction });

        const cleanerId = newCleaner.id;


        if (validLocationIds.length > 0) {
            // 2. DriverRegion 데이터 생성 (지역 연결)
            const regionRecords = validLocationIds.map(locationId => ({
                cleanerId: cleanerId,
                locationId: locationId, 
            }));

            await db.DriverRegion.bulkCreate(regionRecords, { transaction });
        }

        // 3. 트랜잭션 커밋
        await transaction.commit();

        // 4. 최종 응답 전송
        return res.json(createBaseResponse(SUCCESS, newCleaner));
        
    } catch (err) {
        // 5. 오류 발생 시 롤백
        await transaction.rollback();
        
        // 6. 상세 에러 로그 출력 및 에러 핸들러로 이동
        console.error('트랜잭션 중 에러 발생:', err.name, err.message, err.errors);
        next(err);
    }
}


export default {
    registerCleaner,
}