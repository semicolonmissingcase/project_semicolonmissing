  import { useMemo, useState } from "react";
  import { DayPicker } from "react-day-picker";
  import "react-day-picker/style.css";
  import { addMonths, endOfWeek, format, isValid, isSameDay, isWithinInterval, startOfWeek, subMonths } from "date-fns";
  import { ko } from "date-fns/locale";
  import { IoChevronBack } from "react-icons/io5";
  import { IoChevronForward } from "react-icons/io5";
  import  CleanersTopSummary  from "../cleaners-settlement-status/CleanersTopSummary.jsx";
  import  CleanersListItem  from "../cleaners-settlement-status/CleanersListItem.jsx";
  import "./SettlementMain.css";

  // --- Mock Data ---
 const DUMMY_JOBS = [
    { id: "1", date: "2025-12-01", time: "10:00", title: "상인동 유명한 카페1", amount: 50000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 달서구 상인동 123", owner: "김상인" },
    { id: "2", date: "2025-12-02", time: "11:00", title: "상인동 유명한 카페2", amount: 60000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 달서구 상인동 456", owner: "박상인" },
    { id: "3", date: "2025-12-03", time: "11:00", title: "남일동 아주 유명한 카페1", amount: 70000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 101", owner: "이남일" },
    { id: "4", date: "2025-12-04", time: "10:00", title: "남일동 아주 유명한 카페2", amount: 80000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 102", owner: "김남일" },
    { id: "5", date: "2025-12-04", time: "11:00", title: "남일동 아주 유명한 카페3", amount: 90000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 103", owner: "최남일" },
    { id: "6", date: "2025-12-08", time: "11:00", title: "시내 중앙 카페", amount: 120000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 동성로 50", owner: "정중앙" },
    { id: "7", date: "2025-12-11", time: "10:00", title: "대학가 스타 카페", amount: 45000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 북구 대학로 20", owner: "권대학" },
    { id: "8", date: "2025-12-11", time: "11:00", title: "대학가 스타 카페 B", amount: 45000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 북구 대학로 21", owner: "오대학" },
    { id: "16", date: "2025-12-26", time: "11:00", title: "남일동 아주 유명한 카페3", amount: 70000, jobStatus: "취소", settlementStatus: "정산완료", canceled: true, address: "대구광역시 중구 남일동 103", owner: "최남일" },
    { id: "37", date: "2025-12-11", time: "11:00", title: "대학가 스타 카페 B", amount: 45000, jobStatus: "취소", settlementStatus: "정산완료", canceled: true, address: "대구광역시 북구 대학로 21", owner: "오대학" },
    { id: "9", date: "2025-12-15", time: "11:00", title: "상인동 유명한 카페3", amount: 55000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 달서구 상인동 125", owner: "이영희" },
    { id: "10", date: "2025-12-17", time: "11:00", title: "남일동 아주 유명한 카페4", amount: 65000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 104", owner: "한상사" },
    { id: "11", date: "2025-12-22", time: "11:00", title: "상인동 유명한 카페1", amount: 50000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 달서구 상인동 123", owner: "김상인" },
    { id: "12", date: "2025-12-22", time: "13:00", title: "상인동 유명한 카페2", amount: 50000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 달서구 상인동 456", owner: "박상인" },
    { id: "13", date: "2025-12-23", time: "11:00", title: "남일동 아주 유명한 카페1", amount: 50000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 101", owner: "이남일" },
    { id: "14", date: "2025-12-24", time: "11:00", title: "남일동 아주 유명한 카페2", amount: 50000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 102", owner: "김남일" },
    { id: "15", date: "2025-12-28", time: "11:00", title: "남일동 유명한 카페2", amount: 50000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 106", owner: "정남일" },
    { id: "17", date: "2025-12-28", time: "15:00", title: "남일동 유명한 카페1", amount: 80000, jobStatus: "진행중", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 105", owner: "박남일" },
    { id: "18", date: "2025-12-28", time: "17:00", title: "남일동 아주 유명한 카페2", amount: 95000, jobStatus: "진행중", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 102", owner: "김남일" },
    { id: "19", date: "2025-12-29", time: "10:00", title: "시내 스타벅스", amount: 105000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 동성로 10", owner: "김스타" },
    { id: "20", date: "2025-12-29", time: "11:00", title: "시내 이디야", amount: 45000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 동성로 11", owner: "최디야" },
    { id: "21", date: "2025-12-30", time: "11:00", title: "대학로 유명 까페", amount: 88000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 북구 대학로 30", owner: "김대학" },
    { id: "22", date: "2025-12-31", time: "10:00", title: "서점 근처 찻집", amount: 60000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 5", owner: "오서점" },
    { id: "23", date: "2025-12-31", time: "11:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 6", owner: "김커피" },
    { id: "24", date: "2025-12-31", time: "12:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 7", owner: "이커피" },
    { id: "25", date: "2025-12-31", time: "13:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "진행중", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 8", owner: "박커피" },
    { id: "26", date: "2025-12-31", time: "14:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "진행중", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 9", owner: "최커피" },
    { id: "27", date: "2025-12-31", time: "15:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 10", owner: "정커피" },
    { id: "28", date: "2025-12-31", time: "16:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 11", owner: "윤커피" },
    { id: "29", date: "2025-12-31", time: "17:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 12", owner: "한커피" },
    { id: "30", date: "2026-01-01", time: "11:00", title: "상인동 유명한 카페1", amount: 50000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 달서구 상인동 123", owner: "김상인" },
    { id: "31", date: "2026-01-02", time: "11:00", title: "상인동 유명한 카페2", amount: 60000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 달서구 상인동 456", owner: "박상인" },
    { id: "32", date: "2026-01-03", time: "11:00", title: "남일동 아주 유명한 카페1", amount: 70000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 101", owner: "이남일" },
    { id: "33", date: "2026-01-04", time: "10:00", title: "남일동 아주 유명한 카페2", amount: 80000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 102", owner: "김남일" },
    { id: "34", date: "2026-01-04", time: "11:00", title: "남일동 아주 유명한 카페3", amount: 90000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 103", owner: "최남일" },
    { id: "35", date: "2026-01-08", time: "11:00", title: "시내 중앙 카페", amount: 120000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 동성로 50", owner: "정중앙" },
    { id: "36", date: "2026-01-11", time: "10:00", title: "대학가 스타 카페", amount: 45000, jobStatus: "진행중", settlementStatus: "정산대기", canceled: false, address: "대구광역시 북구 대학로 20", owner: "권대학" },
    { id: "38", date: "2026-01-15", time: "11:00", title: "상인동 유명한 카페3", amount: 55000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 달서구 상인동 125", owner: "이영희" },
    { id: "39", date: "2026-01-17", time: "11:00", title: "남일동 아주 유명한 카페4", amount: 65000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 104", owner: "한상사" },
    { id: "40", date: "2026-01-22", time: "11:00", title: "상인동 유명한 카페1", amount: 50000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 달서구 상인동 123", owner: "김상인" },
    { id: "41", date: "2026-01-22", time: "13:00", title: "상인동 유명한 카페2", amount: 50000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 달서구 상인동 456", owner: "박상인" },
    { id: "42", date: "2026-01-23", time: "11:00", title: "남일동 아주 유명한 카페1", amount: 50000, jobStatus: "진행중", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 101", owner: "이남일" },
    { id: "43", date: "2026-01-24", time: "11:00", title: "남일동 아주 유명한 카페2", amount: 50000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 102", owner: "김남일" },
    { id: "44", date: "2026-01-28", time: "11:00", title: "남일동 유명한 카페2", amount: 50000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 106", owner: "정남일" },
    { id: "45", date: "2026-01-26", time: "11:00", title: "남일동 아주 유명한 카페3", amount: 70000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 103", owner: "최남일" },
    { id: "46", date: "2026-01-28", time: "15:00", title: "남일동 유명한 카페1", amount: 80000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 105", owner: "박남일" },
    { id: "47", date: "2026-01-28", time: "17:00", title: "남일동 아주 유명한 카페2", amount: 95000, jobStatus: "진행중", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 102", owner: "김남일" },
    { id: "48", date: "2026-01-29", time: "10:00", title: "시내 스타벅스", amount: 105000, jobStatus: "진행중", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 동성로 10", owner: "김스타" },
    { id: "49", date: "2026-01-30", time: "11:00", title: "대학로 유명 까페", amount: 88000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 북구 대학로 30", owner: "김대학" },
    { id: "50", date: "2026-01-31", time: "10:00", title: "서점 근처 찻집", amount: 60000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 5", owner: "오서점" },
    { id: "51", date: "2026-01-31", time: "11:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 6", owner: "김커피" },
    { id: "52", date: "2026-01-31", time: "12:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 7", owner: "이커피" },
];


  // --- Utils ---4
  const ymd = (d) => (isValid(d) ? format(d, "yyyy-MM-dd") : "");

  const countToLevel = (count) => {
    if (count >= 9) return "cleaners-settlement-status-lv3";
    if (count >= 5) return "cleaners-settlement-status-lv2";
    if (count >= 1) return "cleaners-settlement-status-lv1";
    return "lv0";
  };

  const pickDate = (p) => {
    const d = p?.date ?? p?.day?.date ?? p?.day ?? null;
    return d instanceof Date && isValid(d) ? d : null;
  };

  const parseYmd = (s) => {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const getWeekRange = (date) => ({
    start: startOfWeek(date, { weekStartsOn: 0 }),
    end: endOfWeek(date, { weekStartsOn: 0 }),
  });
  const inRange = (day, range) => day && range && isWithinInterval(day, { start: range.start, end: range.end });

  export default function CleanersSettlementStatus() {

    const [monthCursor, setMonthCursor] = useState(new Date());
    const [excludeCanceled, setExcludeCanceled] = useState(true);
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [selectedWeek, setSelectedWeek] = useState(null);

    const getDateFromProps = (props) =>

      props?.date ?? props?.day ?? props?.day?.date ?? props?.dayObj?.date;


    // 주간 클릭 핸들러 (상태 업데이트용)
    const handleWeekClick = (date) => {
      setSelectedDay(null); // 일자 선택 해제
      setSelectedWeek(date); // 주간 선택 설정
    };

    const handleDayClick = (day) => {
      if (!day) return;
      setSelectedDay(day);
      setSelectedWeek(null); // 일 선택 시 주 선택 해제
    };


    const countsByYmd = useMemo(() => {
      return DUMMY_JOBS.reduce((map, job) => {
        if (excludeCanceled && job.canceled) return map;

        const key = ymd(new Date(job.date));
        map.set(key, (map.get(key) ?? 0) + 1);

        return map;
      }, new Map());
    }, [excludeCanceled]);

    const rightItems = useMemo(() => {
      const base = DUMMY_JOBS.filter((j) => !(excludeCanceled && j.canceled));
      
      if (selectedDay) {
        return base.filter((j) => j.date === ymd(selectedDay));
      }
      
      if (selectedWeek) {
        const weekRange = getWeekRange(selectedWeek);
        return base.filter((j) => {
          const jobDate = parseYmd(j.date);
          return isWithinInterval(jobDate, { start: weekRange.start, end: weekRange.end });
        });
      }
      
      return [];
    }, [excludeCanceled, selectedDay, selectedWeek]);

    const rightTitle = useMemo(() => {
      if (selectedDay) return format(selectedDay, "yyyy년 M월 d일 eeee", { locale: ko });
      if (selectedWeek) {
        const range = getWeekRange(selectedWeek);
        return `${format(range.start, "M월 d일")} ~ ${format(range.end, "M월 d일")} (주간)`;
      }
      return "날짜를 선택하세요";
    }, [selectedDay, selectedWeek]);

    const modifiers = {
      selected: selectedDay,
      lv1: (date) => (countsByYmd.get(ymd(date)) ?? 0) >= 1 && (countsByYmd.get(ymd(date)) ?? 0) < 5,
      lv2: (date) => (countsByYmd.get(ymd(date)) ?? 0) >= 5 && (countsByYmd.get(ymd(date)) ?? 0) < 9,
      lv3: (date) => (countsByYmd.get(ymd(date)) ?? 0) >= 9,
    };

    const modifiersClassNames = {
      selected: "rdp-day_selected", // Use default selected class
      lv1: "cleaners-settlement-status-lv1",
      lv2: "cleaners-settlement-status-lv2",
      lv3: "cleaners-settlement-status-lv3",
    };
    
    return (
      <div className="all-container cleaners-settlement-status-container">
        <CleanersTopSummary />

        <div className="cleaners-settlement-status-box cleaners-settlement-status-monthly-summary">
          <div className="cleaners-settlement-status-box-title">월별 요약 그래프</div>
          <div className="cleaners-settlement-status-grid">
            <section className="cleaners-settlement-status-left"
              onClick={(e) => {
                // 1. 클릭된 요소에서 가장 가까운 'tr'(행)을 찾습니다.
                const row = e.target.closest('tr.rdp-week');
                if (!row) return;

                // 2. 해당 행 안에 있는 첫 번째 날짜 버튼을 찾아 날짜 정보를 가져옵니다.
                // DayPicker v9은 보통 버튼에 aria-label이나 데이터 속성이 있습니다.
                const firstDayBtn = row.querySelector('button.rdp-day');
                if (firstDayBtn) {
                  // v9의 경우 버튼 구조를 확인해야 하지만, 
                  // 가장 단순한 방법은 해당 행의 순서를 이용하거나 
                  // 우리가 보냈던 days 데이터를 찾는 것입니다.
                }
              }}
            >
              <div className="cleaners-settlement-status-caption">
                <button type="button" className="cleaners-settlement-status-nav-btn" onClick={() => setMonthCursor(m => subMonths(m, 1))}> <IoChevronBack size={30} /> </button>
                <div className="cleaners-settlement-status-caption-center">
                  <div className="cleaners-settlement-status-caption-year">{format(monthCursor, "yyyy년")}</div>
                  <div className="cleaners-settlement-status-caption-month">{format(monthCursor, "M월")}</div>
                </div>
                <button type="button" className="cleaners-settlement-status-nav-btn" onClick={() => setMonthCursor(m => addMonths(m, 1))}> <IoChevronForward size={30} /> </button>
              </div>
              <DayPicker
                mode="single"
                selected={selectedDay}
                hideNavigation
                onSelect={(day) => {
                  if (!day) return;
                  setSelectedDay(day);
                  setSelectedWeek(null);
                }}
                locale={ko}
                month={monthCursor}
                onMonthChange={setMonthCursor}
                showOutsideDays
                modifiers={modifiers}          
                modifiersClassNames={modifiersClassNames}
                components={{
                  MonthCaption: () => null,
                  DayButton: (props) => {
                    const date = pickDate(props);
                    if (!date) return <button {...props} />;

                    const key = ymd(date);
                    const count = countsByYmd.get(key) ?? 0;
                    const levelClass = countToLevel(count); // cleaners-settlement-status-lvX 반환

                    return (
                      <button {...props} className={`${props.className ?? ""} ${levelClass}`}>
                        {props.children}
                      </button>
                    );
                  },
                  Week: (props) => {
                    const days = props.week.days || [];
                    const weekStart = days[0]?.date;

                    const totalCount = days.reduce(
                      (acc, day) => acc + (countsByYmd.get(ymd(day.date)) || 0),
                      0
                    );

                    // 현재 이 주가 선택된 상태인지 확인
                    const isWeekSelected = selectedWeek && weekStart && isSameDay(weekStart, selectedWeek);

                    return (
                      <tr
                        className={`rdp-week ${isWeekSelected ? "cleaners-settlement-status-week-selected" : ""}`}
                        onClick={(e) => {
                          if (e.target.closest("button.rdp-day_button")) return;
                          if (weekStart) handleWeekClick(weekStart);
                        }}
                      >
                        {/* 날짜들 (일~토) */}
                        {props.children}

                        {/* 배지 칸: 선택되었을 때만 내부의 span(배지)을 보여줌 */}
                        <td className="rdp-week-badge-cell">
                          {isWeekSelected && totalCount > 0 && (
                            <span className="cleaners-settlement-status-week-total-badge">
                              {totalCount}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  }
                }}
                />
              <div className="cleaners-settlement-status-legend">
                  <div className="cleaners-settlement-status-legend-item"> <span className="cleaners-settlement-status-legend-dot cleaners-settlement-status-lv1-legend"></span> 1 ~ 5건 </div>
                  <div className="cleaners-settlement-status-legend-item"> <span className="cleaners-settlement-status-legend-dot cleaners-settlement-status-lv2-legend"></span> 5 ~ 8건 </div>
                  <div className="cleaners-settlement-status-legend-item"> <span className="cleaners-settlement-status-legend-dot cleaners-settlement-status-lv3-legend"></span> 9 ~ 11건 </div>
              </div>
            </section>

            <section className="cleaners-settlement-status-right">
              <div className="cleaners-settlement-status-right-top">
                <div className="cleaners-settlement-status-right-title">{rightTitle}</div>
                <label className="cleaners-settlement-status-filter">
                  <select onChange={(e) => setExcludeCanceled(e.target.value !== 'all')} defaultValue="canceled">
                    <option value="all">취소 포함</option>
                    <option value="canceled">취소 제외</option>
                  </select>
                </label>
              </div>
              <div className="cleaners-settlement-status-list">
                {rightItems.length === 0 ? (
                  <div className="cleaners-settlement-status-empty">표시할 항목이 없습니다.</div>
                ) : (
                  rightItems.map((job) => <CleanersListItem key={job.id} job={job} defaultOpen={true} />)
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }