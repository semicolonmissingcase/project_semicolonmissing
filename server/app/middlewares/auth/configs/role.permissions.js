/**
 * @file app/middlewares/auth/configs/role.permissions.js
 * @description 요청 별 접근 권한 설정
 * 251223 v1.0.0 jae init
 */

import ROLE from "./role.enum.js";
const { ADMIN, OWNER, CLEANER } = ROLE;

// 인증 및 인가가 필요한 요청만 정의
const ROLE_PERMISSIONS = {
  GET: [
    {path: /^\/api\/auth\/me$/, roles: [OWNER, CLEANER],},
    {path: /^\/api\/stores$/, roles: [OWNER],}, // 매장 정보
    {path: /^\/api\/owners\/mypage\/stats$/, roles: [OWNER],}, // 점주 마이페이지 통계
    {path: /^\/api\/owners\/reservations$/, roles: [OWNER],}, // 점주 예약 목록 조회
    {path: /^\/api\/reservations\/\d+\/estimates$/, roles: [OWNER],}, // 특정 예약에 대한 견적서 목록 조회
    {path: /^\/api\/reservations\/estimates\/accepted$/, roles: [OWNER],}, // 예약 완료 목록 조회
    {path: /^\/api\/owners\/mypage\/favorite-cleaners$/, roles: [OWNER],}, // 찜한 기사님 목록 조회
    {path: /^\/api\/posts\/owner\/inquiries$/, roles: [OWNER, CLEANER],}, // 내 문의 목록 조회
    {path: /^\/api\/posts\/owner\/inquiries\/\d+$/, roles: [OWNER, CLEANER] }, // 내 문의 상세 조회
    {path: /^\/api\/posts\/owner\/reviews$/, roles: [OWNER],}, // 리뷰 조회
  ],
  POST: [
    { path: /^\/api\/chat\/rooms$/, roles: [OWNER] },
    { path: /^\/api\/v1\/auth\/logout$/, roles: [OWNER, CLEANER]}, // 둘 다 허용
    { path: /^\/api\/payments\/ready$/,  roles: [OWNER, CLEANER]},
    { path: /^\/api\/payments\/confirm$/, roles: [OWNER] },
    { path: /^\/api\/stores$/, roles: [OWNER] }, // 매장 추가
    { path: /^\/api\/owners\/profile$/, roles: [OWNER] }, // 점주 프로필 이미지 업로드
    { path: /^\/api\/owners\/cleaners\/\d+\/like$/, roles: [OWNER] }, // 기사님 좋아요
    { path: /^\/api\/posts\/inquiries$/, roles: [OWNER, CLEANER] }, // 문의 생성
  ],
  PUT: [
    { path: /^\/api\/auth\/me$/, roles: [OWNER] }, // 점장 정보수정용
    { path: /^\/api\/owners\/mypage\/profile$/, roles: [OWNER] }, // 점주 프로필용
  ],
  DELETE: [
    { path: /^\/api\/stores\/\d+$/, roles: [OWNER] }, // 매장 삭제
  ]
}
Object.freeze(ROLE_PERMISSIONS);

export default ROLE_PERMISSIONS;