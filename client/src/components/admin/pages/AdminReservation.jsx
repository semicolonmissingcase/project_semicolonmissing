/**
 * @file src/components/admin/pages/AdminReservation.jsx
 * @description Reservation
 * 260113 v1.0.0 jae init
 */

import "./AdminReservation.css";
import AdminTableUi from "../common/table/AdminTableUi.jsx";
import AdminStatistics from '../common/AdminStatistics.jsx';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAdminCleaners, setPage, setOffset } from "../../../store/slices/adminPaginationSlice.js";
import adminReservationsThunk from "../../../store/thunks/adminReservationsThunk.js";
import AdminError from "../common/AdminError.jsx";
import dayjs from "dayjs";

// 1. 페이지 제목 및 날짜 설정
const title = '월간 예약 현황 관리';
const now = dayjs().format('YYYY-MM'); // 한 달 기준이므로 월까지만 표시

// 2. 통계 수치 정의 (한 달 총 예약, 취소, 완료, 신규 등)
const statisticsValueUnit = [
  {
    accessorKey: 'totalCnt',
    columnName: '한 달 총 예약',
    valueUnit: '건',
  },
  {
    accessorKey: 'cancelCnt',
    columnName: '한 달 취소 건수',
    valueUnit: '건',
  },
  {
    accessorKey: 'completedCnt',
    columnName: '한 달 완료 건수',
    valueUnit: '건',
  },
  {
    accessorKey: 'requestCnt',
    columnName: '신규 매칭 요청',
    valueUnit: '건',
  },
];

// 3. 테이블 컬럼 정의 (고객명, 상태, 매장명, 예약시간, 기사명)
const columns = [
  {
    accessorKey: 'ownerName', // 서브쿼리로 가져온 점주(고객) 이름
    header: '고객명',
    size: 100,
    enableSorting: true,
  },
  {
    accessorKey: 'storeName', // 서브쿼리로 가져온 매장 이름
    header: '매장명',
    size: 150,
    enableSorting: true,
  },
  {
    accessorKey: 'date',
    header: '예약 날짜',
    size: 120,
    enableSorting: true,
    cell: ({ getValue }) => dayjs(getValue()).format('YYYY-MM-DD'),
  },
  {
    accessorKey: 'time',
    header: '방문 시간',
    size: 100,
    enableSorting: true,
    cell: ({ getValue }) => getValue().slice(0, 5), // 'HH:mm' 형식
  },
  {
    accessorKey: 'cleanerName',
    header: '매칭 기사',
    size: 100,
    enableSorting: true,
    cell: ({ getValue }) => getValue() || <span style={{ color: 'red', fontWeight: 'bold' }}>미배정</span>,
  },
  {
    accessorKey: 'status',
    header: '상태',
    size: 100,
    enableSorting: true,
    cell: ({ getValue }) => {
      const status = getValue();
      const colorMap = { '취소': '#cf1322', '완료': '#3f8600', '요청': '#1890ff' };
      return <span style={{ color: colorMap[status] || '#000' }}>{status}</span>;
    },
  },
];

export default function AdminReservation() {
  const dispatch = useDispatch();
  // adminPagination 슬라이스에 예약 관련 상태(statistics 등)가 저장된다고 가정
  const { data, page, totalCount, offset, error, statistics } = useSelector(state => state.adminPagination);

  const changeOffset = async (val) => {
    await dispatch(setPage(1));
    await dispatch(setOffset(val));
    fetchPagenation();
  };

  const changePage = async (val) => {
    await dispatch(setPage(val));
    fetchPagenation();
  };

  const fetchPagenation = async () => {
    dispatch(adminReservationsThunk.adminReservationThunk()); 
    dispatch(adminReservationsThunk.adminReservationStatisticsThunk());
  };

  useEffect(() => {
    fetchPagenation();
    return () => {
      dispatch(clearAdminCleaners());
    };
  }, []);

  if (error) return <AdminError />;

  return (
    <>
      <AdminStatistics
        title={title}
        now={now}
        statistics={statistics}
        statisticsValueUnit={statisticsValueUnit}
      />
      {data && (
        <AdminTableUi 
          data={data} 
          columns={columns}
          showSearch={false}
          showPagination={true}
          pageSize={offset}
          setPageSize={changeOffset}
          page={page}
          setPage={changePage}
          totalCount={totalCount}
        />
      )}
    </>
  );
}