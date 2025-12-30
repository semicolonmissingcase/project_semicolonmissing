import React from 'react';
import './QnaPostShow.css';

export default function QnaPostShow() {
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
                  <span className="qnapostshow-value">차점주</span>
                </div>
                <div className="qnapostshow-cell">
                  <span className="qnapostshow-label">등록일</span>
                  <span className="qnapostshow-value">2025/12/03</span>
                </div>
              </div>
              
              {/* 카테고리 / 답변여부 */}
              <div className="qnapostshow-row">
                <div className="qnapostshow-cell">
                  <span className="qnapostshow-label">카테고리</span>
                  <span className="qnapostshow-value">예약 문의</span>
                </div>
                <div className="qnapostshow-cell">
                  <span className="qnapostshow-label">답변여부</span>
                  <div className="qnapostshow-status-tags">
                    <span className="qnapostshow-status-tag qnapostshow-status-complete">읽음</span>
                    <span className="qnapostshow-status-tag qnapostshow-status-delete">답변완료</span>
                  </div>
                </div>
              </div>

              {/* 제목 */}
              <div className="qnapostshow-row single-col">
                <div className="qnapostshow-cell">
                  <span className="qnapostshow-label">제목</span>
                  <span className="qnapostshow-value admin-request">집에 가고싶음</span>
                </div>
              </div>

              {/* 내용 */}
              <div className="qnapostshow-row single-col no-border">
                <div className="qnapostshow-cell content-cell">
                   <div className="qnapostshow-label">내용</div>
                   <div className="qnapostshow-message-text">
                     <p>내 힘들다요.....</p>
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
                      <p>안녕하세요, 점주님. 아이스닥터입니다.</p>
                      <p className="qnapostshow-answer-timestamp">답변시각: 2025년 12월 24일 08:27:00</p>
                    </div>
                  </div>
               </div>
            </div>
          </section>

          {/* 목록으로 가기 버튼 */}
          <div className="qnapostshow-footer">
            <button className="qnapostshow-list-btn">목록으로 가기</button>
          </div>
          
        </div>
      </div>
    </div>
  );
}