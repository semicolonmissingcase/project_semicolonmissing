/**
 * @file app/middlewares/cors/cors.middleware.js
 * @description cors Middleware
 * 260112 pbj init
 */

import cors from 'cors';
import { FORBIDDEN_ERROR } from '../../../configs/responseCode.config.js';
import myError from '../../errors/customs/my.error.js';

const allowedOrigins = [
  process.env.APP_URL,
];

export default cors({
  origin: function (origin, callback) {
    // 허용된 목록에 있거나, dev 모드면 허용
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.APP_MODE === 'dev') {
      callback(null, true); // 허용
    } else {
      callback(myError('Not allowed by CORS', FORBIDDEN_ERROR)); // 거부
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
});