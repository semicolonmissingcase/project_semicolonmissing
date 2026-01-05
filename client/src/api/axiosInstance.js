import axios from 'axios';

// store 저장용 변수
let store = null;

// store 주입용 함수
export function injectStoreInAxios(_store) {
  store = _store;
}

// axios 인스턴스 생성  (컴포넌트 X , 훅 사용 불가)
const axiosInstance = axios.create({
  // baseURL: '',  <-- 기존 빈 값을 아래처럼 수정하세요!
  baseURL: 'http://localhost:3000', //dev올리기 전에는 지우고 올리기?? 물어보고..
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});
// 서버에 요청 보내기 전 만료 확인 
axiosInstance.interceptors.request.use(async (config) => { // confing에 리퀘스트 객체의 옵션을 가져옴.
  const accessToken = store.getState().auth.accessToken;
   if(accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
   }  
    return config;
  },
  (error)  => {
    console.log('axios interceptor error', error);
    return Promise.reject(error);
  }
);


export default axiosInstance;