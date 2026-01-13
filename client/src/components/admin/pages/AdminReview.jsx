/**
 * @file src/components/admin/pages/AdminReview.jsx
 * @description AdminReview
 * 260113 v1.0.0 jae init
 */

import './AdminReview.css'
import AdminTableUi from "../common/table/AdminTableUi.jsx";
import AdminStatistics from '../common/AdminStatistics.jsx';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAdminCleaners, setPage, setOffset } from "../../../store/slices/adminPaginationSlice.js";
import adminReviewsThunk from '../../../store/thunks/adminReviewsThunk .js';
import AdminError from "../common/AdminError.jsx";
import dayjs from "dayjs";

const title = '리뷰 관리';
const now = dayjs().format('YYYY-MM-DD'); // 리뷰는 오늘 날짜 기준

const statisticsValueUnit = [
  { accessorKey: 'todayWorkCnt', columnName: '오늘 작업 수', valueUnit: '건' },
  { accessorKey: 'newReviewCnt', columnName: '새 리뷰', valueUnit: '개' },
  { accessorKey: 'deletedReviewCnt', columnName: '삭제 리뷰', valueUnit: '개' },
];

const columns = [
  { accessorKey: 'ownerName', header: '작성자', size: 100 },
  {
    accessorKey: 'createdAt',
    header: '작성날짜',
    size: 150,
    cell: ({ getValue }) => dayjs(getValue()).format('YYYY-MM-DD HH:mm'),
  },
  {
    accessorKey: 'star',
    header: '별점',
    size: 100,
    cell: ({ getValue }) => '⭐'.repeat(getValue()),
  },
  { accessorKey: 'cleanerName', header: '대상 기사님', size: 120 },
];

export default function AdminReview() {
  const dispatch = useDispatch();
  const { data, page, totalCount, offset, error, statistics } = useSelector(state => state.adminPagination);

  const fetchPagenation = () => {
    dispatch(adminReviewsThunk.getReviews());
    dispatch(adminReviewsThunk.getStatistics());
  };

  useEffect(() => {
    fetchPagenation();
    return () => dispatch(clearAdminCleaners());
  }, []);

  if (error) return <AdminError />;

  return (
    <>
      <AdminStatistics title={title} now={now} statistics={statistics} statisticsValueUnit={statisticsValueUnit} />
      {data && (
        <AdminTableUi 
          data={data} 
          columns={columns} 
          showSearch={true} 
          showPagination={true}
          pageSize={offset} 
          setPageSize={(val) => { dispatch(setPage(1)); dispatch(setOffset(val)); }}
          page={page} 
          setPage={(val) => dispatch(setPage(val))} 
          totalCount={totalCount}
        />
      )}
    </>
  );
}