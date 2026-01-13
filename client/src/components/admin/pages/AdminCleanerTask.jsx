/**
 * @file src/components/admin/pages/AdminCleanerTask.jsx
 * @description AdminCleanerTask
 * 260113 v1.0.0 jae init
 */

import "./AdminCleanerTask.css";
import AdminTableUi from "../common/table/AdminTableUi.jsx";
import AdminStatistics from '../common/AdminStatistics.jsx';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAdminCleaners, setPage, setOffset } from "../../../store/slices/adminPaginationSlice.js";
import adminCleanerTasksThunk from "../../../store/thunks/adminCleanerTasksThunk.js";
import AdminError from "../common/AdminError.jsx";
import dayjs from "dayjs";

const title = '전체 기사 작업 내역 관리';
const now = dayjs().format('YYYY-MM');

const statisticsValueUnit = [
  { accessorKey: 'totalCnt', columnName: '이번 달 총 작업', valueUnit: '건' },
  { accessorKey: 'completedCnt', columnName: '이번 달 완료 건수', valueUnit: '건' },
  { accessorKey: 'pendingCnt', columnName: '미완료 작업 건수', valueUnit: '건' },
];

const columns = [
  { accessorKey: 'cleanerName', header: '기사명', size: 100 },
  {
    accessorKey: 'workDate',
    header: '작업 날짜',
    size: 120,
    cell: ({ getValue }) => dayjs(getValue()).format('YYYY-MM-DD'),
  },
  { accessorKey: 'location', header: '지역(매장주소)', size: 200 },
  {
    accessorKey: 'paymentAmount',
    header: '결제 금액',
    size: 120,
    cell: ({ getValue }) => `${getValue()?.toLocaleString()}원`,
  },
  {
    accessorKey: 'status',
    header: '상태',
    size: 100,
    cell: ({ getValue }) => {
      const status = getValue();
      const colorMap = { '완료': '#3f8600', '요청': '#1890ff', '승인': '#722ed1' };
      return <span style={{ color: colorMap[status] || '#000' }}>{status}</span>;
    },
  },
];

export default function AdminCleanerTask() {
  const dispatch = useDispatch();
  const { data, page, totalCount, offset, error, statistics } = useSelector(state => state.adminPagination);

  const fetchPagenation = () => {
    dispatch(adminCleanerTasksThunk.getTasks()); 
    dispatch(adminCleanerTasksThunk.getStatistics());
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
          showSearch={false} 
          showPagination={true}
          pageSize={offset} 
          setPageSize={(val) => { dispatch(setPage(1)); dispatch(setOffset(val)); }}
          page={page} 
          setPage={(val) => dispatch(setPage(val))} totalCount={totalCount}
        />
      )}
    </>
  );
}