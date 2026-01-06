import React, { useState, useEffect } from 'react'; // 1. Hook 추가
import { FaRegClock } from 'react-icons/fa';
import { MdOutlineTitle, MdMessage } from 'react-icons/md';
import { getCleanerInquiries } from "../../../api/axiosCleaner.js";
import "./CleanersInquiries.css";

const InquiryCard = ({ inquiry }) => {
  const isPending = inquiry.status === "대기중";
  // 데이터 안정성을 위해 날짜 자르기 처리
  const createdAt = inquiry.createdAt || inquiry.created_at || "";
  const dateOnly = createdAt ? createdAt.split('T')[0] : "-"; 

  return (
    <div className="cleaners-inquiries-container">
      <div className="cleaners-inquiries-card" style={{ marginBottom: '1rem' }}>
        <div className="cleaners-inquiries-card-row" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '8px', marginBottom: '8px' }}>
          <div className="completedjoblist-card-place">
            <MdOutlineTitle style={{ fontSize: '1.2rem', color: '#4A90E2', marginRight: '4px' }} />
            <span className="completedjoblist-card-value">{inquiry.title}</span>
          </div>
          <span style={{
            width: '3.5rem', textAlign: 'center', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px',
            backgroundColor: isPending ? '#FFF4E5' : '#E5F9F1',
            color: isPending ? '#FFA000' : '#00C853',
            fontWeight: 'bold'
          }}>
            {inquiry.status}
          </span>
        </div>

        <div className="cleaners-inquiries-card-row">
          <span className="cleaners-inquiries-card-label"><FaRegClock style={{ marginRight: '4px' }} /> 작성일</span>
          <span className="cleaners-inquiries-card-value">{dateOnly}</span>
        </div>

        <div className="cleaners-inquiries-card-row" style={{ alignItems: 'flex-start' }}>
          <span className="cleaners-inquiries-card-label"><MdMessage style={{ marginRight: '4px' }} /> 내용</span>
          <span className="cleaners-inquiries-card-value" style={{ 
            display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', 
            overflow: 'hidden', lineHeight: '1.4', color: '#666'
          }}>
            {inquiry.content}
          </span>
        </div>

        <div className="cleaners-inquiries-card-row">
          <span className="cleaners-inquiries-card-label">구분</span>
          <span className="cleaners-inquiries-card-value">
            {inquiry.ownerId ? "점주 문의" : "기사 문의"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function InquiryList() {
  // 2. 상태 관리 변수 선언
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3. 컴포넌트 마운트 시 데이터 호출
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        const response = await getCleanerInquiries();
        // 백엔드 응답 구조에 따라 response.data.data 등으로 수정될 수 있음
        setInquiries(response.data || []); 
      } catch (error) {
        console.error("문의 목록 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  // 4. 로딩 및 빈 데이터 처리
  if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>데이터를 불러오는 중입니다...</div>;
  if (inquiries.length === 0) return <div style={{ textAlign: 'center', padding: '20px' }}>등록된 문의 내역이 없습니다.</div>;

  return (
    <div className="cleaners-inquiries-cards">
      {inquiries.map((item) => (
        <InquiryCard key={item.id} inquiry={item} />
      ))}
    </div>
  );
}