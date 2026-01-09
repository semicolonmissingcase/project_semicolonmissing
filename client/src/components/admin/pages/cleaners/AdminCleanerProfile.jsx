/**
 * @file src/components/admin/pages/cleaners/AdminCleanerProfile.jsx
 * @description AdminCleanerProfile
 * 260109 v1.0.0 pbj init
 */

import "./AdminCleanerProfile.css";
import AdminTableUi from "../../common/table/AdminTableUi.jsx";
import AdminStatistics from '../../common/AdminStatistics.jsx';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAdminCleaners, setPage, setOffset } from "../../../../store/slices/adminPaginationSlice.js";
import adminPaginationThunk from "../../../../store/thunks/adminCleanersThunk.js";
import AdminError from "../../common/AdminError.jsx";
import dayjs from "dayjs";


// -----------------------
// 페이지 제목: 각 페이지에 따라 변경하여 사용
// 상세 정보는 `src/components/admin/common/AdminStatistics.jsx` 참조
// -----------------------
const title = '기사 프로필 관리';

// -----------------------
// 페이지 시간: 각 페이지에 따라 변경하여 사용
// 상세 정보는 `src/components/admin/common/AdminStatistics.jsx` 참조
// -----------------------
const now = dayjs().format('YYYY-MM-DD');

// -----------------------
// 통계 수치 정보 정의 : 각 페이지에 따라 변경하여 사용
// 상세 정보는 `src/components/admin/common/AdminStatistics.jsx` 참조
// -----------------------
const statisticsValueUnit = [
  {
    accessorKey: 'totalCnt',
    columnName: '총 기사님 수',
    valueUnit: '명',
  },
  {
    accessorKey: 'newCnt',
    columnName: '신입 기사님 수',
    valueUnit: '명',
  },
  {
    accessorKey: 'oldCnt',
    columnName: '기존 기사님 수',
    valueUnit: '명',
  },
  {
    accessorKey: 'withdrawCnt',
    columnName: '탈퇴 기사님 수',
    valueUnit: '명',
  },
];

// -----------------------
// 테이블 컬럼 정의: 각 페이지에 따라 변경하여 사용
// 상세 정보는 `src/components/admin/common/table/AdminTableUi.jsx` 참조
// -----------------------
const columns = [
  {
    accessorKey: 'name',  // 접근 속성 명
    header: '이름',       // 출력 할 항목명 
    size: 100,            // 셀 크기(px)
    enableSorting: true,  // 정렬기능 on/off
    cell: ({ getValue }) => getValue(), // 출력할 값 커스텀 함수
  },
  {
    accessorKey: 'phoneNumber',
    header: '전화번호',
    size: 120,
    enableSorting: true,
    cell: ({ getValue }) => getValue(),
  },
  {
    accessorKey: 'avgStar',
    header: '별점',
    enableSorting: true,
    cell: ({ getValue }) => {
      const avgStar = getValue() || 0;
      return avgStar.toString().slice(0, 3);
    },
  },
  {
    accessorKey: 'countCompleted',
    header: '작업건수',
    size: 120,
    enableSorting: true,
    cell: ({ getValue }) => {
      const countCompleted = getValue();
      return `${countCompleted} 건`;
    },
  },
];

export default function AdminCleanerProfile () {
  const dispatch = useDispatch();
  const { data, page, totalCount, offset, error, statistics } = useSelector(state => state.adminPagination);

  // Fnc: 출력 레코드 수 변경 후, 새로운 데이터 획득
  const changeOffset = async (val) => {
    await dispatch(setPage(1));
    await dispatch(setOffset(val));
    fetchPagenation();
  };

  // Fnc: 페이지 변경 후, 새로운 데이터 획득
  const changePage =  async (val) => {
    await dispatch(setPage(val));
    fetchPagenation();
  };

  // Fnc: 출력 데이터 획득
  const fetchPagenation = async () => {
    dispatch(adminPaginationThunk.adminCleanerProfileThunk());
    dispatch(adminPaginationThunk.adminCleanerProfileStatisticsThunk());
  }

  // -----------------------
  // 라이프 사이클
  // -----------------------
  useEffect(() => {
    fetchPagenation();

    return () => {
      dispatch(clearAdminCleaners());
    }
  }, []);

  // /////////////////////////////////////////////////////////////////////////////////
  // 이하 랜더링 처리
  // /////////////////////////////////////////////////////////////////////////////////
  // -----------------------
  // 예외 랜더링
  // -----------------------
  if(error) {
    return <AdminError />
  }

  // -----------------------
  // 정상 랜더링
  // -----------------------
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
            showSearch={false}
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
