import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import "./CleanersTodaySchedule.css";

/**
 * 요구사항 (스샷 기준)
 * - 상단 네비 + 우측 원형 "기사님 사진"
 * - 큰 카드: "오늘 예정 일정" + 날짜
 * - 9시~20시 타임라인
 * - 특정 시간에만 예약 카드 표시
 * - 상태: 취소(빨강), 예약(파랑), 지정(남색)
 * - hover 시 카드 배경 살짝 진해짐
 * - 클릭:
 *   - 카드 클릭 -> 상세 페이지로 이동(핸들러 자리)
 *   - 가게명 클릭 -> (원하면) 지도 팝업/페이지
 *   - 고객명 클릭 -> (원하면) 고객 프로필/채팅
 */

const HOURS = Array.from({ length: 12 }, (_, i) => 9 + i); // 9~20

const STATUS_META = {
  cancel: { label: "취소", className: "ts-status-cancel" },
  reserve: { label: "예약", className: "ts-status-reserve" },
  assign: { label: "지정", className: "ts-status-assign" },
};

// 더미 데이터 (서버에서 가져오면 됨)
const DUMMY_EVENTS = [
  {
    id: "e1",
    hour: 9,
    status: "cancel",
    shop: "남일동 유명한 카페3",
    customer: "이점주3",
  },
  {
    id: "e2",
    hour: 15,
    status: "reserve",
    shop: "남일동 유명한 카페2",
    customer: "이점주2",
  },
  {
    id: "e3",
    hour: 19,
    status: "assign",
    shop: "남일동 유명한 카페",
    customer: "이점주",
  },
];

export default function CleanersTodaySchedule() {

  const navigate = useNavigate();

  const [activeId, setActiveId] = useState(null);

  // 시간 -> 이벤트 매핑
  const eventByHour = useMemo(() => {
    const map = new Map();
    for (const ev of DUMMY_EVENTS) map.set(ev.hour, ev);
    return map;
  }, []);

  const todayLabel = "2025년 12월 27일 토요일";

  function goToDetail(ev) {
    // TODO: 라우터 연결
    console.log("goToDetail:", ev.id);
    setActiveId(ev.id);
  }

  function openMap(ev, e) {
    e.stopPropagation();
    console.log("openMap:", ev.shop);
  }

  function openCustomer(ev, e) {
    e.stopPropagation();
    console.log("openCustomer:", ev.customer);
  }

  return (
    <div className="all-container cleaners-today-schedule-container">

      {/* Card */}
      <main className="cleaners-today-schedule-wrapper">
        <section className="ts-card">
          <h2 className="ts-card-title">오늘 예정 일정</h2>
          <div className="ts-card-date">{todayLabel}</div>

          <div className="ts-timeline">
            {HOURS.map((h) => {
              const ev = eventByHour.get(h);
              const isActive = ev?.id && ev.id === activeId;

              return (
                <div className="ts-row" key={h}>
                  {/* left time + rail */}
                  <div className="ts-left">
                    <div className="ts-dot-col">
                      <div className={`ts-dot ${ev ? "is-filled" : "is-empty"}`} />
                      <div className="ts-line" />
                    </div>
                    <div className="ts-time">{h}시</div>
                  </div>

                  {/* right content */}
                  <div className="ts-right">
                    {ev ? (
                      <div
                        className={`ts-event ${isActive ? "is-active" : ""}`}
                        onClick={() => navigate("/cleaners/userquotelistdetails")}
                      >
                        <div className="ts-event-inner">
                          <div className={`ts-status ${STATUS_META[ev.status].className}`}>
                            {STATUS_META[ev.status].label}
                          </div>

                          <div className="ts-info">
                            <button
                              type="button"
                              className="ts-pill ts-pill-shop"
                              onClick={(e) => openMap(ev, e)}
                              aria-label="가게 위치 보기"
                              title="가게 위치 보기"
                            >
                              <span className="ts-ico" aria-hidden="true">🏪</span>
                              <span className="ts-pill-text">{ev.shop}</span>
                            </button>

                            <button
                              type="button"
                              className="ts-pill ts-pill-user"
                              aria-label="고객 정보 보기"
                              title="고객 정보 보기"
                            >
                              <span className="ts-ico" aria-hidden="true">👤</span>
                              <span className="ts-pill-text">{ev.customer}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="ts-empty-slot" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
