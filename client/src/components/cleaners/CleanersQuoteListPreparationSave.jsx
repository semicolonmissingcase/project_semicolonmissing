import { useMemo, useState } from "react";
import "./CleanersQuoteListPreparationSave.css";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoIosClose } from "react-icons/io";

/**
 * 스샷 요구사항
 * - 상단 네비 + 우측 원형 기사님 사진
 * - 타이틀: 자주 쓰는 견적서 양식
 * - 정렬 드롭다운(최신순)
 * - 템플릿 0개: + 안내 카드만
 * - 템플릿 있으면: 템플릿 카드(견적금액/설명/임시저장/바로적용/접기)
 * - 항상 아래에 + 안내 카드(새로 추가)
 *
 * 동작(프론트 기준)
 * - [+] 클릭 -> 새 템플릿 생성(모달/페이지로 연결) : 여기서는 간단 입력으로 생성
 * - [임시저장] -> 해당 템플릿 saved=true (서버 PUT 연결 자리)
 * - [바로 적용] -> 선택된 템플릿을 “현재 견적 작성 폼”에 주입 (콜백 자리)
 * - [ - ](접기) -> 설명 한 줄로 줄이기
 */

const SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "price_desc", label: "금액 높은순" },
  { value: "price_asc", label: "금액 낮은순" },
];

const seedTemplates = [
  {
    id: "t1",
    createdAt: "2025-12-28T10:10:00+09:00",
    price: 150000,
    desc: "1n년 경력의 신뢰와 실력으로 검증 받는 제빙기 청소 서비스입니다. 내/외부 분해세척, 살균, 배수라인 점검 포함...",
    saved: false,
    collapsed: false,
  },
];

function money(n) {
  return n.toLocaleString("ko-KR");
}

export default function CleanersQuoteListPreparationSave() {
  const [sort, setSort] = useState("latest");

  const [templates, setTemplates] = useState([]);

  const sortedTemplates = useMemo(() => {
    const arr = [...templates];
    if (sort === "latest") {
      arr.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    } else if (sort === "price_desc") {
      arr.sort((a, b) => b.price - a.price);
    } else if (sort === "price_asc") {
      arr.sort((a, b) => a.price - b.price);
    }
    return arr;
  }, [templates, sort]);

  function onAddTemplate() {
    // 실제 서비스에서는 모달/작성 페이지로 이동하는 게 자연스러움.
    // 여기서는 “바로 생성” 더미.
    const id = "t" + Date.now();
    setTemplates((prev) => [
      {
        id,
        createdAt: new Date().toISOString(),
        price: 150000,
        desc: "새 템플릿 설명을 입력하세요...",
        saved: false,
        collapsed: false,
      },
      ...prev,
    ]);
  }

  function onToggleCollapse(id) {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, collapsed: !t.collapsed } : t))
    );
  }

  function onTempSave(id) {
    // 서버라면: PATCH /templates/:id { saved:true }
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, saved: true } : t)));
  }

  function onApplyNow(tpl) {
    // 여기서 “견적 작성 폼”으로 전달
    // ex) props.onApplyTemplate(tpl) or navigate("/quote/new", { state: tpl })
    console.log("apply template:", tpl);
    alert(`바로 적용: ${money(tpl.price)}원 / ${tpl.desc.slice(0, 20)}...`);
  }

  function onDelete(id) {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="all-container cleaners-quote-list-preparation-save-container">

      <div className="cleaners-quote-list-preparation-save-wrapper">
        <span className="cleaners-quote-list-preparation-save-title">자주 쓰는 견적서 양식</span>

        {/* Sort */}
        <div className="cleaners-quote-list-preparation-save-row">
          <label className="cleaners-quote-list-preparation-save-sort">
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <section>
          {/* 템플릿 리스트 */}
          {sortedTemplates.map((t) => (
            <div className="cleaners-quote-list-preparation-save-card" key={t.id}>
              <div className="cleaners-quote-list-preparation-save-card-grid">
                {/* left labels */}
                <div className="cleaners-quote-list-preparation-save-label-col">
                  <div className="cleaners-quote-list-preparation-save-label">견적 금액</div>
                  <div className="cleaners-quote-list-preparation-save-label">견적 설명</div>
                </div>

                {/* values */}
                <div className="qt-value-col">
                  <div className="qt-price">
                    {money(t.price)} <span className="qt-won">원</span>
                  </div>

                  <div className={`qt-desc ${t.collapsed ? "is-collapsed" : ""}`}>
                    {t.desc}
                  </div>

                  {t.saved && <div className="qt-saved-badge">임시저장됨</div>}
                </div>

                {/* actions */}
                <div className="qt-action-col">
                  <button
                    type="button"
                    className="qt-link-btn"
                    onClick={() => onTempSave(t.id)}
                  >
                    임시저장
                  </button>

                  <button
                    type="button"
                    className="qt-apply-btn"
                    onClick={() => onApplyNow(t)}
                  >
                    바로 적용
                  </button>

                  {/* (선택) 삭제 */}
                  <button
                    type="button"
                    className="qt-del-btn"
                    onClick={() => onDelete(t.id)}
                    title="삭제"
                    aria-label="삭제"
                  >
                    <IoIosClose size={30} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* 항상 있는 “추가 카드” */}
          <button type="button" className="qt-add-card" onClick={onAddTemplate}>
            <IoMdAddCircleOutline size={30} />
            <div className="qt-add-text">
              <div className="qt-add-title">반복되는 견적 입력은 이제 그만!</div>
              <div className="qt-add-sub">
                상황별 양식을 저장해 업무 시간을 단축해 보세요.
              </div>
            </div>
          </button>
        </section>
      </div>

      <button className="qt-fab" type="button" title="맨 위로" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        ^
      </button>
    </div>
  );
}
