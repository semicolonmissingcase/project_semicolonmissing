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
    { path: /^\/api\/auth\/me$/, roles: [OWNER, CLEANER] },
    { path: /^\/api\/stores$/, roles: [OWNER] }, // 매장 정보
    { path: /^\/api\/owners\/mypage\/stats$/, roles: [OWNER] }, // 점주 마이페이지 통계
    { path: /^\/api\/owners\/reservations$/, roles: [OWNER] }, // 점주 예약 목록 조회
    { path: /^\/api\/reservations\/\d+\/estimates$/, roles: [OWNER] }, // 특정 예약에 대한 견적서 목록 조회
    { path: /^\/api\/reservations\/estimates\/accepted$/, roles: [OWNER] }, // 예약 완료 목록 조회
    { path: /^\/api\/owners\/mypage\/favorite-cleaners$/, roles: [OWNER] }, // 찜한 기사님 목록 조회
    { path: /^\/api\/posts\/owner\/inquiries$/, roles: [OWNER, CLEANER] }, // 내 문의 목록 조회
    { path: /^\/api\/posts\/owner\/inquiries\/\d+$/, roles: [OWNER, CLEANER] }, // 내 문의 상세 조회
    { path: /^\/api\/cleaners\/mypage\/pending$/, roles: [CLEANER] }, // 대기 작업 조회
    { path: /^\/api\/cleaners\/mypage\/today$/, roles: [CLEANER] },   // 오늘 일정 조회
    { path: /^\/api\/cleaners\/mypage\/qna$/, roles: [CLEANER] }, // 기사님 문의
    { path: /^\/api\/cleaners\/mypage\/reviews$/, roles: [CLEANER] }, // 기사님 본인 리뷰 조회
    { path: /^\/api\/posts\/owner\/reviews$/, roles: [OWNER] }, // 리뷰 목록 조회
    { path: /^\/api\/posts\/owner\/reservations\/completed$/, roles: [OWNER] }, // 리뷰 작성 전 목록 조회
    { path: /^\/api\/posts\/owner\/reviews\/\d+$/, roles: [OWNER] }, // 개별 리뷰 상세 조회
    { path: /^\/api\/chat\/rooms$/, roles: [OWNER, CLEANER] }, // 채팅방 목록 조회
    { path: /^\/api\/chat\/rooms\/\d+\/messages$/, roles: [OWNER, CLEANER] }, // 채팅 메시지 내역 조회
    { path: /^\/api\/chat\/rooms\/\d+\/sidebar$/, roles: [OWNER, CLEANER] }, // 채팅 사이드바 정보 조회
    { path: /^\/api\/chat\/rooms\/\d+\/reviews$/, roles: [OWNER, CLEANER] }, // 채팅 사이드바 리뷰 조회
    { path: /^\/api\/owners\/quotations$/, roles: [OWNER], }, // 견적 리스트 조회
    { path: /^\/api\/cleaners\/accountinfo$/, roles: [CLEANER] }, // 기사님 계좌 조회
    // -------------------------
    // 관리자 관련
    // -------------------------
    { path: /^\/api\/admin\/cleaners\/profiles$/, roles: [ADMIN] }, // 관리자 기사 관리 조회
    { path: /^\/api\/admin\/owners\/profiles$/, roles: [ADMIN] }, // 관리자 유저 관리 조회
    { path: /^\/api\/admin\/adjustments\/view$/, roles: [ADMIN] }, // 관리자 정산 관리 조회
  ],
  POST: [
    { path: /^\/api\/chat\/rooms$/, roles: [OWNER] },
    { path: /^\/api\/v1\/auth\/logout$/, roles: [OWNER, CLEANER] }, // 둘 다 허용
    { path: /^\/api\/payments\/ready$/, roles: [OWNER, CLEANER] },
    { path: /^\/api\/payments\/confirm$/, roles: [OWNER] },
    { path: /^\/api\/payments\/cancel$/, roles: [OWNER] }, // 결제 취소
    { path: /^\/api\/admin\/logout$/, roles: [ADMIN] },
    { path: /^\/api\/stores$/, roles: [OWNER] }, // 매장 추가
    { path: /^\/api\/owners\/profile$/, roles: [OWNER] }, // 점주 프로필 이미지 업로드
    { path: /^\/api\/owners\/cleaners\/\d+\/like$/, roles: [OWNER] }, // 기사님 좋아요
    { path: /^\/api\/posts\/inquiries$/, roles: [OWNER, CLEANER] }, // 문의 생성
    { path: /^\/api\/owners\/quotations$/, roles: [OWNER] }, // 견적 요청서 작성
    { path: /^\/api\/chat\/rooms\/\d+\/messages$/, roles: [OWNER, CLEANER] }, // 채팅메시지 전송
    { path: /^\/api\/chat\/rooms\/\d+\/upload$/, roles: [OWNER, CLEANER] }, // 채팅 이미지 업로드
    { path: /^\/api\/cleaners\/quotations$/, roles: [CLEANER] }, // 견적 요청서 수락
    { path: /^\/api\/posts\/owner\/reviews$/, roles: [OWNER] }, // 리뷰 작성
  ],
  PATCH: [
    { path: /^\/api\/chat\/rooms\/\d+\/read$/, roles: [OWNER, CLEANER] }, // 메세지 읽음 처리
    { path: /^\/api\/chat\/rooms\/\d+\/leave$/, roles: [OWNER, CLEANER] }, // 채팅방 나가기
    { path: /^\/api\/chat\/rooms\/\d+\/close$/, roles: [OWNER, CLEANER] }, // 채팅 상담 종료
  ],
  PUT: [
    { path: /^\/api\/auth\/me$/, roles: [OWNER] }, // 점주 정보수정용
    { path: /^\/api\/owners\/mypage\/profile$/, roles: [OWNER] }, // 점주 프로필용
    { path: /^\/api\/cleaners\/mypage\/info$/, roles: [CLEANER] }, // 기사님 정보 수정
    { path: /^\/api\/cleaners\/mypage\/password$/, roles: [CLEANER] }, // 기사님 비밀번호 수정
  ],
  DELETE: [
    { path: /^\/api\/stores\/\d+$/, roles: [OWNER] }, // 매장 삭제
    { path: /^\/api\/posts\/owner\/reviews\/\d+$/, roles: [OWNER] }, // 리뷰 삭제
  ]
}
Object.freeze(ROLE_PERMISSIONS);

export default ROLE_PERMISSIONS;