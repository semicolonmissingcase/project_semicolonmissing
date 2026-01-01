import { body } from "express-validator";

export const name = body('name').trim().notEmpty().withMessage("이름은 필수입니다.");
export const introduction = body('introduction').trim().optional();
export const experience = body('experience').optional(); // DB 컬럼 없으므로 검증만 수행
export const locations = body('locations').custom((value) => {
    // FormData로 전달 시 문자열일 수 있으므로 파싱 후 확인
    const locs = typeof value === 'string' ? JSON.parse(value) : value;
    if (!Array.isArray(locs) || locs.length < 1 || locs.length > 5) {
        throw new Error("지역은 1개에서 5개까지 선택 가능합니다.");
    }
    return true;
});

export default { name, introduction, experience, locations };