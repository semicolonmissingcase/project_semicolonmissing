import React, { useState, useEffect, useRef } from 'react';
import './ReviewModal.css';
import { createReview } from '../../api/axiosPost.js';

export default function ReviewModal({ isOpen, onClose, targetData, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]); 
  const [previews, setPreviews] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setRating(5);
      setContent('');
      setImages([]);
      setPreviews([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (images.length + selectedFiles.length > 2) {
      alert("이미지는 최대 2장까지만 첨부 가능합니다.");
      return;
    }
    const newImages = [...images, ...selectedFiles];
    setImages(newImages);

    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  // 이미지 삭제 핸들러 추가
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newPreviews);
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

      images.forEach((file, index) => {
        formData.append(`reviewPicture${index + 1}`, file);
      });

      const response = await createReview(formData);
      
      if (response) {
        alert("리뷰가 등록되었습니다.");
        
        // 부모의 fetchReviews 함수 실행
        if (onSuccess) await onSuccess(); 
        
        onClose();
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