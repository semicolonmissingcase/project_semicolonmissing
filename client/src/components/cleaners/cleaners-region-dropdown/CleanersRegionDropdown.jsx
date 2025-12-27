import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { RiArrowDropDownFill } from "react-icons/ri";
import { RiArrowDropUpFill } from "react-icons/ri";
import styles from "./CleanersRegionDropdown.module.css";


/* =========================
   DATA
========================= */
const REGION = {
  서울: ["종로구", "중구", "용산구", "성동구", "광진구", "동대문구", "중랑구", "성북구", "강북구", "도봉구", "노원구", "은평구", "서대문구", "마포구", "양천구", "강서구", "구로구", "금천구", "영등포구", "동작구", "관악구", "서초구", "강남구", "송파구", "강동구"],
  경기: ["수원시", "용인시", "화성시", "성남시", "부천시", "안산시", "평택시", "안양시", "시흥시", "김포시", "광주시", "하남시", "광명시", "군포시", "오산시", "이천시", "안성시", "의왕시", "양평군", "여주시", "과천시", "고양시", "남양주시", "파주시", "의정부시", "양주시", "구리시", "포천시", "동두천시", "가평군", "연천군"],
  인천: ["강화군", "옹진군", "중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구"],
  세종: ["세종시"],
  대전: ["서구", "유성구", "중구", "동구", "대덕구"],
  광주: ["북구", "서구", "동구", "남구", "광산구"],
  전북: ["전주시", "군산시", "익산시", "정읍시", "남원시", "김제시", "완주군", "진안군", "무주군", "장수군", "임실군", "순창군", "고창군", "부안군"],
  전남: ["목포시", "여수시", "순천시", "나주시", "광양시", "담양군", "곡성군", "구례군", "고흥군", "보성군", "화순군", "장흥군", "강진군", "해남군", "영암군", "무안군", "함평군", "영광군", "장성군", "완도군", "진도군", "신안군"],
  충북: ["청주시", "충주시", "제천시", "보은군", "옥천군", "영동군", "증평군", "진천군", "괴산군", "음성군", "단양군"],
  충남: ["천안시", "공주시", "보령시", "아산시", "서산시", "논산시", "계룡시", "당진시", "금산군", "부여군", "서천군", "청양군", "홍성군", "예산군", "태안군"],
  강원: ["춘천시", "원주시", "강릉시", "동해시", "태백시", "속초시", "삼척시", "홍천군", "횡성군", "영월군", "평창군", "정선군", "철원군", "화천군", "양구군", "인제군", "고성군", "양양군"],
  부산: ["중구", "서구", "동구", "영도구", "부산진구", "동래구", "남구", "북구", "해운대구", "사하구", "금정구", "강서구", "연제구", "수영구", "사상구", "기장군"],
  대구: ["수성구", "달서구", "중구", "동구", "서구", "북구", "남구", "달성군", "군위군"],
  경북: ["포항시", "경주시", "김천시", "안동시", "구미시", "영주시", "영천시", "상주시", "문경시", "경산시", "의성군", "청송군", "영양군", "영덕군", "청도군", "고령군", "성주군", "칠곡군", "예천군", "봉화군", "울진군", "울릉군"],
  경남: ["창원시", "진주시", "통영시", "사천시", "김해시", "밀양시", "거제시", "양산시", "의령군", "함안군", "창녕군", "고성군", "남해군", "하동군", "산청군", "함양군", "거창군", "합천군"],
  제주: ["제주시", "서귀포시"],
};

const MAX = 5;

const makeValue = (region, detail) => `${region}-${detail}`;
const parseValue = (v) => {
  const i = v.indexOf("-");
  if (i === -1) return { region: v, detail: "" };
  return { region: v.slice(0, i), detail: v.slice(i + 1) };
};
const uniq = (arr) => Array.from(new Set(arr));

