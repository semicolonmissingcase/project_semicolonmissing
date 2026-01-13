/**
 * @file src/components/admin/pages/AdminOwnerDetail.jsx
 * @description AdminOwnerDetail
 * 260113 v1.0.0 jae init
 */

import "./AdminOwnerDetail.css";
import AdminTableUi from "../common/table/AdminTableUi.jsx";
import AdminStatistics from "../common/AdminStatistics.jsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { clearAdminOwnerDetails, setPage, setOffset } from "../../../store/slices/adminPaginationSlice.js";
import adminOwnerDetailsThunk from "../../../store/thunks/adminOwnerDetailsThunk.js";
import AdminError from "../common/AdminError.jsx";
import dayjs from "dayjs";

// 1. 페이지 제목 및 날짜 정의
const title = '점주 상세 관리';
const now = dayjs().format('YYYY-MM-DD');

// 2. 상단 통계 수치 정의 (결제 총액, 매장 수, 예약 수)
const statisticsValueUnit = [
  {
    accessorKey: 'totalSpent',
    columnName: '누적 결제 금액',
    valueUnit: '원',
  },
  {
    accessorKey: 'activeStoreCnt',
    columnName: '운영 매장 수',
    valueUnit: '개',
  },
  {
    accessorKey: 'completedBookingCnt',
    columnName: '예약 완료 건수',
    valueUnit: '건',
  },
];

// 3. 하단 예약 이력 테이블 컬럼 정의
const columns = [
  {
    accessorKey: 'id',
    header: '예약번호',
    size: 80,
    enableSorting: true,
  },
  {
    accessorKey: 'storeName', // 예약된 매장명
    header: '매장명',
    size: 150,
    enableSorting: true,
  },
  {
    accessorKey: 'cleanerName', // 담당 기사님
    header: '담당 기사',
    size: 100,
    cell: ({ getValue }) => getValue() || '미지정',
  },
  {
    accessorKey: 'totalAmount',
    header: '결제금액',
    size: 120,
    cell: ({ getValue }) => `${Number(getValue() || 0).toLocaleString()} 원`,
  },
  {
    accessorKey: 'status',
    header: '상태',
    size: 100,
    cell: ({ getValue }) => getValue(),
  },
  {
    accessorKey: 'createdAt',
    header: '예약일',
    size: 120,
    cell: ({ getValue }) => dayjs(getValue()).format('YYYY-MM-DD'),
  },
];

export default function AdminOwnerDetail() {
  const { ownerId } = useParams(); // URL에서 점주 ID 가져오기
  const dispatch = useDispatch();
  
  // 리덕스 스토어에서 데이터 추출 (ownerInfo는 점주 정보/매장 목록용)
  const { data, page, totalCount, offset, error, statistics, ownerInfo } = useSelector(state => state.adminPagination);

  // Fnc: 출력 레코드 수 변경
  const changeOffset = async (val) => {
    await dispatch(setPage(1));
    await dispatch(setOffset(val));
    fetchReservationHistory();
  };

  // Fnc: 페이지 변경
  const changePage = async (val) => {
    await dispatch(setPage(val));
    fetchReservationHistory();
  };

  // Fnc: 전체 데이터 획득 (상세 정보 + 예약 이력)
  const fetchAllData = () => {
    dispatch(adminOwnerDetailsThunk.getAdminOwnerDetailThunk(ownerId));
    fetchReservationHistory();
  };

  // Fnc: 예약 이력만 획득 (페이징용)
  const fetchReservationHistory = () => {
    dispatch(adminOwnerDetailsThunk.getAdminOwnerReservationHistoryThunk(ownerId));
  };

  // -----------------------
  // 라이프 사이클
  // -----------------------
  useEffect(() => {
    if (ownerId) {
      fetchAllData();
    }

    // 언마운트 시 점주 상세 데이터 초기화
    return () => {
      dispatch(clearAdminOwnerDetails());
    };
  }, []);

  // -----------------------
  // 예외 랜더링
  // -----------------------
  if (error) {
    return <AdminError />;
  }

  return (
    <div className="admin-owner-detail-container">
      <AdminStatistics
        title={`${ownerInfo?.name || ''} ${title}`}
        now={now}
        statistics={statistics}
        statisticsValueUnit={statisticsValueUnit}
      />

      <div className="owner-basic-info" style={{ padding: '0 20px 20px' }}>
         <p><strong>이메일:</strong> {ownerInfo?.email} | <strong>연락처:</strong> {ownerInfo?.phone_number}</p>
         <p><strong>운영 매장:</strong> {ownerInfo?.stores?.map(s => s.name).join(', ')}</p>
      </div>

      <h3 style={{ padding: '0 20px' }}>최근 예약 이력</h3>

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
    </div>
  );
}