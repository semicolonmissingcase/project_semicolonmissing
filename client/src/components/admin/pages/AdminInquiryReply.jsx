/**
 * @file src/components/admin/pages/qna/AdminInquiryReply.jsx
 * @description 문의 답변 작성 전용 팝업 페이지
 */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axiosInstance from "../../../api/axiosInstance.js";
import adminInquiryThunk from "../../../store/thunks/adminInquiryThunk.js";
import dayjs from "dayjs";
import "./AdminInquiryReply.css";

export default function AdminInquiryReply() {
  const { inquiryId } = useParams();
  const dispatch = useDispatch();
  
  const [inquiry, setInquiry] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);

  // 상세 데이터 조회 (답변 포함)
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axiosInstance.get(`/api/admin/inquiries/${inquiryId}`);
        const data = response.data.data;
        setInquiry(data);
        
        if (data.answer) {
          setReplyContent(data.answer.content);
        }
      } catch (error) {
        alert("데이터를 불러오는데 실패했습니다.");
        window.close();
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [inquiryId]);

  // 답변 등록 핸들러
  const handleSubmit = async () => {
    if (!replyContent.trim()) return alert("답변 내용을 입력해주세요.");
    if (!window.confirm("답변을 등록하시겠습니까?")) return;

    try {
      const result = await dispatch(adminInquiryThunk.postInquiryReplyThunk({ 
        inquiryId, 
        content: replyContent 
      })).unwrap();

      if (result) {
        alert("답변이 성공적으로 등록되었습니다.");
        if (window.opener) window.opener.location.reload();
        window.close();
      }
    } catch (error) {
      alert(error.message || "등록 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div className="AdminInquiryReply-loading">로딩 중...</div>;
  if (!inquiry) return null;

  // 답변 완료 상태 체크
  const isCompleted = inquiry.status === '답변 완료' || inquiry.status === '답변완료';

  return (
    <div className="AdminInquiryReply-container">
      <header className="AdminInquiryReply-header">
        <h2>{isCompleted ? "문의 답변 확인" : "문의 답변 작성"}</h2>
        <button className="AdminInquiryReply-close-btn" onClick={() => window.close()}>×</button>
      </header>

      <main className="AdminInquiryReply-main">
        <section className="AdminInquiryReply-section AdminInquiryReply-view">
          <div className="AdminInquiryReply-row">
            <span className="AdminInquiryReply-label">제목</span>
            <span className="AdminInquiryReply-value">{inquiry.title}</span>
          </div>
          <div className="AdminInquiryReply-row">
            <span className="AdminInquiryReply-label">작성자</span>
            <span className="AdminInquiryReply-value">
              {inquiry.owner ? `${inquiry.owner.name} (점주)` : 
               inquiry.cleaner ? `${inquiry.cleaner.name} (기사)` : '익명'}
            </span>
          </div>
          <div className="AdminInquiryReply-content-box">
            <p className="AdminInquiryReply-label">문의 내용</p>
            <div className="AdminInquiryReply-text-display">{inquiry.content}</div>
          </div>
        </section>

        <hr className="AdminInquiryReply-divider" />

        <section className="AdminInquiryReply-section AdminInquiryReply-form">
          <p className="AdminInquiryReply-label">{isCompleted ? "등록된 답변" : "답변 작성"}</p>
          <textarea
            className={`AdminInquiryReply-textarea ${isCompleted ? 'readonly' : ''}`}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder={isCompleted ? "" : "답변 내용을 입력해주세요."}
            readOnly={isCompleted}
          />
        </section>
      </main>

      <footer className="AdminInquiryReply-footer">
        {!isCompleted ? (
          <button className="AdminInquiryReply-btn AdminInquiryReply-btn-primary" onClick={handleSubmit}>답변 등록</button>
        ) : (
          <button className="AdminInquiryReply-btn AdminInquiryReply-btn-secondary" onClick={() => window.close()}>닫기</button>
        )}
      </footer>
    </div>
  );
}