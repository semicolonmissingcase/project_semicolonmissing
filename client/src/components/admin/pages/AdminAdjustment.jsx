/**
 * @file src/components/admin/pages/AdminAdjustment.jsx
 * @description AdminJustment
 * 260112 v1.0.0 jae init
 */

import "./AdminAdjustment.css";
import AdminTableUi from "../common/table/AdminTableUi.jsx";
import AdminStatistics from "../common/AdminStatistics.jsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAdminAdjustments, setPage, setOffset } from "../../../store/slices/adminPaginationSlice.js";
import adminAdjustmentsThunk from "../../../store/thunks/adminAdjustmentsThunk.js";
import AdminError from "../common/AdminError.jsx";
import dayjs from "dayjs";

// 1. 페이지 설정 정보
const title = '정산 내역 관리';
const now = dayjs().format('YYYY-MM-DD');

// 2. 통계 카드 설정
const statisticsValueUnit = [
  {
    accessorKey: 'totalCnt',
    columnName: '전체 정산 건수',
    valueUnit: '건',
  },
  {
    accessorKey: 'pendingCnt',
    columnName: '정산 대기 건수',
    valueUnit: '건',
  },
  {
    accessorKey: 'completedCnt',
    columnName: '정산 완료 건수',
    valueUnit: '건',
  },
  {
    accessorKey: 'holdCnt',
    columnName: '보류 건수',
    valueUnit: '건',
  },
];

export default function AdminAdjustment() {
  const dispatch = useDispatch();
  const { data, page, totalCount, offset, error, statistics } = useSelector(state => state.adminPagination);

  // 3. 테이블 컬럼 정의
  const columns = [
    {
      accessorKey: 'scheduledAt',
      header: '예정일',
      size: 100,
      enableSorting: true,
    },
    {
      accessorKey: 'cleanerName',
      header: '기사명',
      size: 100,
    },
    {
      accessorKey: 'cleanerPhoneNumber',
      header: '전화번호',
      size: 130,
    },
    {
    accessorKey: 'settlementAmount',
    header: '정산 금액',
    size: 120,
    cell: ({ getValue }) => {
      const value = getValue();
      return (value || 0).toLocaleString() + '원';
      },
    },
    {
      accessorKey: 'status',
      header: '상태',
      size: 100,
      cell: ({ row }) => {
        const { id, status } = row.original;

        const handleSettlementAction = () => {
          if (window.confirm("해당 건의 정산을 완료 처리하시겠습니까?")) {
            dispatch(adminAdjustmentsThunk.adminUpdateAdjustmentStatusThunk({ id, status: '정산 완료' }));
          }
        };

        if (status === '정산 대기') {
          return (
            <button className="admin-status-badge pending-btn" onClick={handleSettlementAction}>
              정산하기
            </button>
          );
        }

        return (
          <div className={`admin-status-badge ${status === '정산 완료' ? 'completed' : 'hold'}`}>
            {status}
          </div>
        );
      },
    },
  ];

  // 4. 데이터 획득 함수들
  const changeOffset = async (val) => {
    await dispatch(setPage(1));
    await dispatch(setOffset(val));
    fetchPagination();
  };

  const changePage = async (val) => {
    await dispatch(setPage(val));
    fetchPagination();
  };

  const fetchPagination = () => {
    dispatch(adminAdjustmentsThunk.adminAdjustmentThunk());
    dispatch(adminAdjustmentsThunk.adminAdjustmentStatisticsThunk());
  };

  // 5. 라이프 사이클
  useEffect(() => {
    fetchPagination();

    return () => {
      dispatch(clearAdminAdjustments());
    };
  }, [page, offset]);

  // 예외 처리
  if (error) {
    return <AdminError />;
  }

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