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
    {path: /^\/api\/auth\/me$/, roles: [OWNER, CLEANER],}
  ],
  POST: [
    { path: /^\/api\/chat\/rooms$/, roles: [OWNER] },
    { path: /^\/api\/v1\/auth\/logout$/, roles: [OWNER, CLEANER]}, // 둘 다 허용
    { path: /^\/api\/payments\/ready$/,  roles: [OWNER, CLEANER]},
    { path: /^\/api\/payments\/confirm$/, roles: [OWNER] },
  ],
  PUT: [
  ],
  DELETE: [
  ]
}
Object.freeze(ROLE_PERMISSIONS);

export default ROLE_PERMISSIONS;