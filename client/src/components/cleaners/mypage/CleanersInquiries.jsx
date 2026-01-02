import { FaRegClock, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';
import { MdOutlineTitle, MdMessage } from 'react-icons/md';
import "./CleanersInquiries.css";

const InquiryCard = ({ inquiry }) => {
  // 상태에 따른 배지 색상/아이콘 설정
  const isPending = inquiry.status === "대기중";

  return (
    <div className="cancelledjoblist-card" style={{ marginBottom: '1rem' }}>
      {/* 제목 (매장명 위치 활용) */}
      <div className="cancelledjoblist-card-row" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '8px', marginBottom: '8px' }}>
        <div className="completedjoblist-card-place">
          <MdOutlineTitle style={{ fontSize: '1.2rem', color: '#4A90E2', marginRight: '4px' }} />
          <span className="completedjoblist-card-value" style={{ fontWeight: '700' }}>
            {inquiry.title}
          </span>
        </div>
        {/* 상태 배지 추가 */}
        <span style={{
          fontSize: '0.75rem',
          padding: '2px 8px',
          borderRadius: '12px',
          backgroundColor: isPending ? '#FFF4E5' : '#E5F9F1',
          color: isPending ? '#FFA000' : '#00C853',
          fontWeight: 'bold'
        }}>
          {inquiry.status}
        </span>
      </div>

      {/* 작성 시간 */}
      <div className="cancelledjoblist-card-row">
        <span className="cancelledjoblist-card-label">
          <FaRegClock style={{ marginRight: '4px' }} /> 작성일
        </span>
        <span className="cancelledjoblist-card-value">
          {inquiry.created_at.split(' ')[0]} {/* 날짜만 표시 */}
        </span>
      </div>

      {/* 문의 내용 (위치 칸 활용) */}
      <div className="cancelledjoblist-card-row" style={{ alignItems: 'flex-start' }}>
        <span className="cancelledjoblist-card-label">
          <MdMessage style={{ marginRight: '4px' }} /> 내용
        </span>
        <span className="cancelledjoblist-card-value" style={{ 
          display: '-webkit-box', 
          WebkitLineClamp: '2', 
          WebkitBoxOrient: 'vertical', 
          overflow: 'hidden',
          lineHeight: '1.4',
          color: '#666'
        }}>
          {inquiry.content}
        </span>
      </div>

      {/* 답변 대상 또는 작성자 구분 (점주 이름 칸 활용) */}
      <div className="cancelledjoblist-card-row">
        <span className="cancelledjoblist-card-label">구분</span>
        <span className="cancelledjoblist-card-value">
          {inquiry.owner_id ? "점주 문의" : "기사 문의"}
        </span>
      </div>
    </div>
  );
};

export default function InquiryList() {
  const inquiryData = [
    {
      "id": 1,
      "owner_id": null,
      "cleaner_id": 1,
      "title": "지난주 작업 완료 건 수익금 입금 확인 요청",
      "content": "안녕하세요. OOO 기사입니다. 지난주 완료된 청소 건들에 대한 정산금이...",
      "status": "대기중",
      "created_at": "2026-01-01 13:24:57",
    }
  ];

  return (
    <div className="cancelledjoblist-cards">
      {inquiryData.map((item) => (
        <InquiryCard key={item.id} inquiry={item} />
      ))}
    </div>
  );
}