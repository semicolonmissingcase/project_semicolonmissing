/**
 * @file src/components/admin/common/AdminStatistics.jsx
 * @description AdminStatistics
 * 260109 v1.0.0 pbj init
 */
/*
Prop 파라미터 설명

// ----------------------------------------------

title : 페이지 제목
  **타입**: string
  **예제**  '기사 프로필 관리'

// ----------------------------------------------

now : 현재 시간 문자열
  **타입**: string
  **예제**  2026-01-09 00:00:00

// ----------------------------------------------

statistics : 출력할 데이터 객체
  **타입**: {}
  **예제** 
    {
      "totalCnt": 10,
      "newCnt": 0,
      "oldCnt": 10,
      "withdrawCnt": 0
    }

// ----------------------------------------------

statisticsValueUnit: 출력할 데이터의 메타 정보를 가지고 있는 배열 (인덱스 순서대로 화면에 출력)
  **타입**: Array<{accessorKey: string, columnName: string, valueUnit: string}>
    - accessorKey: `statistics`의 특정 속성명
      예) `statistics`가 아래와 같다면, 'totalCnt', 'newCnt' 등을 셋팅
        {
          "totalCnt": 10,
          "newCnt": 0,
          "oldCnt": 10,
          "withdrawCnt": 0
        }
    - columnName: 화면에 출력할 한글 명
      > 예) '총 기사님 수', '신입 기사님 수'
    - valueUnit: 화면에 출력 할 값의 단위
      > 예) '명', '개', '건' 등
  **예제**
  [
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
    ...
  ]
*/

import "./AdminStatistics.css";


export default function AdminStatistics ({title, now, statistics, statisticsValueUnit}) {
  
  return (
    <>
      <div className="adminStatistics-container">
        <h1>{title}</h1>
        <span>{now}</span>
        <div className="adminStatistics-statistics-section">
          {
            (statisticsValueUnit && statistics) && statisticsValueUnit.map((item, idx) => {
              return (
                <div className="adminStatistics-item" key={`${item.accessorKey}-${idx}`}>
                  <span className="adminStatistics-item-column-name">{item.columnName}</span>
                  <span className="adminStatistics-item-value">{statistics[item.accessorKey]}<span className="adminStatistics-item-value-unit">{item.valueUnit}</span></span>
                </div>
              )
            })
          }

        </div>
        </div>
    </>
  );
};
