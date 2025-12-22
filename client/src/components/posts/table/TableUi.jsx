import './TableUi.css';
import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';

function TableUi({ 
  data, 
  columns, 
  showSearch = true,
  showPagination = true,
  pageSize = 10 
}) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
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
                <td colSpan={columns.length} className="table-empty">
                  데이터가 없습니다.
                </td>
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
          <div className="pagination-info">
            총 {table.getFilteredRowModel().rows.length}개 중{' '}
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}
            개 표시
          </div>

          <div className="pagination-controls">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="pagination-btn"
            >
              {'<<'}
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="pagination-btn"
            >
              {'<'}
            </button>

            <span className="pagination-page-info">
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
            </span>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="pagination-btn"
            >
              {'>'}
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="pagination-btn"
            >
              {'>>'}
            </button>
          </div>

          <div className="pagination-page-size">
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className="page-size-select"
            >
              {[10, 20, 30, 50].map(size => (
                <option key={size} value={size}>
                  {size}개씩 보기
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableUi;