import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom"; // URL 파라미터 읽기 위해 추가
import { reissueThunk } from "../../store/thunks/authThunk.js";

export default function Social() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation(); // 현재 URL 정보를 가져옴

  useEffect(() => {
    async function getAuth() {
      // 1. URL에서 쿼리 스트링 추출 (백엔드가 보낸 정보)
      const params = new URLSearchParams(location.search);
      const email = params.get("email");
      const nick = params.get("nick");
      const profile = params.get("profile");

      // 2. 신규 유저 판별: URL에 email 정보가 넘어왔다면 가입 페이지로 이동
      if (email) {
        // 추가 정보 입력 페이지로 이동 (이메일, 닉네임 등을 쿼리로 전달)
        navigate(
          `/auth/extra-info?email=${email}&nick=${encodeURIComponent(nick)}&profile=${profile}`, 
          { replace: true }
        );
        return;
      }

      // 3. 기존 유저 처리 (기존 코드 유지)
      try {
        // 백엔드에서 이미 쿠키에 RefreshToken을 구워줬으므로 reissue 시도
        await dispatch(reissueThunk()).unwrap(); 
        navigate('/', { replace: true });
      } catch (error) {
        console.log('Social', error);
        alert('소셜 로그인 실패');
        navigate('/login', { replace: true });
      }
    }
    
    getAuth();
  }, []);

  return <></>;
}