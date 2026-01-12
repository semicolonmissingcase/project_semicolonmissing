import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './QnaPostShow.css';
import { getInquiryShow } from '../../api/axiosPost.js';
import ConfirmModal from '../result/ConfirmModal.jsx';

export default function QnaPostShow() {
  const params = useParams();
  const { id: inquiryId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [guestPassword, setGuestPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState(null);

  const fetchPost = async (password = null) => {
    try {
      setLoading(true);
      setError(null);
      setPasswordError('');

      if (!inquiryId) {
        throw new Error("유효한 문의글 ID가 없습니다.");
      }

      const response = await getInquiryShow(inquiryId, password);
      setPost(response.inquiry);
      setShowPasswordPrompt(false);

    } catch (err) {
      console.error("문의글 조회에 실패했습니다.", err);
      
      if (err.response?.data?.code === 'PASSWORD_REQUIRED') {
        setShowPasswordPrompt(true);
        setPasswordError(err.response.data.msg);
      } else if (err.response?.data?.code === 'UNAUTHORIZED_ERROR' && password) {
        setShowPasswordPrompt(true);
        setPasswordError(err.response.data.msg || '비밀번호가 일치하지 않습니다.');
      } else {
        setError("문의글을 불러오는데 실패했습니다: " + (err.response?.data?.msg || err.message));
        setModalConfig({
          title: '문의글 조회 오류',
          message: err.response?.data?.msg || "문의글을 불러오는 데 실패했습니다.",
          confirmText: '확인',
          onConfirm: () => setIsConfirmModalOpen(false)
        });
        setIsConfirmModalOpen(true);
      }
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [inquiryId]);

  const handlePasswordSubmit = () => {
    if (!guestPassword) {
      setPasswordError('비밀번호를 입력해주세요.');
      return;
    }
    fetchPost(guestPassword);
  };

  const handleGoToList = () => {
    navigate('/qnaposts');
  };

  if (loading) {
    return <div className="qnapostshow-loading">문의글을 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="qnapostshow-error">{error}</div>;
  }

  if (showPasswordPrompt) {
    return (
      <div className="qnapostshow-password-prompt-container">
        <div className="qnapostshow-password-prompt-box">
          <p className="qnapostshow-password-prompt-text">
            비회원 문의글은 비밀번호를 입력해야 조회할 수 있습니다.
          </p>
          <input 
            type="password"
            className="qnapostshow-password-input"
            value={guestPassword}
            onChange={(e) => setGuestPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요"
          />
          {passwordError && <p className="qnapostshow-password-error">{passwordError}</p>}
          <button className="qnapostshow-password-submit-btn" onClick={handlePasswordSubmit}>
            확인
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return <div className="qnapostshow-error">문의글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="qnapostshow-page">
      <div className="all-container qnapostshow-container">
        <div className="qnapostshow-content">
          
          {/* 문의 내용 섹션 */}
          <section className="qnapostshow-question-section">
            <h2 className="qnapostshow-section-title">Q. 문의 내용</h2>
            
            <div className="qnapostshow-table">
              {/* 이름 / 등록일 */}
              <div className="qnapostshow-row">
                <div className="qnapostshow-cell">
                  <span className="qnapostshow-label">이름</span>
                  <span className="qnapostshow-value">
                    {post.owner?.name || post.cleaner?.name || post.guestName || '정보 없음'}
                  </span>
                </div>
                <div className="qnapostshow-cell">
                  <span className="qnapostshow-label">등록일</span>
                  <span className="qnapostshow-value">{post.createdAt || '날짜 없음'}</span>
                </div>
              </div>
              
              {/* 카테고리 / 답변여부 */}
              <div className="qnapostshow-row">
                <div className="qnapostshow-cell">
                  <span className="qnapostshow-label">카테고리</span>
                  <span className="qnapostshow-value">{post.category || '카테고리 없음'}</span>
                </div>
                <div className="qnapostshow-cell">
                  <span className="qnapostshow-label">답변여부</span>
                  <div className="qnapostshow-status-tags">
                    {post.status === '답변 완료' ? (
                      <span className="qnapostshow-status-tag qnapostshow-status-delete">답변 완료</span>
                    ) : (
                      <span className="qnapostshow-status-tag qnapostshow-status-complete">대기중</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 제목 */}
              <div className="qnapostshow-row single-col">
                <div className="qnapostshow-cell">
                  <span className="qnapostshow-label">제목</span>
                  <span className="qnapostshow-value admin-request">{post.title || '제목 없음'}</span>
                </div>
              </div>

              {/* 내용 */}
              <div className="qnapostshow-row single-col no-border">
                <div className="qnapostshow-cell content-cell">
                  <div className="qnapostshow-label">내용</div>
                  <div className="qnapostshow-message-text">
                    <div className="qnapostshow-message-text"
                      dangerouslySetInnerHTML={{ __html: post.content || '내용 없음' }} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 답변 내용 섹션 */}
          <section className="qnapostshow-answer-section">
            <h2 className="qnapostshow-section-title">A. 답변 내용</h2>
            <div className="qnapostshow-table">
              <div className="qnapostshow-row single-col no-border">
                <div className="qnapostshow-cell content-cell">
                  <div className="qnapostshow-label">내용</div>
                  <div className="qnapostshow-answer-body">
                    {post.answer ? (
                      <>
                        <div dangerouslySetInnerHTML={{ __html: post.answer.content || '답변 내용 없음' }}/>
                        <p className="qnapostshow-answer-timestamp">
                          답변시각: {post.answer.createdAt || '날짜 없음'}
                        </p>
                      </>
                    ) : (
                      <p>아직 답변이 등록되지 않았습니다.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 목록으로 가기 버튼 */}
          <div className="qnapostshow-footer">
            <button className="qnapostshow-list-btn" onClick={handleGoToList}>
              목록으로 가기
            </button>
          </div>          
        </div>

        {isConfirmModalOpen && modalConfig && (
          <ConfirmModal
            open={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            config={modalConfig}
          />
        )}
      </div>
    </div>
  );
}