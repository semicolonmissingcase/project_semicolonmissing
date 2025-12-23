/**
 * @file app/errors/customs/my.error.js
 * @description 공통 에러 객체 생성 함수
 */

const myError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode || 500;
  return error;
};

export default myError;