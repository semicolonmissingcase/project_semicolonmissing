import React, { useMemo, useState, useEffect, useCallback } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { addMonths, endOfWeek, format, isValid, isSameDay, isWithinInterval, startOfWeek, subMonths } from "date-fns";
import { ko } from "date-fns/locale";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

import SettlementCards from "./SettlementCards";
import SettlementItem from "./SettlementItem"; 
import { getSettlementSummary } from "../../../api/axiosCleaner";

import "./SettlementMain.css";

// --- Utils ---
const ymd = (d) => (isValid(d) ? format(d, "yyyy-MM-dd") : "");
const pickDate = (p) => {
  const d = p?.date ?? p?.day?.date ?? p?.day ?? null;
  return d instanceof Date && isValid(d) ? d : null;
};
const parseYmd = (s) => {
  if (!s) return new Date();
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const getWeekRange = (date) => ({
  start: startOfWeek(date, { weekStartsOn: 0 }),
  end: endOfWeek(date, { weekStartsOn: 0 }),
});

const countToLevel = (count) => {
  if (count >= 9) return "cleaners-settlement-status-lv3";
  if (count >= 5) return "cleaners-settlement-status-lv2";
  if (count >= 1) return "cleaners-settlement-status-lv1";
  return "lv0";
};

export default function SettlementMain() {
  const [monthCursor, setMonthCursor] = useState(new Date());
  const [excludeCanceled, setExcludeCanceled] = useState(true);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState(null);

  const [summaryData, setSummaryData] = useState({ pending: 0, completed: 0 });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadSettlementData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getSettlementSummary();
      
      if (response.data && response.data.success) {
        const { summary, list } = response.data.data;
        
    const mappedList = (list || []).map(item => {
      const calendarDate = item.reservation?.date || (item.createdAt ? item.createdAt.substring(0, 10) : "");

      return {
        ...item,
        id: item.id,
        storeName: item.reservation?.store?.name || "상호명 미지정",
        amount: item.settlement_amount ?? 0, 
        settlementStatus: item.status || "지급 대기",
        date: calendarDate,
        canceled: item.canceled ?? false 
      };
    });
        setSummaryData(summary || { pending: 0, completed: 0 });
        setJobs(mappedList);
      }
    } catch (error) {
      console.error("데이터 로딩 중 오류:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettlementData();
  }, [loadSettlementData]);

  const countsByYmd = useMemo(() => {
    return jobs.reduce((map, job) => {
      if (excludeCanceled && job.canceled) return map;
      const key = job.date; 
      if (key) map.set(key, (map.get(key) ?? 0) + 1);
      return map;
    }, new Map());
  }, [jobs, excludeCanceled]);

  const rightItems = useMemo(() => {
    const base = jobs.filter((j) => !(excludeCanceled && j.canceled));
    
    if (selectedDay) {
      const targetDateStr = ymd(selectedDay); 
      return base.filter((j) => j.date.trim() === targetDateStr.trim());
    }
    
    if (selectedWeek) {
      const range = getWeekRange(selectedWeek);
      return base.filter((j) => j.date && isWithinInterval(parseYmd(j.date), range));
    }
    
    return [];
  }, [jobs, excludeCanceled, selectedDay, selectedWeek]);

  const rightTitle = useMemo(() => {
    if (selectedDay) return format(selectedDay, "yyyy년 M월 d일 eeee", { locale: ko });
    if (selectedWeek) {
      const range = getWeekRange(selectedWeek);
      return `${format(range.start, "M월 d일")} ~ ${format(range.end, "M월 d일")} (주간)`;
    }
    return "날짜를 선택하세요";
  }, [selectedDay, selectedWeek]);

  const handleDayClick = (day) => {
    if (!day) return;
    setSelectedDay(day);
    setSelectedWeek(null);
  };
  
  const handleWeekClick = (date) => {
    setSelectedDay(null);
    setSelectedWeek(date);
  };

  return (
    <div className="all-container cleaners-settlement-status-container">
      <SettlementCards data={summaryData} />

      <div className="cleaners-settlement-status-box cleaners-settlement-status-monthly-summary">
        <div className="cleaners-settlement-status-box-title">월별 요약 그래프</div>
        
        <div className="cleaners-settlement-status-grid">
          <section className="cleaners-settlement-status-left">
            <div className="cleaners-settlement-status-caption">
              <button type="button" className="cleaners-settlement-status-nav-btn" onClick={() => setMonthCursor(m => subMonths(m, 1))}>
                <IoChevronBack size={30} />
              </button>
              <div className="cleaners-settlement-status-caption-center">
                <div className="cleaners-settlement-status-caption-year">{format(monthCursor, "yyyy년")}</div>
                <div className="cleaners-settlement-status-caption-month">{format(monthCursor, "M월")}</div>
              </div>
              <button type="button" className="cleaners-settlement-status-nav-btn" onClick={() => setMonthCursor(m => addMonths(m, 1))}>
                <IoChevronForward size={30} />
              </button>
            </div>

            <DayPicker
              mode="single"
              selected={selectedDay}
              month={monthCursor}
              onSelect={handleDayClick}
              locale={ko}
              showOutsideDays
              hideNavigation
              components={{
                MonthCaption: () => null,
                DayButton: (props) => {
                  const date = pickDate(props);
                  if (!date) return <button {...props} />;
                  const count = countsByYmd.get(ymd(date)) ?? 0;
                  const levelClass = countToLevel(count);
                  return (
                    <button {...props} className={`${props.className ?? ""} ${levelClass}`}>
                      {props.children}
                    </button>
                  );
                },
                Week: (props) => {
                  const days = props.week.days || [];
                  const weekStart = days[0]?.date;
                  const totalCount = days.reduce((acc, d) => acc + (countsByYmd.get(ymd(d.date)) || 0), 0);
                  const isWeekSelected = selectedWeek && isSameDay(weekStart, selectedWeek);
                  return (
                    <tr className={`rdp-week ${isWeekSelected ? "cleaners-settlement-status-week-selected" : ""}`} onClick={() => weekStart && handleWeekClick(weekStart)}>
                      {props.children}
                      <td className="rdp-week-badge-cell">
                        {isWeekSelected && totalCount > 0 && (
                          <span className="cleaners-settlement-status-week-total-badge">{totalCount}</span>
                        )}
                      </td>
                    </tr>
                  );
                }
              }}
            />
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
              {loading ? (
                <div className="cleaners-settlement-status-empty">데이터를 불러오는 중...</div>
              ) : rightItems.length === 0 ? (
                <div className="cleaners-settlement-status-empty">표시할 항목이 없습니다.</div>
              ) : (
                rightItems.map((job) => <SettlementItem key={job.id} job={job} />)
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}