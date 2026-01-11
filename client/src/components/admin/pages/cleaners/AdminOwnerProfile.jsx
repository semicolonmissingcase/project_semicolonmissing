/**
 * @file src/components/admin/pages/owners/AdminOwnerProfile.jsx
 * @description AdminOwnerProfile
 * 260111 v1.0.0 jae init
 */

import "./AdminOwnerProfile.css";
import AdminTableUi from "../../common/table/AdminTableUi.jsx";
import AdminStatistics from '../../common/AdminStatistics.jsx';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAdminOwners, setPage, setOffset } from "../../../../store/slices/adminPaginationSlice.js";
import adminOwnersThunk from "../../../../store/thunks/adminOwnersThunk.js";
import AdminError from "../../common/AdminError.jsx";
import dayjs from "dayjs";

// 1. 페이지 제목 설정
const title = '점주(파트너) 관리';

const now = dayjs().format('YYYY-MM-DD');

// 2. 점주용 통계 수치 정의
const statisticsValueUnit = [
  {
    accessorKey: 'totalCnt',
    columnName: '총 점주 수',
    valueUnit: '명',
  },
  {
    accessorKey: 'newCnt',
    columnName: '신규 점주(오늘)',
    valueUnit: '명',
  },
  {
    accessorKey: 'oldCnt',
    columnName: '기존 점주',
    valueUnit: '명',
  },
  {
    accessorKey: 'withdrawCnt',
    columnName: '탈퇴 점주',
    valueUnit: '명',
  },
];

// 3. 점주용 테이블 컬럼 정의
const columns = [
  {
    accessorKey: 'name',
    header: '점주명',
    size: 100,
    enableSorting: true,
    cell: ({ getValue }) => <strong>{getValue()}</strong>,
  },
  {
    accessorKey: 'phoneNumber',
    header: '휴대번호',
    size: 140,
    enableSorting: true,
    cell: ({ getValue }) => getValue(),
  },
  {
    accessorKey: 'provider',
    header: '가입 경로',
    size: 120,
    cell: ({ getValue }) => {
      const provider = getValue();
      return provider === 'NONE' ? '일반 가입' : provider;
    },
  },
  {
    accessorKey: 'storeCount',
    header: '매장 개수',
    size: 100,
    enableSorting: true,
    cell: ({ getValue }) => {
      const count = getValue() || 0;
      return `${count} 개`;
    },
  },
];

export default function AdminOwnerProfile() {
  const dispatch = useDispatch();
  // 공통 pagination slice 상태 구독
  const { data, page, totalCount, offset, error, statistics } = useSelector(state => state.adminPagination);

  // 출력 갯수 변경 핸들러
  const changeOffset = async (val) => {
    await dispatch(setPage(1));
    await dispatch(setOffset(val));
    fetchPagination();
  };

  // 페이지 변경 핸들러
  const changePage = async (val) => {
    await dispatch(setPage(val));
    fetchPagination();
  };

  // 데이터 로드 (점주용 thunk 호출)
  const fetchPagination = async () => {
    dispatch(adminOwnersThunk.adminOwnerProfileThunk());
    dispatch(adminOwnersThunk.adminOwnerProfileStatisticsThunk());
  }

  useEffect(() => {
    fetchPagination();

    return () => {
      // 컴포넌트 이탈 시 점주 데이터 초기화
      dispatch(clearAdminOwners());
    }
  }, []);

  if (error) {
    return <AdminError />
  }

  return (
    <>
      <AdminStatistics
        title={title}
        now={now}
        statistics={statistics}
        statisticsValueUnit={statisticsValueUnit}
      />
      {
        data && (
          <AdminTableUi 
            data={data} 
            columns={columns}
            showSearch={false} // 점주 검색을 위해 활성화 추천
            showPagination={true}
            pageSize={offset}
            setPageSize={changeOffset}
            page={page}
            setPage={changePage}
            totalCount={totalCount}
          />
        )
      }
    </>
  )
};