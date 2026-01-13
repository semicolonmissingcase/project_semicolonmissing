import { useEffect, useMemo, useRef, useState } from "react";
import { RiArrowDropDownFill, RiArrowDropUpFill } from "react-icons/ri";
import { getLocationsThunk } from "../../../api/axiosCleaner.js";
import "./CleanersRegionDropdown.css";
import styles from "./CleanersRegionDropdown.module.css";
import { createPortal } from "react-dom";

const MAX_REGIONS = 5;

export default function CleanersRegion({
  label = "작업 지역",
  initialRegions = [], // 부모로부터 받은, 현재 기사님이 선택한 지역 ID 배열
  onRegionChange = () => {}, // 부모에게 변경된 ID 배열을 알릴 함수
  onLimitReached = () => {}
}) {
  const [open, setOpen] = useState(false);
  const [allLocations, setAllLocations] = useState([]); // API로 받아올 전체 지역 마스터 목록
  const [activeCity, setActiveCity] = useState("서울"); // UI에서 현재 선택된 시/도
  const wrapRef = useRef(null);

  // 1. 컴포넌트가 처음 로드될 때, API를 호출하여 '전체 지역 목록'을 가져옵니다.
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await getLocationsThunk();
        const locations = Array.isArray(response.data.rows) ? response.data.rows : [];
        setAllLocations(response.data.rows);

        if(locations.length > 0) {
          const firstCity = [...new Set(response.data.rows.map(loc => loc.city))][0];
          setActiveCity(firstCity);
        }
      } catch (error) {
        console.error("지역 목록을 불러오는 데 실패했습니다:", error);
      }
    };
    fetchLocations();
  }, []);

  // 2. 전체 지역 목록에서 도시/상세지역 목록을 계산합니다.
  const cities = useMemo(() => [...new Set(allLocations.map(loc => loc.city))], [allLocations]);
  const activeDistricts = useMemo(() => allLocations.filter(loc => loc.city === activeCity), [allLocations, activeCity]);

  // 3. 부모가 준 '현재 선택된 지역 ID' (initialRegions)를 화면에 표시할 이름으로 변환합니다.
  const selectedLocationDetails = useMemo(() => {
    return initialRegions.map(id => {
      const loc = allLocations.find(l => l.id === id);
      return loc ? { id: loc.id, name: `${loc.city}-${loc.district}` } : null;
    }).filter(Boolean);
  }, [initialRegions, allLocations]);

  const removeChip = (id) => onRegionChange(initialRegions.filter(regionId => regionId !== id));
  const clearAll = () => onRegionChange([]);

  // 4. 사용자가 체크박스를 누르면, 부모에게 변경된 ID 배열을 전달합니다.
  const toggleDetail = (locationId) => {
    const newSelected = [...initialRegions];
    const index = newSelected.indexOf(locationId);

    if (index > -1) { 
      newSelected.splice(index, 1); 
    } else {
      if (newSelected.length >= MAX_REGIONS) {
        onLimitReached();
        return;
      }
      newSelected.push(locationId);
    }
    onRegionChange(newSelected); // 부모의 state를 업데이트하기 위해 콜백 호출
  };

  useEffect(() => {
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div className={`cleaners-profile-edit-region-picker ${styles.wrap}`} ref={wrapRef}>
      <div className={`cleaners-profile-edit-region-picker-label ${styles.topLabel}`}>
        {label}
      </div>

      {/* 선택 칩 */}
      <div className="cleaners-profile-edit-region-picker-chips">
        {selectedLocationDetails.length === 0 ? (
          <div className={`cleaners-profile-edit-region-picker-empty ${styles.chipsEmpty}`}>선택된 지역 없음</div>
        ) : (
          <div className={`cleaners-profile-edit-region-chip-list ${styles.chips}`}>
            {selectedLocationDetails.map(loc => (
              <div key={loc.id} className={`cleaners-profile-edit-region-chip ${styles.chip}`}>
                <span className={`cleaners-profile-edit-region-chip-text ${styles.chipText}`}>{loc.name}</span>
                <button type="button" className={`cleaners-profile-edit-region-chip-remove ${styles.chipX}`} onClick={() => removeChip(loc.id)} aria-label={`${loc.name} 삭제`}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 트리거 버튼 */}
      <button type="button" className={`cleaners-profile-edit-region-picker-trigger ${open ? "is-open" : ""} ${styles.trigger} ${open ? styles.triggerOpen : ""}`} onClick={() => setOpen(v => !v)}>
        <span className={`cleaners-profile-edit-region-picker-updown ${styles.chev}`}>
          {open ? <RiArrowDropUpFill size={30} /> : <RiArrowDropDownFill size={30} />}
        </span>
      </button>

      {/* 패널 */}
      {open && (
        <div className="cleaners-profile-edit-region-panel" role="dialog">
          <div className={`cleaners-profile-edit-region-panel-body ${activeCity ? "is-split" : "is-left-only"}`}>
            {/* LEFT (도시 목록) */}
            <div className={`cleaners-profile-edit-region-panel-left ${styles.leftCol}`}>
              {cities.map(city => (
                <button key={city} type="button" className={`cleaners-profile-edit-region-left-item ${city === activeCity ? "is-active" : ""} ${styles.leftItem} ${city === activeCity ? styles.leftItemActive : ""}`} onClick={() => setActiveCity(city)}>
                  {city}
                </button>
              ))}
            </div>

            {/* RIGHT (상세 지역 목록) */}
            {activeCity && (
              <div className={`cleaners-profile-edit-region-panel-right ${styles.rightCol}`}>
                <div className={`cleaners-profile-edit-region-right-list ${styles.rightList}`}>
                  {activeDistricts.map(loc => {
                    const checked = initialRegions.includes(loc.id);
                    return (
                      <label key={loc.id} className={`cleaners-profile-edit-region-right-item ${checked ? "is-checked" : ""} ${styles.rightItem} ${checked ? styles.rightItemChecked : ""}`}>
                        <input type="checkbox" className={`cleaners-profile-edit-region-right-checkbox ${styles.checkbox}`} checked={checked} onChange={() => toggleDetail(loc.id)} />
                        <span className={`cleaners-profile-edit-region-right-text ${styles.rightItemText}`}>{loc.district}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className={`cleaners-profile-edit-region-panel-footer ${styles.footerBtns}`}>
            <button type="button" className={`cleaners-profile-edit-region-panel-button cleaners-profile-edit-region-panel-button--ghost ${styles.ghostBtn}`} onClick={clearAll}>전체 해제</button>
            <button type="button" className={`cleaners-profile-edit-region-panel-button cleaners-profile-edit-region-panel-button--primary ${styles.primaryBtn}`} onClick={() => setOpen(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

function LimitModal({ open, onClose }) {
  if (!open) return null;
  return createPortal(
    <div className="cleaners-profile-edit-modal-backdrop" role="dialog" aria-modal="true">
      <div className="cleaners-profile-edit-modal-box">
        <div className="cleaners-profile-edit-modal-text">작업 지역은 최대 {MAX_REGIONS}개까지 선택할 수 있어요.</div>
        <button className="cleaners-profile-edit-modal-button" type="button" onClick={onClose} autoFocus>확인</button>
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

