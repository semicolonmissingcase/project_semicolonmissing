import { useState } from "react";
import "./AdminNav.css";

export default function AdminNav() {
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  return (
    <nav className="admin-nav">
      <div className="admin-nav-header">
        <p className="ice-doctor-logo1 admin-nav-logo"></p>
      </div>

      <ul className="admin-nav-menu">
        <li className="admin-nav-item">
          통합모니터링
        </li>

        <li className="admin-nav-item">
          예약 관리
        </li>

        <li className="admin-nav-item">
          가시설관리
        </li>

        <li className="admin-nav-item">
          청산 관리
        </li>

        <li 
          className="admin-nav-item admin-nav-item-dropdown"
          onClick={() => setIsReservationOpen(!isReservationOpen)}
        >
          문의 / 리뷰 관리
          <span className={`admin-nav-arrow ${isReservationOpen ? "open" : ""}`}>
            ▼
          </span>
        </li>

        {isReservationOpen && (
          <ul className="admin-nav-submenu">
            <li className="admin-nav-subitem">문의 관리</li>
            <li className="admin-nav-subitem">리뷰 관리</li>
          </ul>
        )}
      </ul>
    </nav>
  );
}