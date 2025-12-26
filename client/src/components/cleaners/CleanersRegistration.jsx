import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./CleanersRegistration.css";
import { RiArrowDropDownFill } from "react-icons/ri";
import { RiArrowDropUpFill } from "react-icons/ri";


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
   RegionPickerDropdown
========================= */
function RegionPickerDropdown({ name = "workAreas", label = "작업 지역", labelStyle = {} }) {
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
    <div className="cleaners-reservation-region-picker" style={S.wrap} ref={wrapRef}>
      <div className="cleaners-reservation-region-picker-label" style={{ ...S.topLabel, ...labelStyle }}>
        {label}
      </div>

      {/* 선택 칩 */}
      <div className="cleaners-reservation-region-picker-chips" aria-label="선택된 지역">
        {selected.length === 0 ? (
          <div className="cleaners-reservation-region-picker-empty" style={S.chipsEmpty}>
            선택된 지역 없음
          </div>
        ) : (
          <div className="cleaners-reservation-region-chip-list" style={S.chips}>
            {selected.map((v) => (
              <div key={v} className="cleaners-reservation-region-chip" style={S.chip}>
                <span className="cleaners-reservation-region-chip-text" style={S.chipText}>
                  {v}
                </span>
                <button
                  type="button"
                  className="cleaners-reservation-region-chip-remove"
                  onClick={() => removeChip(v)}
                  style={S.chipX}
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
        className={`cleaners-reservationregion-picker-trigger ${open ? "is-open" : ""}`}
        style={{ ...S.trigger, ...(open ? S.triggerOpen : null) }}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="cleaners-reservation-region-picker-updown" style={S.chev}>
          {open ? <RiArrowDropUpFill size={30} /> : <RiArrowDropDownFill size={30} /> }
        </span>
      </button>

      {/* 폼 제출용 */}
      <input type="hidden" name={name} value={submitValue} />

      {/* 패널 */}
      {open && (
        <div
          className={`cleaners-reservation-region-panel ${activeRegion ? "is-split" : "is-left-only"}`}
          role="dialog"
          aria-label="지역 선택"
        >
          <div className={`cleaners-reservation-region-panel-body ${activeRegion ? "is-split" : "is-left-only"}`}>
            {/* LEFT */}
            <div className="cleaners-reservation-region-panel-left" style={S.leftCol} aria-label="지역 목록">
              {regionList.map((r) => {
                const total = (REGION[r] || []).length;
                const selectedCount = selectedCountByRegion[r] || 0;
                const isActive = r === activeRegion;

                return (
                  <button
                    key={r}
                    type="button"
                    className={`cleaners-reservation-region-left-item ${isActive ? "is-active" : ""}`}
                    onClick={() => changeRegionKeepScroll(r)}
                    style={{ ...S.leftItem, ...(isActive ? S.leftItemActive : null) }}
                  >
                    <span className="cleaners-reservation-region-left-item-text" style={S.leftText}>
                      {r}{" "}
                      <span className="cleaners-reservation-region-left-item-count" style={S.count}>
                        ({total})
                      </span>
                    </span>

                    {selectedCount > 0 && (
                      <span className="cleaners-reservation-region-left-item-badge" style={S.badge}>
                        {selectedCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* RIGHT */}
            {activeRegion ? (
              <div className="cleaners-reservation-region-panel-right" style={S.rightCol} aria-label="상세 지역 목록">
                <div className="cleaners-reservation-region-right-list" style={S.rightList} ref={rightListRef}>
                  {activeDetails.map((d) => {
                    const v = makeValue(activeRegion, d);
                    const checked = selected.includes(v);

                    return (
                      <label
                        key={v}
                        className={`cleaners-reservation-region-right-item ${checked ? "is-checked" : ""}`}
                        style={{
                          ...S.rightItem,
                          ...(checked ? S.rightItemChecked : null),
                        }}
                      >
                        <input
                          type="checkbox"
                          className="cleaners-reservation-region-right-checkbox"
                          checked={checked}
                          onChange={() => toggleDetail(activeRegion, d)}
                          style={S.checkbox}
                        />
                        <span className="cleaners-reservation-region-right-text" style={S.rightItemText}>
                          {d}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <div className="cleaners-reservation-region-panel-footer" style={S.footerBtns}>
            <button
              type="button"
              className="cleaners-reservation-region-panel-button cleaners-reservationregion-panel-button--ghost"
              onClick={clearAll}
              style={S.ghostBtn}
            >
              전체 해제
            </button>
            <button
              type="button"
              className="cleaners-reservation-region-panel-button cleaners-reservation-region-panel-button--primary"
              onClick={() => setOpen(false)}
              style={S.primaryBtn}
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

function LimitModal({ open, onClose }) {
  if (!open) return null;

  return createPortal(
    <div className="cleaners-reservation-modal-backdrop" 
    role="dialog" 
    aria-modal="true">
      <div className="cleaners-reservation-modal-box">
        <div className="cleaners-reservation-modal-text-button">
        <div className="cleaners-reservation-modal-text">
          작업 지역은 최대 {MAX}개까지 선택할 수 있어요.</div>
        <div className="cleaners-reservation-modal-button-row">
          <button 
          className="cleaners-reservation-modal-button" 
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

function ConfirmModal({ open, message, onClose, onConfirm }) {
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
      className="cleaners-reservation-last-modal-backdrop"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        // 바깥 클릭 닫기(원하면 제거 가능)
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="cleaners-reservation-last-modal-box">

        <div className="cleaners-reservation-modal-cancel-submit-text-button">
        <div className="cleaners-reservation-modal-text">
          {message}
        </div>

        <div className="cleaners-reservation-modal-button-row">
          <button
            className="cleaners-reservation-modal-button"
            type="button"
            onClick={onClose}
            style={{background: "var(--color-light-gray", borderRadius: "5px"}}
          >
            취소
          </button>

          <button
            className="cleaners-reservation-modal-button"
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


/* =========================
   STYLE OBJECTS
========================= */
const S = {
  profileImageWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  profileImageContainer: {
    position: "relative",
    width: "180px",
    height: "270px",
    cursor: "pointer",
    background: "#BBDCDD",
    display: "grid",
    placeItems: "center", 
    borderRadius: "5px"
  },
  profileImage: {
    width: "70%",
    height: "70%",
    objectFit: "cover",
  },
  editIcon: {
    position: "absolute",
    bottom: "5px",
    right: "5px",
    width: "30px",
    height: "30px",
    background: "#fff",
    borderRadius: "50%",
    padding: "5px",
    border: "1px solid var(--color-light-gray)",
  },
  wrap: { display: "flex", flexDirection: "column", flexWrap: "wrap" },
  topLabel: { fontSize: 16, marginBottom: 8 },

  trigger: {
    width: "100%",
    height: 43,
    border: "1px solid var(--color-gray)",
    borderRadius: 5,
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  triggerOpen: { border: "1px solid var(--color-gray)", borderRadius: 5 },
  chev: { fontSize: 12, opacity: 0.6 },

  tabs: { display: "grid", gridTemplateColumns: "1fr" },
  tabBtn: { height: 40, border: "none", background: "#ffffffff", cursor: "pointer", fontSize: 13, fontWeight: 700 },
  tabBtnActive: { background: "#fff" },

  leftCol: { borderRight: "1px solid #eeeeee", padding: 8, overflowY: "auto", maxHeight: 240 },
  rightCol: { padding: 10, overflow: "hidden" },

  leftItem: {
    width: "100%",
    border: "none",
    background: "transparent",
    textAlign: "center",
    padding: "10px 10px",
    borderRadius: 10,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "",
  },
  leftItemActive: { background: "var(--color-light-gray)" },
  leftText: { fontSize: 13, fontWeight: 700 },
  count: { fontWeight: 600, opacity: 0.55 },
  badge: {
    minWidth: 20,
    height: 20,
    padding: "6px",
    marginLeft: "6px",
    borderRadius: 999,
    background: "#111",
    color: "#fff",
    fontSize: 12,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },

  rightList: { border: "1px solid #eee", borderRadius: 12, padding: 8, maxHeight: 240, overflowY: "auto", width: "auto" },
  rightItem: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "9px 8px", borderRadius: 15, cursor: "pointer", width: "90px" },
  rightItemChecked: { background: "var(--color-light-gray)" },
  rightItemText: { fontSize: 13, fontWeight: 700, textAlign: "center", display: "flex", justifyContent: "center" },
  checkbox: { width: 14, height: 14, display: "none" },

  chipsEmpty: { fontSize: 12, opacity: 0.6, padding: "6px 2px" },
  chips: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  chip: { display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 10px", color: "var(--color-gray)", background: "#ffffffff" },
  chipText: { fontSize: 12, fontWeight: 800 },
  chipX: {
    width: 22,
    height: 22,
    borderRadius: 999,
    border: "none",
    background: "#fff",
    cursor: "pointer",
    fontSize: 16,
    lineHeight: "22px",
    padding: 0,
    opacity: 0.8,
  },

  footerBtns: { display: "flex", justifyContent: "space-around", alignItems: "center", padding: 10 },
  ghostBtn: {
    border: "1px solid #ffffffff",
    background: "#fff",
    borderRadius: 10,
    padding: "8px 10px",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 800,
  },
  primaryBtn: {
    border: "1px solid #ffffffff",
    background: "#ffffffff",
    color: "#000",
    borderRadius: 10,
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 900,
  },
};



/* =========================
   PAGE
========================= */
function CleanersRegistration() {
  const [files, setFiles] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("/icons/default-profile.png");
  const profileImageInput = useRef(null);


  function handleFileChange(e) {
    const selectedFiles = Array.from(e.target.files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setFiles(selectedFiles);
  }

  function handleProfileImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImageUrl(URL.createObjectURL(file));
    }
  }

  const onProfileImageClick = () => {
    if (profileImageInput.current) {
      profileImageInput.current.click();
    }
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState(null); // "cancel" | "save"

  const openCancelModal = () => {
  setConfirmType("cancel");
  setConfirmOpen(true);
  };

  const openSaveModal = () => {
  setConfirmType("save");
  setConfirmOpen(true);
};

  const closeConfirmModal = () => {
  setConfirmOpen(false);
  setConfirmType(null);
};

  const onConfirm = () => {
  if (confirmType === "cancel") {
    // TODO: 취소 확정 동작 (예: 뒤로가기, 페이지 이동, 상태 초기화 등)
    // navigate(-1) 여기서 처리
    closeConfirmModal();
    return;
  }

  if (confirmType === "save") {
    // TODO: 저장 확정 동작 (API 호출, submit 등)
    // handleSubmit() 여기서 호출
    closeConfirmModal();
    return;
  }

  closeConfirmModal();
  };



  return (
    <div className="all-container cleaners-reservation-container">
      <div className="cleaners-reservation-items-box">

        <div className="cleaners-reservation-title">
          <span>기사님 회원가입</span></div>
        
        <div className="cleaners-reservation-layout-center">
        <div className="cleaners-reservation-layout">
          

            {/* <form className="cleaners-reservation-form"> */}
          <div className="cleaners-reservation-layout-row">
            <div className="cleaners-reservation-profile-title"
                  style={S.profileImageWrap}>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={profileImageInput}
                  onChange={handleProfileImageChange}
                />
                <div style={S.profileImageContainer} onClick={onProfileImageClick}>
                  <img src={profileImageUrl} alt="Profile" style={S.profileImage} />
                  <img src="/icons/edit-icon.png" alt="Edit" style={S.editIcon} />
                </div>
              </div>

            <div className="cleaners-reservationprofile">

              <div className="cleaners-reservation-layout-flex-column">
                <label htmlFor="name">이름</label>
                <input className="cleaners-reservation-input cleaners-reservation-name" id="name" name="name" value="&nbsp;&nbsp;&nbsp;김기사" readOnly/>
              </div>

              <div className="cleaners-reservation-layout-flex-column">
                <label htmlFor="gender">성별</label>
                <input className="cleaners-reservation-input cleaners-reservation-gender" id="gender" name="gender" value="&nbsp;&nbsp;&nbsp;남성" readOnly/>
                <input className="cleaners-reservation-input cleaners-reservation-gender" id="gender" name="gender" value="&nbsp;&nbsp;&nbsp;여성" readOnly/>
              </div>

              <div className="cleaners-reservation-layout-flex-column">
                <label htmlFor="email">이메일</label>
                <input className="cleaners-reservation-input cleaners-reservation-email" id="email" name="email" value="&nbsp;&nbsp;&nbsp;kimkisa@cleaner.com" readOnly/>
              </div>

              <div className="cleaners-reservation-layout-flex-column">
                <label htmlFor="tagline">한 줄 소개</label>
                <input className="cleaners-reservation-input cleaners-reservation-tagline" id="tagline" name="tagline" value="&nbsp;&nbsp;&nbsp;15년 경력의 믿음직한 제빙기 청소기사 김기사입니다." readOnly/>
              </div>

              <div className="cleaners-reservation-layout-flex-column">
                <RegionPickerDropdown name="workAreas" label="작업 지역" labelStyle={{ fontSize: "18px" }}/>
              </div>

              <div className="cleaners-reservation-layout-flex-column">
                <label htmlFor="career">경력</label>
                <input className="cleaners-reservation-input cleaners-reservation-career" id="career" name="career" value="&nbsp;&nbsp;&nbsp;15년" readOnly/>
              </div>


            <div className="cleaners-reservation-attachment">  
              <label className="cleaners-reservation-attachment-button" htmlFor="file">업로드</label>
              <input
                className="cleaners-reservation-attachment-input"
                type="file"
                id="file"
                name="file"
                accept=".jpg,.jpeg,.png"
                multiple
                onChange={handleFileChange}
              />
            
              <ul className="cleaners-registration-ul-title">
                {files.map((file, idx) => (
                  <li className="cleaners-registration-li-contents" key={idx}>
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      {file.name}
                    </a>
                  </li>
                ))}
              </ul>

              <span className="cleaners-reservation-file-hint">
                ※jpg, jpeg, png 파일만 첨부 가능합니다.
                <br />
                &nbsp;&nbsp;&nbsp;관리자 제출용입니다.
              </span>

              <span className="cleaners-reservation-buttons">
                <button type="button" className="cleaners-reservation-button-small-custom2" onClick={openCancelModal} >취소</button>
                <button type="submit" className="cleaners-reservation-button-small-custom2" onClick={openSaveModal} >완료</button>
              </span>
            {/* </form> */}
            </div>
            </div>     
          </div>


          </div>

         </div>
      </div>
       
     <ConfirmModal
      open={confirmOpen}
      message={
        confirmType === "cancel" ? (
          <>
            수정 내용이 삭제됩니다.
            <br />
            작성을 취소하시겠습니까?
          </>
          ) : (
            <>
              정보를 수정하시겠습니까?
            </>
          )
        }
        onClose={closeConfirmModal}
        onConfirm={onConfirm}
      />    
<input type="radio" name="test" />
    </div>
  );
}

export default CleanersRegistration;

