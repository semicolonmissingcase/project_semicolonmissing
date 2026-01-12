import { useState } from "react";
import "./CleanersListItem.css";
import { RiArrowDropDownFill } from "react-icons/ri";
import { RiArrowDropUpFill } from "react-icons/ri";

export default function CleanersListItem({ job, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const ymd = (d) => (isValid(d) ? format(d, "yyyy-MM-dd") : "");

  const toggle = () => setIsOpen((prev) => !prev);

  const money = (n) => n.toLocaleString("ko-KR"); 

  return (
    <div className={`cleaners-list-item ${isOpen ? "open" : ""}`}>
      <button
        type="button"
        className="cleaners-list-item-head"
        onClick={toggle}
      >
        <div className="cleaners-list-item-title">{job.title}</div>
        <span className="cleaners-list-item-toggle">
          {isOpen ? <RiArrowDropUpFill size={20} style={{ verticalAlign: 'middle' }} className="cleaners-list-item-toggle-up" /> : <RiArrowDropDownFill size={20} style={{ verticalAlign: 'middle' }} className="cleaners-list-item-toggle-down" />}
        </span>
      </button>
      {!isOpen && (
        <div className="cleaners-list-item-body">
          <div className="cleaners-list-item-row">
            <span className="cleaners-list-item-label">견적 금액</span>
            <span className="cleaners-list-item-value">{money(job.amount)}원</span>
          </div>
          <div className="cleaners-list-item-row">
            <span className="cleaners-list-item-label">정산 상태</span>
            <span className="cleaners-list-item-value">
              {job.status}
              {job.canceled ? " (취소)" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}