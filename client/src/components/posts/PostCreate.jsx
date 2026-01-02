import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./PostCreate.css";
import WritePost from "./WritePost.jsx";
import { createGuestInquiry, createInquiry } from "../../api/axiosPost.js";

// 임시설정
const useAuthStatus = () => { 
  return { isLoggedIn: false, userRole: null, userId: null 
  };
};

export default function PostCreate() {
  const navigate = useNavigate();
  const { isLoggedIn, userRole, userId } = useAuthStatus();
  const [content, setContent] = useState(''); // 에디터 내용 상태
  const [isPasswordProtectedGuestPost, setIsPasswordProtectedGuestPost] = useState(false); // 비밀번호 관련

  const [postData, setPostData] = useState({
    category: '카테고리 선택',
    email: '',
    password: '',
    title: ''
  });

  const categories = [
    '카테고리 선택',
    '견적 문의',
    '서비스 문의',
    '기술 지원',
    '불만/개선사항',
  ];

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setPostData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function handleCategoryChange(e) {
    setPostData(prev => ({
      ...prev,
      category: e.target.value
    }));
  }

  function qnaPage() {
    navigate('/qnaposts');
  }

  // 문의하기 버튼 클릭시 resultPage 변경
  async function handleSubmit() {
    if (postData.category === '카테고리 선택') {
      alert('카테고리를 선택해주세요.');
      return;
    }
    if(!postData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!content || content === '<p>&nbsp;</p>' || content.trim() === '') {
      alert('내용을 입력해주세요.');
      return;
    }
    // 비회원이 비밀번호 체크 시 비밀번호 유효성 검사
    if (!isLoggedIn) { // 비회원일 때만 이메일과 비밀번호 유효성 검사
      if (!postData.email) {
        alert('이메일을 입력해주세요.');
        return;
      }
      if (isPasswordProtectedGuestPost && !postData.password) {
        alert('비밀번호를 입력해주세요.');
        return;
      }
    } 
    // 최종 데이터 통합 (Express 서버로 보낼 객체)
    const finalSubmission = {
      title: `${postData.category}: ${postData.title}`,
      content: content // CKEditor에서 전달받은 HTML 문자열
    };

    try {
      if(isLoggedIn) {
        // 로그인한(유저) 문의 생성
        await createInquiry(finalSubmission);
        alert('문의가 성공적으로 등록되었습니다.');
        navigate('/owner/mypage/inquiries')
      } else {
        // 비회원 문의 생성
        const guestInquiryData = {
          ...finalSubmission,
          guestName: postData.email,
          guestPassword: isPasswordProtectedGuestPost ? postData.password : null,
        };
        await createGuestInquiry(guestInquiryData);
        alert('문의가 성공적으로 등록되었습니다.');
        navigate('/some-guest-inquiry-success-page');
        }
      } catch (error) {
        console.error("문의 등록 실패:", error);
        alert('문의 등록에 실패했습니다. 다시 시도해주세요.');
      }
    }   

  return (
    <div className="postcreate-background">
      <div className="all-container postcreate-container"> 
        <div className="postcreat-title">
          <h2>문의 등록</h2>
        </div>

        <div className="postcreate-form-container">
          <div className="postcreate-top-section">
            <div className="postcreate-field">
              <select 
                name="category"
                value={postData.category}
                onChange={handleCategoryChange}
                className="postcreate-category-select"
              >
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {!isLoggedIn && (
              <>
                <div className="postcreate-field">
                  <label htmlFor="email"> 이메일 </label>
                  <input
                    type="email"
                    name="email"
                    value={postData.email}
                    onChange={handleChange}
                    placeholder="이메일"
                    className="postcreate-email-input"
                  />
                </div>

                <div className="postcreate-field postcreate-password-field">
                  <label className="postcreate-checkbox-label">
                    <input
                      type="checkbox"
                      name="isPasswordProtectedGuestPost"
                      checked={isPasswordProtectedGuestPost}
                      onChange={(e) => setIsPasswordProtectedGuestPost(e.target.checked)}
                      className="postcreate-checkbox"
                    />
                    <span>비밀번호</span>
                  </label>
                  {isPasswordProtectedGuestPost && (
                    <input
                      type="password"
                      name="password"
                      value={postData.password}
                      onChange={handleChange}
                      placeholder="비밀번호 입력"
                      className="postcreate-password-input"
                    />
                  )}
                </div>
              </>
            )}            
          </div>

          <div className="postcreate-title-section">
            <label htmlFor="title" className="postcreate-label">제목</label>
            <input
              type="text"
              id="title"
              name="title"
              value={postData.title}
              onChange={handleChange}
              placeholder="제목을 입력하세요"
              className="postcreate-title-input"
            />
          </div>

          <div className="postcreate-editor-container">
            {/* 4. setContent를 전달하여 에디터 내용을 부모 상태에 저장 */}
            <WritePost onContentChange={setContent} />
          </div>
        </div>

        <div className="postcreate-btn-container">
          <button type="button" className="bg-light btn-medium" onClick={qnaPage}>
            작성 취소
          </button>
          <button type="button" className="bg-blue btn-medium" onClick={handleSubmit}>
            문의 하기
          </button>
        </div>
      </div>
    </div>
  );
}