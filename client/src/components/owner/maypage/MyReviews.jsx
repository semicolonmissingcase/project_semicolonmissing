import './MyReviews.css';

// 내 리뷰
export default function MyReviews() {
  const reviews = [
    { id: 1, status: 'pending', name: 'OOO 기사님', heart: true },
    { id: 2, status: 'pending', name: 'OOO 기사님', heart: false },
    { id: 3, status: 'completed', name: 'OOO 기사님', heart: false },
  ];

  const renderReviewCard = (item) => (
    <div key={item.id} className="review-status-card">
      <div className="review-avatar-circle"></div>
      <div className="review-text-content">
        <h4>{item.name} {item.heart ? <span className="heart-red">♥</span> : '♡'}</h4>
        <p className="sub-info">2025-10-25 16:00 ~ 17:00</p>
        <p className="sub-info">B매장</p>
        <p className="price-info">견적 금액 150,000원</p>
      </div>
      <button className={`review-action-btn ${item.status === 'completed' ? 'edit' : 'write'}`}>
        {item.status === 'completed' ? '수정하기' : '리뷰 쓰기'}
      </button>
    </div>
  );

  return (
    <div className="tab-container">
      <div className="section-group">
        <h4 className="section-label">리뷰 대기 중인 기사님</h4>
        {reviews.filter(r => r.status === 'pending').map(renderReviewCard)}
      </div>
      
      <div className="section-group" style={{ marginTop: '30px' }}>
        <h4 className="section-label">리뷰 등록 완료 기사님</h4>
        {reviews.filter(r => r.status === 'completed').map(renderReviewCard)}
      </div>
    </div>
  );
}