import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./PostCreate.css";
import WritePost from "./WritePost.jsx";

export default function PostCreate() {
  const navigate = useNavigate();

  // 게시글 작성 상태 관리
  const [postData, setPostData] = useState({
    category: '카테고리 선택',
    isPrivate: false,
    email: '',
    password: '',
    title: ''
  });

  // 카테고리 목록
  const categories = [
    '카테고리 선택',
    '견적 문의',
    '서비스 문의',
    '기술 지원',
    '불만/개선사항',
  ];

  // 입력 필드 변경 처리
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setPostData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  // 카테고리 선택 변경
  function handleCategoryChange(e) {
    setPostData(prev => ({
      ...prev,
      category: e.target.value
    }));
  }

  // 문의사항 목록으로 이동
  function qnaPage() {
    navigate('/qnaposts');
  }

  // 문의 제출 처리
  function resultPage() {
    // 유효성 검사
    if (postData.category === '카테고리 선택') {
      alert('카테고리를 선택해주세요.');
      return;
    }
    if (!postData.email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    if (postData.isPrivate && !postData.password) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    if (!postData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    // TODO: SmartEditor2에서 내용 가져오기
    // const content = getSmartEditorContent();

    // 결과 페이지로 이동
    navigate('/results');
  }

  return (
    <div className="postcreate-background">
      <div className="all-container postcreate-container"> 
        <div className="postcreat-title">
          <h2>문의 등록</h2>
        </div>

        {/* 입력 영역 */}
        <div className="postcreate-form-container">
          {/* 상단 입력 영역: 카테고리, 이메일, 비밀번호 */}
          <div className="postcreate-top-section">
            {/* 카테고리 선택 */}
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

            {/* 이메일 입력 */}
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

            {/* 비밀번호 체크박스 & 입력 */}
            <div className="postcreate-field postcreate-password-field">
              <label className="postcreate-checkbox-label">
                <input
                  type="checkbox"
                  name="isPrivate"
                  checked={postData.isPrivate}
                  onChange={handleChange}
                  className="postcreate-checkbox"
                />
                <span>비밀번호</span>
              </label>
              {postData.isPrivate && (
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
          </div>

          {/* 제목 입력 */}
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

          {/* SmartEditor2 컴포넌트 */}
          <div className="postcreate-editor-container">
            <WritePost />
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="postcreate-btn-container">
          <button type="button" className="bg-light btn-medium" onClick={qnaPage}>
            작성 취소
          </button>
          <button type="button" className="bg-blue btn-medium" onClick={resultPage}>
            문의 하기
          </button>
        </div>
      </div>
    </div>
  );
}