/* =========================
   CleanerRegionDropdown
========================= */
export function CleanersRegionDropdown({ name = "workAreas", label = "작업 지역", labelStyle = {} }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [activeRegion, setActiveRegion] = useState(null);

  const wrapRef = useRef(null);
  const rightListRef = useRef(null);
  const rightScrollTopRef = useRef(0);

  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitNotified, setLimitNotified] = useState(false);

  const regionList = useMemo(() => Object.keys(REGION), []);
  const activeDetails = useMemo(() => REGION[activeRegion] || [], [activeRegion]);

  const selectedCountByRegion = useMemo(() => {
    const map = {};
    for (const r of regionList) map[r] = 0;
    for (const v of selected) {
      const { region } = parseValue(v);
      if (map[region] !== undefined) map[region] += 1;
    }
    return map;
  }, [selected, regionList]);

  const submitValue = JSON.stringify(uniq(selected));

  // 바깥 클릭 닫기
  useEffect(() => {
    const onDown = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);

  // ESC 닫기
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 오른쪽 스크롤 유지(지역 변경 시)
  useEffect(() => {
    if (!rightListRef.current) return;
    rightListRef.current.scrollTop = rightScrollTopRef.current;
  }, [activeRegion]);

  const toggleDetail = (region, detail) => {
    const v = makeValue(region, detail);

    setSelected((prev) => {
      const set = new Set(prev);

      if (set.has(v)) {
        set.delete(v);
        return Array.from(set);
      }

      if (prev.length >= MAX) {
        if (!limitNotified) {
          setShowLimitModal(true);
          setLimitNotified(true);
        }
        return prev;
      }

      set.add(v);
      return Array.from(set);
    });
  };

  const changeRegionKeepScroll = (r) => {
    if (rightListRef.current) {
      rightScrollTopRef.current = rightListRef.current.scrollTop;
    }
    setActiveRegion(r);
  };

  const removeChip = (v) => setSelected((prev) => prev.filter((x) => x !== v));
  const clearAll = () => {
    setSelected([]);
    setLimitNotified(false);
  };

  const closeLimitModal = () => {
    setShowLimitModal(false);
    setLimitNotified(false); // 다시 5개 초과 시 또 알림 뜨게
  };

  return (
    <div className={`cleaners-profile-edit-region-picker ${styles.wrap}`} ref={wrapRef}>
      <div className={`cleaners-profile-edit-region-picker-label ${styles.topLabel}`} style={labelStyle}>
        {label}
      </div>

      {/* 선택 칩 */}
      <div className="cleaners-profile-edit-region-picker-chips" aria-label="선택된 지역">
        {selected.length === 0 ? (
          <div className={`cleaners-profile-edit-region-picker-empty ${styles.chipsEmpty}`}>
            선택된 지역 없음
          </div>
        ) : (
          <div className={`cleaners-profile-edit-region-chip-list ${styles.chips}`}>
            {selected.map((v) => (
              <div key={v} className={`cleaners-profile-edit-region-chip ${styles.chip}`}>
                <span className={`cleaners-profile-edit-region-chip-text ${styles.chipText}`}>
                  {v}
                </span>
                <button
                  type="button"
                  className={`cleaners-profile-edit-region-chip-remove ${styles.chipX}`}
                  onClick={() => removeChip(v)}
                  aria-label={`${v} 삭제`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 트리거 */}
      <button
        type="button"
        className={`cleaners-profile-edit-region-picker-trigger ${open ? "is-open" : ""} ${styles.trigger} ${open ? styles.triggerOpen : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={`cleaners-profile-edit-region-picker-updown ${styles.chev}`}>
          {open ? <RiArrowDropUpFill size={30} /> : <RiArrowDropDownFill size={30} /> }
        </span>
      </button>

      {/* 폼 제출용 */}
      <input type="hidden" name={name} value={submitValue} />

      {/* 패널 */}
      {open && (
        <div
          className={`cleaners-profile-edit-region-panel ${activeRegion ? "is-split" : "is-left-only"}`}
          role="dialog"
          aria-label="지역 선택"
        >
          <div className={`cleaners-profile-edit-region-panel-body ${activeRegion ? "is-split" : "is-left-only"}`}>
            {/* LEFT */}
            <div className={`cleaners-profile-edit-region-panel-left ${styles.leftCol}`} aria-label="지역 목록">
              {regionList.map((r) => {
                const total = (REGION[r] || []).length;
                const selectedCount = selectedCountByRegion[r] || 0;
                const isActive = r === activeRegion;

                return (
                  <button
                    key={r}
                    type="button"
                    className={`cleaners-profile-edit-region-left-item ${isActive ? "is-active" : ""} ${styles.leftItem} ${isActive ? styles.leftItemActive : ""}`}
                    onClick={() => changeRegionKeepScroll(r)}
                  >
                    <span className={`cleaners-profile-edit-region-left-item-text ${styles.leftText}`}>
                      {r}{" "}
                      <span className={`cleaners-profile-edit-region-left-item-count ${styles.count}`}>
                        ({total})
                      </span>
                    </span>

                    {selectedCount > 0 && (
                      <span className={`cleaners-profile-edit-region-left-item-badge ${styles.badge}`}>
                        {selectedCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* RIGHT */}
            {activeRegion ? (
              <div className={`cleaners-profile-edit-region-panel-right ${styles.rightCol}`} aria-label="상세 지역 목록">
                <div className={`cleaners-profile-edit-region-right-list ${styles.rightList}`} ref={rightListRef}>
                  {activeDetails.map((d) => {
                    const v = makeValue(activeRegion, d);
                    const checked = selected.includes(v);

                    return (
                      <label
                        key={v}
                        className={`cleaners-profile-edit-region-right-item ${checked ? "is-checked" : ""} ${styles.rightItem} ${checked ? styles.rightItemChecked : ""}`}
                      >
                        <input
                          type="checkbox"
                          className={`cleaners-profile-edit-region-right-checkbox ${styles.checkbox}`}
                          checked={checked}
                          onChange={() => toggleDetail(activeRegion, d)}
                        />
                        <span className={`cleaners-profile-edit-region-right-text ${styles.rightItemText}`}>
                          {d}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <div className={`cleaners-profile-edit-region-panel-footer ${styles.footerBtns}`}>
            <button
              type="button"
              className={`cleaners-profile-edit-region-panel-button cleaners-profile-edit-region-panel-button--ghost ${styles.ghostBtn}`}
              onClick={clearAll}
            >
              전체 해제
            </button>
            <button
              type="button"
              className={`cleaners-profile-edit-region-panel-button cleaners-profile-edit-region-panel-button--primary ${styles.primaryBtn}`}
              onClick={() => setOpen(false)}
            >
              닫기
            </button>
          </div>

          <LimitModal open={showLimitModal} onClose={closeLimitModal} />
        </div>
      )}
    </div>
  );
}

/* =========================
   LimitModal 작업 지역 개수 제한 모달
========================= */

export function LimitModal({ open, onClose }) {
  if (!open) return null;

  return createPortal(
    <div className="cleaners-profile-edit-modal-backdrop" 
    role="dialog" 
    aria-modal="true">
      <div className="cleaners-profile-edit-modal-box">
        <div className="cleaners-profile-edit-modal-text-button">
        <div className="cleaners-profile-edit-modal-text">
          작업 지역은 최대 {MAX}개까지 선택할 수 있어요.</div>
        <div className="cleaners-profile-edit-modal-button-row">
          <button 
          className="cleaners-profile-edit-modal-button" 
          type="button" 
          style={{border: "1px solid var(--color-gray)", borderRadius: "5px"}}
          onClick={onClose} autoFocus>
            확인
          </button>
        </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* =========================
   ConfirmModal 취소 완료
========================= */

export function ConfirmModal({ open, message, onClose, onConfirm }) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="cleaners-profile-edit-last-modal-backdrop"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        // 바깥 클릭 닫기(원하면 제거 가능)
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="cleaners-profile-edit-last-modal-box">

        <div className="cleaners-profile-eidt-modal-cancel-submit-text-button">
        <div className="cleaners-profile-edit-modal-text">
          {message}
        </div>

        <div className="cleaners-profile-edit-modal-button-row">
          <button
            className="cleaners-profile-edit-modal-button"
            type="button"
            onClick={onClose}
            style={{background: "var(--color-light-gray", borderRadius: "5px"}}
          >
            취소
          </button>

          <button
            className="cleaners-profile-edit-modal-button"
            type="button"
            onClick={onConfirm}
            autoFocus
            style={{background: "var(--color-light-gray", borderRadius: "5px"}}
          >
            확인
          </button>
        </div>
        </div>

      </div>
    </div>,
    document.body
  );
}

