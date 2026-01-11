import { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableUi from "../../posts/table/TableUi.jsx";
import "./AdminMain.css";
import { FiCheckCircle, FiLoader } from "react-icons/fi";
import { GiCancel } from "react-icons/gi";

// 1. Chart.js 관련 핵심 컴포넌트 임포트 (이름을 ChartJS로 지정)
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import adminDashboardThunk from "../../../store/thunks/adminDashboardThunk.js";

// 2. Chart.js 필수 구성 요소 등록 (ReferenceError 방지)
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function AdminMain() {
  const dispatch = useDispatch();
  
  // Redux Store에서 데이터 가져오기
  const { data: reservationData, statistics, chartData } = useSelector((state) => state.adminPagination);

  useEffect(() => {
    dispatch(adminDashboardThunk.getDashboardData());
  }, [dispatch]);

  // 테이블 컬럼 정의
  const columns = useMemo(() => [
    { accessorKey: 'createdAt', header: '신청일', size: 120 },
    { accessorKey: 'customerName', header: '예약자명', size: 100 },
    { accessorKey: 'phoneNumber', header: '전화번호', size: 150 },
    { accessorKey: 'reservationDate', header: '예약날짜', size: 120 },
    { accessorKey: 'quantity', header: '갯수', size: 80 },
  ], []);

  // Chart.js 설정 및 데이터 매핑
  const chartConfigs = useMemo(() => {
    const labels = (chartData || []).map(item => item.name);
    const counts = (chartData || []).map(item => item.건수);

    return {
      data: {
        labels,
        datasets: [
          {
            fill: true,
            label: '예약 건수',
            data: counts,
            borderColor: '#0C1B41',
            backgroundColor: 'rgba(12, 27, 65, 0.1)',
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: '#0C1B41',
            pointBorderColor: '#fff',
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
            grid: { color: '#f0f0f0' }
          },
          x: {
            grid: { display: false }
          }
        },
      },
    };
  }, [chartData]);

  return (
    <div className="admin-main-container">
      <h1 className="admin-monitoring-title">통합모니터링</h1>

      {/* --- 상단: 통계 및 매출 요약 영역 --- */}
      <div className="admin-monitoring-top">
        <div className="admin-monitoring-summary">
          <div className="admin-summary-header">
            <div className="admin-summary-title">
              <h2>오늘 신규예약</h2>
              <p className="admin-summary-date">{new Date().toISOString().slice(0, 10)}</p>
              <button type="button">조회하기</button>
              <div>
                <span className="admin-count-number">{statistics?.totalNew || 0}</span>
                <span className="admin-count-unit">건</span>
              </div>
            </div>
            
            <div className="admin-summary-stats">
              <div className="admin-stat-item">
                <FiCheckCircle style={{ fontSize: '2.5rem', color: '#0C1B41' }} />
                <div className="admin-stat-label">매칭완료</div>
                <div className="admin-stat-value">{statistics?.matchingDone || 0}건</div>
              </div>
              <div className="admin-stat-item">
                <FiLoader style={{ fontSize: '2.5rem', color: '#7C7F88' }} />
                <div className="admin-stat-label">미완료</div>
                <div className="admin-stat-value">{statistics?.matchingYet || 0}건</div>
              </div>
              <div className="admin-stat-item">
                <GiCancel style={{ fontSize: '2.5rem', color: '#C01E20' }} />
                <div className="admin-stat-label">취소</div>
                <div className="admin-stat-value">{statistics?.cancelCnt || 0}건</div>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-monitoring-revenue">
          <div className="admin-revenue-header">
            <button type="button">정산 상세</button>
          </div>
          <div className="admin-revenue-content">
            <h3>금일 결제액</h3>
            <p className="admin-revenue-amount">{statistics?.totalAmount?.toLocaleString() || 0}원</p>
            <p className="admin-revenue-sub">결제건수 {statistics?.payCount || 0}건</p>
          </div>
          <button className="admin-revenue-btn">정산 관리</button>
        </div>
      </div>

      {/* --- 하단: 실시간 현황 및 월별 차트 --- */}
      <div className="admin-monitoring-bottom">
        <div className="admin-monitoring-table">
          <div className="admin-table-header">
            <h3>실시간 예약현황</h3>
          </div>
          <TableUi
            data={reservationData || []}
            columns={columns}
            showSearch={false}
            showPagination={false}
            pageSize={6}
          />
        </div>

        <div className="admin-monitoring-chart">
          <div className="admin-chart-header">
            <h3>월별 예약 추이</h3>
          </div>
          <div className="admin-chart-content" style={{ position: 'relative', height: '300px', width: '100%' }}>
            <Line data={chartConfigs.data} options={chartConfigs.options} />
          </div>
        </div>
      </div>
    </div>
  );
}