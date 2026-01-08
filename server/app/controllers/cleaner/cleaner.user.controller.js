/**
 * @file app/controllers/cleaners/cleaner.user.controller.js
 * @description 기사 회원가입 컨트롤러
 * 20260108 yh init
 */

import db from '../../models/index.js';
import { SUCCESS } from "../../../configs/responseCode.config.js";
import { createBaseResponse } from "../../../app/utils/createBaseResponse.util.js";
import bcrypt from 'bcrypt';

// 🚨 [수정 1] saltRounds 정의 (일반적으로 환경 변수나 설정 파일에서 가져옴)
const saltRounds = 10; 

async function registerCleaner(req, res, next) {

    const {
        name, gender, email, password: plainTextPassword, // 🚨 [수정 2] 요청 바디에서 'password'를 'plainTextPassword'로 별칭 지정
        locationId 
    } = req.body;
    
    // 🚨 [수정 3] 미정의 변수 (plainTextPassword)를 req.body에서 받은 비밀번호로 사용
    const hashedPassword = bcrypt.hashSync(plainTextPassword, saltRounds);
    
    // ... (locationId 처리 로직은 그대로 유지)
    const validLocationIds = locationId 
        ? (Array.isArray(locationId) ? locationId : [locationId]) 
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
            // 🚨 [수정 4] DB 모델 필드에 맞춰 해시된 비밀번호를 'password' 필드에 저장
            password: hashedPassword, 
            phoneNumber: req.body.phoneNumber, // req.body에서 phoneNumber를 직접 사용
            provider: req.params.provider || req.body.provider || 'NONE',
        }, { transaction });

        const cleanerId = newCleaner.id;

        // ... (DriverRegion 처리 로직은 그대로 유지)
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