/**
 * @file src/components/admin/common/table/AdminTableUi.jsx
 * @description AdminTableUi
 * 260109 v1.0.0 pbj init
 */
/*
Prop 파라미터 설명

// ----------------------------------------------

data : 출력할 데이터 배열
  **타입**: Array<{}>
  **예제** 
    [
      {
        "id": 1,
        "phoneNumber": "010-2222-2222",
        "name": "곽기사",
        "avgStar": "5.0000",
        "countCompleted": 1
      },
      ...
    ]

// ----------------------------------------------

columns: 출력할 데이터의 메타 정보를 가지고 있는 배열 (인덱스 순서대로 화면에 출력)
  **타입**: Array<{accessorKey: string, header: string, size: number, enableSorting: string, cell:function}>
    - accessorKey: `data`의 특정 속성명
      **타입**: {}
      예) `data`가 아래와 같다면, 'id', 'phoneNumber' 등을 셋팅
        {
          "id": 1,
          "phoneNumber": "010-2222-2222",
          "name": "곽기사",
        }
    - header: 화면에 출력 할 항목명 
      **타입**: string
      > 예) '이름', '전화번호'
    - size: 셀(항목)의 크기(px)
      **타입**: number
      > 예) 100, 200
    - enableSorting: 정렬기능 on/off
      **타입**: string
      > 예) true, false
    - cell: 출력할 값 커스텀 콜백 함수
      **타입**: function
      > 예) getValue => getValue()
  **예제**
    [
      {
        accessorKey: 'name',  // 접근 속성 명
        header: '이름',       // 출력 할 항목명 
        size: 100,            // 셀 크기(px)
        enableSorting: true,  // 정렬기능 on/off
        cell: ({ getValue }) => getValue(), // 출력할 값 커스텀 함수
      },
      ...
    ]

// ----------------------------------------------

showSearch : 검색바 출력 여부
  **타입**: boolean
  **예제**  true, false

// ----------------------------------------------

showPagination : 페이지네이션 출력 여부
  **타입**: boolean
  **예제**  true, false

// ----------------------------------------------

pageSize : 페이지 당 출력 레코드 수
  **타입**: number
  **예제**  10, 20 

// ----------------------------------------------

setPageSize : 페이지 당 출력 레코드 수 변경 콜백 함수
  **타입**: function
  **예제**  (val) => setOffset(val)

// ----------------------------------------------

page : 현재 페이지
  **타입**: number
  **예제**  1, 2, 3

// ----------------------------------------------

setPage : 현재 페이지 변경 콜백 함수
  **타입**: function
  **예제**  (val) => setPage(val)

// ----------------------------------------------

totalCount : 총 레코드 수
  **타입**: number
  **예제**  100, 123

// ----------------------------------------------

*/

import './AdminTableUi.css';
import { useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender, getSortedRowModel } from '@tanstack/react-table';

export default function AdminTableUi({ 
  data, 
  columns, 
  showSearch = true,
  showPagination = true,
  pageSize = 10,
  setPageSize,
  page,
  setPage,
  totalCount,
}) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination: {
        pageIndex: page - 1, // react-table의 인덱스는 0부터 시작하므로 -1
        pageSize: pageSize,
      },
    },
    manualPagination: true, // 서버 사이드 페이지네이션을 위한 수동 설정
    pageCount: Math.ceil(totalCount / pageSize), // 전체 페이지 수 계산
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="table-ui-wrapper">
      {/* 검색 바 */}
      {showSearch && (
        <div className="table-search-bar">
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="검색..."
            className="table-search-input"
          />
        </div>
      )}

      {/* 테이블 */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ 
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      width: header.column.columnDef.size 
                    }}
                  >
                    <div className="table-header-content">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {/* 정렬 아이콘 */}
                      {header.column.getCanSort() && (
                        <span className="sort-icon">
                          {{
                            asc: ' ▲',
                            desc: ' ▼',
                          }[header.column.getIsSorted()] ?? ' ⇅'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="table-empty">데이터가 없습니다.</td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {showPagination && (
        <div className="table-pagination">
          <div className="pagination-info">{`총 ${totalCount}개 중 ${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, totalCount)}개 표시`}</div>

          <div className="pagination-controls">
            <button
              onClick={() => setPage(1)}
              disabled={!table.getCanPreviousPage()}
              className="pagination-btn"
            >
              {'<<'}
            </button>
            <button
              onClick={() => setPage(page - 1)}
              disabled={!table.getCanPreviousPage()}
              className="pagination-btn"
            >
              {'<'}
            </button>

            <span className="pagination-page-info">{`${page} / ${table.getPageCount()}`}</span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={!table.getCanNextPage()}
              className="pagination-btn"
            >
              {'>'}
            </button>
            <button
              onClick={() => setPage(table.getPageCount())}
              disabled={!table.getCanNextPage()}
              className="pagination-btn"
            >
              {'>>'}
            </button>
          </div>

          <div className="pagination-page-size">
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => setPageSize(Number(e.target.value))}
              className="page-size-select"
            >
              {[10, 20, 30, 50].map(size => (
                <option key={size} value={size}>{size}개씩 보기</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}