import React, { useState, useEffect } from 'react';
import { getCleanerInquiries } from "../../../api/axiosCleaner.js";
import "./CleanersInquiries.css";

export default function InquiryList() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null); // 아코디언 제어

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        const response = await getCleanerInquiries();
        
        // 서버 응답 데이터를 점주용 구조와 동일하게 매핑
        const data = response.data?.data || response.data || [];
        setInquiries(data);
      } catch (error) {
        console.error("문의 목록 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (loading) return <div className="cleaners-inquiries-empty">데이터를 불러오는 중입니다...</div>;
  if (inquiries.length === 0) return <div className="cleaners-inquiries-empty">등록된 문의 내역이 없습니다.</div>;

  return (
    <div className="cleaners-inquiries-tab-container">
      {/* 상단 버튼 영역 */}
      <div className="cleaners-inquiries-top-action">
        <button className="cleaners-inquiries-write-btn" onClick={() => window.location.href='/qnaposts/create'}>
          문의 작성하기 <span className="cleaners-inquiries-btn-icon">▶</span>
        </button>
      </div>

      <div className="cleaners-inquiries-list">
        {inquiries.map((item, index) => {
          const isPending = item.status === "대기중";
          const isActive = activeIndex === index;

          return (
            <div key={item.id} className={`cleaners-inquiries-item ${isActive ? 'active' : ''}`}>
              {/* 헤더 부분 (클릭 시 열림) */}
              <div className="cleaners-inquiries-header" onClick={() => toggleAccordion(index)}>
                <span className="cleaners-inquiries-q-prefix">Q.</span>
                <span className="cleaners-inquiries-title-text">{item.title}</span>
                <span className={`cleaners-inquiries-status ${isPending ? 'is-pending' : 'is-completed'}`}>
                  {isPending ? '답변 대기중' : '답변 완료'}
                </span>
                <span className="cleaners-inquiries-arrow-icon">
                  {isActive ? '▲' : '▼'}
                </span>
              </div>

              {/* 바디 부분 (활성화 시 보임) */}
              {isActive && (
                <div className="cleaners-inquiries-body">
                  <div className="cleaners-inquiries-question-content"
                    dangerouslySetInnerHTML={{ __html: item.content }}> {/* p태그 달고 출력되는 거 수정 */}
                    {/* <div className="cleaners-inquiries-date">작성일: {item.createdAt}</div> */}
                  </div>
                  <div className="cleaners-inquiries-divider"></div>
                  <div className="cleaners-inquiries-answer-content">
                    <span className="cleaners-inquiries-a-prefix">A.</span>
                    <p dangerouslySetInnerHTML={{ __html: item.answerContent || "아직 답변이 등록되지 않았습니다." }}></p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}