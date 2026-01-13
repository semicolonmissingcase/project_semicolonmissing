/**
 * @file src/components/admin/pages/qna/AdminQna.jsx
 * @description 관리자 문의 관리 페이지 (커스텀 검색바 적용 최종본)
 * 260112 v1.0.2 seon update: 공용 테이블 검색바 대신 커스텀 검색바 사용
 */

import "./AdminQna.css";
import AdminTableUi from "../common/table/AdminTableUi.jsx";
import AdminStatistics from '../common/AdminStatistics.jsx';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAdminCleaners, setPage, setOffset } from "../../../store/slices/adminPaginationSlice.js";
import adminInquiryThunk from "../../../store/thunks/adminInquiryThunk.js";
import AdminError from "../common/AdminError.jsx";
import dayjs from "dayjs";

const title = '문의 관리';
const now = dayjs().format('YYYY-MM-DD');

const statisticsValueUnit = [
  { accessorKey: 'todayInquiry', columnName: '오늘 문의 수', valueUnit: '건' },
  { accessorKey: 'completedInquiry', columnName: '답변 완료', valueUnit: '건' },
  { accessorKey: 'pendingInquiry', columnName: '미답변 문의', valueUnit: '건' },
];

export default function AdminQna() {
  const dispatch = useDispatch();
  const { data, page, totalCount, offset, error, statistics } = useSelector(state => state.adminPagination);
  
  // 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * 테이블 컬럼 정의
   */
  const columns = [
    {
      accessorKey: 'status',
      header: '상태',
      size: 100,
      enableSorting: true,
      cell: ({ getValue }) => {
        const status = getValue();
        const color = status === '대기중' ? '#f31212' : '#2ecc71';
        return <b style={{ color }}>{status}</b>;
      },
    },
    {
      accessorKey: 'category',
      header: '카테고리',
      size: 120,
      enableSorting: true,
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: 'title',
      header: '문의 제목',
      size: 300,
      enableSorting: true,
      cell: ({ getValue }) => getValue(),
    },
    {
      id: 'author',
      header: '작성자',
      size: 150,
      cell: ({ row }) => {
        const { guestName, owner, cleaner } = row.original;
        return owner?.name || cleaner?.name || guestName || '익명';
      },
    },
    {
      accessorKey: 'createdAt',
      header: '등록일',
      size: 150,
      enableSorting: true,
      cell: ({ getValue }) => dayjs(getValue()).format('YYYY-MM-DD HH:mm'),
    },
    {
      id: 'manage',
      header: '관리',
      size: 100,
      cell: ({ row }) => {
        const handleOpenReply = () => {
          const width = 850;
          const height = 900;
          const left = window.screenX + (window.outerWidth - width) / 2;
          const top = window.screenY + (window.outerHeight - height) / 2;
          window.open(
            `/hospital/qna/${row.original.id}/reply`,
            `ReplyWindow_${row.original.id}`,
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
          );
        };
        return (
          <button className="admin-btn-table" onClick={handleOpenReply}>
            {row.original.status === '답변 완료' ? '상세보기' : '답변하기'}
          </button>
        );
      },
    },
  ];

  /**
   * 데이터 페칭 함수
   */
  const fetchPagination = (keyword = "") => {
    dispatch(adminInquiryThunk.getInquiryListThunk(keyword));
  };

  /**
   * 검색 실행 함수
   */
  const handleSearch = () => {
    dispatch(setPage(1)); // 검색 시 1페이지로 이동
    fetchPagination(searchTerm);
  };

  /**
   * 엔터키 이벤트 핸들러
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const changeOffset = async (val) => {
    await dispatch(setPage(1));
    await dispatch(setOffset(val));
    fetchPagination(searchTerm);
  };

  const changePage = async (val) => {
    await dispatch(setPage(val));
    fetchPagination(searchTerm);
  };

  useEffect(() => {
    fetchPagination();
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
      
      {/* 직접 만든 커스텀 검색바 구역 */}
      <div className="admin-qna-search-container" style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        padding: '0 20px', 
        marginBottom: '15px',
        gap: '8px' 
      }}>
        <input
          type="text"
          placeholder="이름 또는 제목으로 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            width: '250px',
            outline: 'none'
          }}
        />
        <button 
          onClick={handleSearch}
          style={{
            padding: '8px 16px',
            backgroundColor: '#34495e',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          검색
        </button>
      </div>

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