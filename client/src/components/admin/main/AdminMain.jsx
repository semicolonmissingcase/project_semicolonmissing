import { useMemo } from "react";
import AdminLayout from "../common/AdminLayout.jsx";
import TableUi from "../../posts/table/TableUi.jsx";
import "./AdminMain.css";
// 아이콘용
import { FiCheckCircle,  FiLoader } from "react-icons/fi";
import { GiCancel } from "react-icons/gi";

export default function AdminMain() {
  const reservationData = useMemo(() => [
    { date: "2025-12-15", name: "정연재", phone: "010-0000-0000", resDate: "2025-12-30", count: "2대" },
    { date: "2025-12-15", name: "차지영", phone: "010-0000-0000", resDate: "2025-12-28", count: "1대" },
    { date: "2025-12-15", name: "곽효선", phone: "010-0000-0000", resDate: "2025-12-20", count: "1대" },
    { date: "2025-12-15", name: "정윤희", phone: "010-0000-0000", resDate: "2025-12-20", count: "1대" },
    { date: "2025-12-15", name: "김예린", phone: "010-0000-0000", resDate: "2025-12-19", count: "1대" },
    { date: "2025-12-15", name: "이하안", phone: "010-0000-0000", resDate: "2025-12-21", count: "1대" },
  ], []);

  // 테이블 컬럼 정의
  const columns = useMemo(() => [
    {
      accessorKey: 'date',
      header: '신청일',
      size: 120,
    },
    {
      accessorKey: 'name',
      header: '예약자명',
      size: 100,
    },
    {
      accessorKey: 'phone',
      header: '전화번호',
      size: 150,
    },
    {
      accessorKey: 'resDate',
      header: '예약날짜',
      size: 120,
    },
    {
      accessorKey: 'count',
      header: '갯수',
      size: 80,
    },
  ], []);

  return (
    <div>
      <h1 className="admin-monitoring-title">통합모니터링</h1>

      <div className="admin-monitoring-top">
        <div className="admin-monitoring-summary">
          <div className="admin-summary-header">
            <div className="admin-summary-title">
              <h2>오늘 신규예약</h2>
              <p className="admin-summary-date">2025-12-15</p>
              <button type="button">더보기▶</button>
              <div>
                <span className="admin-count-number">12</span>
                <span className="admin-count-unit">건</span>
              </div>
            </div>
          <div className="admin-summary-stats">
            <div className="admin-stat-item">
              <FiCheckCircle style={{ fontSize: '60px', color: '#0C1B41' }} />
              <div className="admin-stat-label">매칭완료</div>
              <div className="admin-stat-value">7건</div>
            </div>
            <div className="admin-stat-item">
              <FiLoader style={{ fontSize: '60px', color: '#7C7F88'}} />
              <div className="admin-stat-label">미완료</div>
              <div className="admin-stat-value">3건</div>
            </div>
            <div className="admin-stat-item">
              <GiCancel style={{ fontSize: '60px', color: '#C01E20'}} />
              <div className="admin-stat-label">취소</div>
              <div className="admin-stat-value">2건</div>
            </div>
          </div>
            
          </div>
          
        </div>

        <div className="admin-monitoring-revenue">
          <div className="admin-revenue-header">
            <button type="button">더보기▶</button>
          </div>
          <div className="admin-revenue-content">
            <h3>금일 결제액</h3>
            <p className="admin-revenue-amount">560,000원</p>
            <p className="admin-revenue-sub">결제건수 12건 90,000원</p>
          </div>
          <button className="admin-revenue-btn">정산 관리</button>
        </div>
      </div>

      <div className="admin-monitoring-bottom">
        <div className="admin-monitoring-table">
          <div className="admin-table-header">
            <h3>실시간 예약현황</h3>
            <button type="button">더보기▶</button>
          </div>  

          <TableUi 
            data={reservationData}
            columns={columns}
            showSearch={false}
            showPagination={false}
            pageSize={6}
          />
        </div>

        <div className="admin-monitoring-chart">
          <div className="admin-chart-header">
            <h3>건</h3>
          </div>
          <div className="admin-chart-content">
            {/* 차트 라이브러리 */}
          </div>
        </div>
      </div>
    </div>
  );
}