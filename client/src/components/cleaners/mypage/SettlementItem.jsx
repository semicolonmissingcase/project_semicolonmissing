import React, { useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import "./SettlementItem.css";

const SettlementItem = ({ job }) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!job) return null;

  const getStatusClass = (status) => {
    if (status === "정산 완료") return "is-completed";
    if (status === "지급 대기" || status === "정산 대기") return "is-pending";
    return "is-default";
  };

  return (
    <div className={`cleaners-settlement-item-container ${job.canceled ? "is-canceled" : ""}`}>
      {/* 상단 헤더: 상호명과 화살표만 표시 */}
      <div className="cleaners-settlement-item-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="cleaners-settlement-item-header-left">
          <span className="cleaners-settlement-item-store-name">
            {job.storeName || "상호명 미지정"}
          </span>
          <div className="cleaners-settlement-item-icon">
            {isOpen ? <IoChevronUp size={18} /> : <IoChevronDown size={18} />}
          </div>
        </div>
      </div>

      {/* 하단 상세 박스: 아코디언 열릴 때만 시간, 금액, 상태 표시 */}
      {isOpen && (
        <div className="cleaners-settlement-item-detail-box">
          <div className="cleaners-settlement-item-detail-row">
            <span className="cleaners-settlement-item-label">작업 시간</span>
            <span className="cleaners-settlement-item-value">
              {job.created_at ? job.created_at.substring(11, 16) : "00:00"}
            </span>
          </div>
          <div className="cleaners-settlement-item-detail-row">
            <span className="cleaners-settlement-item-label">견적 금액</span>
            <span className="cleaners-settlement-item-amount-detail">
              {Number(job.amount || 0).toLocaleString()}원
            </span>
          </div>
          <div className="cleaners-settlement-item-detail-row">
            <span className="cleaners-settlement-item-label">정산 상태</span>
            <span className={`cleaners-settlement-item-status-badge ${getStatusClass(job.settlementStatus)}`}>
              {job.settlementStatus || "상태 미정"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettlementItem;