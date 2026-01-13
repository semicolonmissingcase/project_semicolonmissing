import React, { useEffect, useState } from 'react';
import './MyReviews.css';
import { getOwnerReviews, getCompletedReservations, deleteReview } from '../../../api/axiosPost.js';
import FavoriteButton from '../../commons/FavoriteBtn.jsx';
import ReviewModal from '../../commons/ReviewModal.jsx'; 
import ReviewShowModal from '../../commons/ReviewShowModal.jsx'; 

export default function MyReviews() {
  const [reviews, setReviews] = useState([]); // 작성한 리뷰
  const [reviewsToWrite, setReviewsToWrite] = useState([]); // 리뷰 작성해야하는 목록
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 모달 관련 상태
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false); 
  const [selectedItem, setSelectedItem] = useState(null);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false); 
  const [selectedReviewId, setSelectedReviewId] = useState(null); // reviewId만 전달

  // 데이터 로드 함수
  const fetchReviews = async () => {
    setLoading(true);
    try {
      // api 두 개 동시 출력
      const [completedReviewsData, reviewsToWriteData] = await Promise.all([
        getOwnerReviews(),
        getCompletedReservations()
      ]);

      setReviews(completedReviewsData || []);
      setReviewsToWrite(reviewsToWriteData?.data || []);

    } catch (err) {
      setError(err);

      setReviews([]);
      setReviewsToWrite([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // 리뷰 작성 모달 열기
  const openWriteModal = (item) => {
    setSelectedItem(item);
    setIsWriteModalOpen(true);
  };

  // 리뷰 보기 모달 열기 
  const openReviewShowModal = (item) => {
    setSelectedReviewId(item.reviewId || item.id); 
    setIsShowModalOpen(true);
  };

  // 리뷰 삭제 핸들러
  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("정말 이 리뷰를 삭제하시겠습니까?")) {
      try {
        await deleteReview(reviewId);

        fetchReviews();

        setReviews(prev => prev.filter(r => r.id !== reviewId));
        alert("리뷰가 삭제되었습니다.");
      } catch (err) {
        alert(`리뷰 삭제에 실패했습니다: ${err.message || err.msg || '알 수 없는 오류'}`);
      }
    }
  };

  // 리뷰 카드 컴포넌트
  const ReviewCard = (item) => (
    <div key={item.id} className="myreviews-status-card">
      <div className="myreviews-not-btn">
        <div className="myreviews-avatar-circle">
          <img
            src={item.cleanerProfile || "/icons/default-profile.png"}
            alt={`${item.name} 기사님`}
            className="myreviews-avatar-img"
          />
        </div>

        <div className="myreviews-text-content">
          <h4 className="myreviews-driver-name">
            {item.name} 
            <span className="myreviews-heart-icon">
              <FavoriteButton cleanerId={item.cleanerId} initialIsFavorited={item.heart} />
            </span>
          </h4>
          <p className="myreviews-sub-info">{item.time}</p>
          <p className="myreviews-sub-info">{item.store}</p>
          <p className="myreviews-price-info">견적 금액 {item.price}원</p>
        </div>
      </div>

      <div className="myreviews-button-group">
        {item.status === 'completed' ? (
          // 리뷰 작성 전: 리뷰쓰기 버튼만 표시
          <button 
            className="myreviews-action-btn myreviews-write"
            onClick={() => openWriteModal(item)}
          >
            리뷰쓰기
          </button>
        ) : (
          // 리뷰 작성 후: 리뷰보기, 삭제하기 버튼 표시
          <>
            <button 
              className="myreviews-action-btn myreviews-view"
              onClick={() => openReviewShowModal(item)}
            >
              리뷰보기
            </button>
            <button 
              className="myreviews-action-btn myreviews-delete bg-red"
              onClick={() => handleDeleteReview(item.id)}
            >
              삭제하기
            </button>
          </>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="myreviews-tab-container">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="myreviews-tab-container">
        <p>오류가 발생했습니다.</p>
      </div>
    );
  }

  return (
    <div className="myreviews-tab-container">
      <div className="myreviews-section-noreview-group">
        {reviewsToWrite.length > 0 && (
          <>
            {reviewsToWrite.map(ReviewCard)}
          </>
          )}
      </div>

      <div className="myreviews-section-group">
        <p className="myreviews-section-label">작성한 리뷰 목록</p>
          {reviews.length > 0 ? (
            reviews.map(ReviewCard)
          ) : (
            <p className="myreviews-no-items">작성한 리뷰 목록이 없습니다.</p>
          )}
      </div>

      {/* 리뷰 작성 모달 */}
      <ReviewModal 
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)} 
        targetData={selectedItem}
        onSuccess={fetchReviews} 
      />

      {/* 리뷰 보기 모달 */}
      <ReviewShowModal
        isOpen={isShowModalOpen}
        onClose={() => {
          setIsShowModalOpen(false);
          setSelectedReviewId(null);
        }}
        reviewId={selectedReviewId}
      />
    </div>
  );
}