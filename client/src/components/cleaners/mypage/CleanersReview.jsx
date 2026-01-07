import React, { useState, useEffect } from 'react';
import { getCleanerReviews } from '../../../api/axiosCleaner.js';
import { FaStar, FaRegStar, FaQuoteLeft } from 'react-icons/fa';
import { MdOutlineRateReview, MdEventNote, MdStorefront } from 'react-icons/md';
import './CleanersReview.css';

function CleanersReview() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await getCleanerReviews();
        setReviews(response.data?.data || response.data || []);
      } catch (error) {
        console.error("리뷰 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="cleaners-review-star-filled" />
        ) : (
          <FaRegStar key={i} className="cleaners-review-star-empty" />
        )
      );
    }
    return stars;
  };

  if (loading) return <div className="cleaners-review-status">리뷰를 불러오는 중입니다...</div>;
  if (reviews.length === 0) return <div className="cleaners-review-status">아직 등록된 리뷰가 없습니다.</div>;

  return (
    <div className="cleaners-review-container">
      {reviews.map((data) => (
        <div key={data.id} className="cleaners-review-card">
          
          {/* 상단 섹션: 매장명 및 별점 */}
          <div className="cleaners-review-header">
            <div className="cleaners-review-store-group">
              <MdStorefront className="cleaners-review-store-icon" />
              <span className="cleaners-review-store-name">
                {data.reservationData?.store?.name || "익명 매장"}
              </span>
            </div>
            
            <div className="cleaners-review-rating-group">
              <div className="cleaners-review-stars">
                {renderStars(data.star)}
              </div>
              <span className="cleaners-review-rating-num">
                {data.star}.0 / 5.0
              </span>
            </div>
          </div>

          {/* 본문 섹션: 리뷰 내용 */}
          <div className="cleaners-review-body">
            <div className="cleaners-review-quote-box">
              <FaQuoteLeft className="cleaners-review-quote-icon" />
            </div>
            <div className="cleaners-review-content">
              {data.content}
            </div>
          </div>

          {/* 하단 섹션: 예약일, 작성일 */}
          <div className="cleaners-review-footer">
            <div className="cleaners-review-info-group">
              <div className="cleaners-review-info-item">
                <MdEventNote className="cleaners-review-footer-icon" />
                <span className="cleaners-review-info-label">예약일</span>
                <span className="cleaners-review-info-value">{data.reservationData?.date || "-"}</span>
              </div>
              <div className="cleaners-review-info-divider">|</div>
              <div className="cleaners-review-info-item">
                <span className="cleaners-review-info-label">작성일</span>
                <span className="cleaners-review-info-value">
                  {data.createdAt?.split(' ')[0] || data.created_at?.split(' ')[0] || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CleanersReview;