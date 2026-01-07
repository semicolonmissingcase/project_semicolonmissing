import React, { useState, useEffect, useRef } from 'react';
import './ReviewModal.css';
import { createReview } from '../../api/axiosPost.js';

export default function ReviewModal({ isOpen, onClose, targetData, fetchReviews }) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]); // 이미지 파일들을 담을 배열 (최대 2개)
  const [previews, setPreviews] = useState([]); // 미리보기 URL 배열
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef(null); // 숨겨진 input 태그 참조

  useEffect(() => {
    if (isOpen) {
      setRating(5);
      setContent('');
      setImages([]);
      setPreviews([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 파일 선택 시 핸들러
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // 최대 2개까지만 허용
    if (images.length + selectedFiles.length > 2) {
      alert("이미지는 최대 2장까지만 첨부 가능합니다.");
      return;
    }

    const newImages = [...images, ...selectedFiles];
    setImages(newImages);

    // 미리보기 URL 생성
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  // 이미지 삭제 핸들러
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('cleanerId', targetData?.cleanerId);
      formData.append('reservationId', targetData?.reservationId);
      formData.append('star', rating);
      formData.append('content', content);

      // 이미지 파일 추가 (key값은 서버 API 명세에 맞춰 조정 필요)
      images.forEach((file, index) => {
        formData.append(`reviewPicture${index + 1}`, file);
      });

      const response = await createReview(formData);
      
      if (response) {
        onClose();
        if (fetchReviews) fetchReviews();
      }
    } catch (error) {
      console.error(error);
      alert("등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reviewmodal-overlay" onClick={onClose}>
      <div className="reviewmodal-content" onClick={(e) => e.stopPropagation()}>
        <button className="reviewmodal-close-x" onClick={onClose}>X</button>

        <h2 className="reviewmodal-title">{targetData?.name || '기사님'} 리뷰 작성</h2>

        <div className="reviewmodal-rating-container">
          {[...Array(5)].map((_, i) => (
            <span 
              key={i} 
              className={`reviewmodal-star ${i < rating ? 'active' : ''}`}
              onClick={() => setRating(i + 1)}
            >★</span>
          ))}
        </div>

        <div className="reviewmodal-info-text">
          <p>{targetData?.store}</p>
          <p>{targetData?.time}</p>
          <p className="reviewmodal-price">견적 금액 {targetData?.price?.toLocaleString()}원</p>
        </div>

        {/* 파일 첨부*/}
        <input 
          type="file" 
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button 
          className="reviewmodal-file-btn" 
          onClick={() => fileInputRef.current.click()}
          disabled={images.length >= 2}
        >
          첨부파일 ({images.length}/2)
        </button>

        {/* 이미지 미리보기 영역 */}
        <div className="reviewmodal-preview-container">
          {previews.map((url, index) => (
            <div key={index} className="reviewmodal-preview-item">
              <img src={url} alt="preview" />
              <button className="remove-img-btn" onClick={() => removeImage(index)}>×</button>
            </div>
          ))}
        </div>

        <textarea 
          className="reviewmodal-textarea"
          placeholder="리뷰 내용을 입력해주세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button 
          className="reviewmodal-submit-btn" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? '등록 중...' : '등록하기'}
        </button>
      </div>
    </div>
  );
}