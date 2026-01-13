import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import { reissueThunk } from '../store/thunks/authThunk.js';

// store 저장용 변수
let store = null;

// store 주입용 함수
export function injectStoreInAxios(_store) {
  store = _store;
}

// axios 인스턴스 생성  (컴포넌트 X , 훅 사용 불가)
const axiosInstance = axios.create({
  baseURL: import.meta.VITE_APP_SERVER_URL, // 기본 URL (axios 호출 시, 가장 앞에 자동으로 연결하여 동작)
  headers: {  // Json
    'Content-Type': 'application/json',  // 문자열로 인식시키기 위해서 ' '사용
  },
  // 크로스 도메인(서로 다른 도메인)에 요청 보낼 때, credential 정보를 담아서 보낼지 여부 설정.
  // credential 정보 : 1. 쿠키, 2. 헤더 Authorization 항목
  withCredentials: true, 
});
// 서버에 요청 보내기 전 만료 확인 
axiosInstance.interceptors.request.use(async (config) => { // confing에 리퀘스트 객체의 옵션을 가져옴.

    return config;
  },
  (error)  => {
    console.log('axios interceptor error', error);
    return Promise.reject(error);
  }
);


export default axiosInstance;