import { useState } from "react";
import "./AdminNav.css";
import { useNavigate } from "react-router-dom";

export default function AdminNav() {
  const navigate = useNavigate();
  const [isDriverOpen, setIsDriverOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  function mainPage() {
    navigate('/hospital');
  }

  return (
    <nav className="admin-nav">
      <div className="admin-nav-header">
        <p className="ice-doctor-logo1 admin-nav-logo" onClick={mainPage}></p>
      </div>

      <ul className="admin-nav-menu">
        <li className="admin-nav-item">
          통합모니터링
        </li>

        <li className="admin-nav-item">
          예약 관리
        </li>

        <li 
          className="admin-nav-item admin-nav-item-dropdown"
          onClick={() => setIsDriverOpen(!isDriverOpen)}>
          기사님 관리
          <span className={`admin-nav-arrow ${isDriverOpen ? "open" : ""}`}>
            ▼
          </span>
        </li>

        {isDriverOpen && (
          <ul className="admin-nav-submenu">
            <li className="admin-nav-subitem">프로필</li>
            <li className="admin-nav-subitem">작업 내역</li>
          </ul>
        )}

        <li className="admin-nav-item">
          정산 관리
        </li>

        <li 
          className="admin-nav-item admin-nav-item-dropdown"
          onClick={() => setIsInquiryOpen(!isInquiryOpen)}>
          문의 / 리뷰 관리
          <span className={`admin-nav-arrow ${isInquiryOpen ? "open" : ""}`}>
            ▼
          </span>
        </li>

        {isInquiryOpen && (
          <ul className="admin-nav-submenu">
            <li className="admin-nav-subitem">문의 관리</li>
            <li className="admin-nav-subitem">리뷰 관리</li>
          </ul>
        )}
      </ul>
    </nav>
  );
}