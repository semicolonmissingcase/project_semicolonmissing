import React, { useState, useEffect } from 'react';
import { getMyInquiry } from '../../../api/axiosPost.js';
import './InquiryHistory.css';
import { Link, useNavigate } from 'react-router-dom';

export default function InquiryHistory() {
  const navigate = useNavigate();
  const [inquiryData, setInquiryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        const responseData = await getMyInquiry();

        const transformedData = responseData.map(item => ({
          id: item.id,
          title: item.title,
          question: item.content,
          answer: item.answers && item.answers.length > 0
                  ? item.answers[0].content
                  : '아직 답변이 등록되지 않았습니다.',
          status: item.status,
          createdAt: item.createdAt,
        }));

        setInquiryData(transformedData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  function qnaPostCreate() {
    navigate('/qnaposts/create');
  }

  if(loading) {
    return <div className="text-center">문의 내역을 불러오는 중입니다...</div>;
  }

  if(error) {
    return <div className="text-center py-4 text-red-500">문의 내역을 불러오는데 실패했습니다: {error.message}</div>
  }

  if(inquiryData.length === 0) {
    return <div className="text-center">작성하신 문의 내역이 없습니다.</div>;
  }
  
  return (
    <div className="inquiryhistory-tab-container">
      <div className="inquiryhistory-top-action">
        <button className="inquiryhistory-write-btn" onClick={qnaPostCreate}>
          문의 작성하기 <span className="inquiryhistory-btn-icon">▶</span>
        </button>
      </div>

      {inquiryData.length === 0 ? (
        <div className="text-center">작성하신 문의 내역이 없습니다.</div>
      ) : (
        <div className="inquiryhistory-list">
          {inquiryData.map((item, index) => (
            <div 
              key={item.id} 
              className={`inquiryhistory-item ${activeIndex === index ? 'active' : ''}`}
            >
              <div className="inquiryhistory-header" onClick={() => toggleAccordion(index)}>
                <span className="inquiryhistory-q-prefix">Q.</span>
                <span className="inquiryhistory-title-text">{item.title}</span>
                <span className={`inquiryhistory-status ${item.status === 'PENDING' ? 'status-pending' : 'status-completed'}`}>
                  {item.status === 'PENDING' ? '답변 완료' : '답변 대기중'}
                </span>
                <span className="inquiryhistory-arrow-icon">
                  {activeIndex === index ? '▲' : '▼'}
                </span>
              </div>

              {activeIndex === index && (
                <div className="inquiryhistory-body">
                  <div className="inquiryhistory-question-content">{item.question}</div>
                  <div className="inquiryhistory-divider"></div>
                  <div className="inquiryhistory-answer-content">
                    <span className="inquiryhistory-a-prefix">A.</span>
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}