import { useMemo, useState } from "react";
import "./CleanersQuotationsPreparationSave.css";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoIosClose } from "react-icons/io";

const SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "price_desc", label: "금액 높은순" },
  { value: "price_asc", label: "금액 낮은순" },
];

function money(n) {
  return n.toLocaleString("ko-KR");
}

// 부모로부터 onSelect prop을 전달받음
export default function CleanersQuotationsPreparationSave({ onSelect }) {
  const [sort, setSort] = useState("latest");
  const [templates, setTemplates] = useState([
    {
      id: 1,
      createdAt: new Date().toISOString(),
      price: 150000,
      desc: "기본 제빙기 청소 패키지입니다.",
      saved: true,
      collapsed: false,
    }
  ]);

  const [editingId, setEditingId] = useState(null);

  // 값 변경 핸들러
  function onChangeTemplate(id, field, value) {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  }

  function handleCardClick(id) {
    if (editingId !== id) setEditingId(id);
  }

  function onFinishEdit() {
    setEditingId(null);
  }

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
    const id = "t" + Date.now();
    setTemplates((prev) => [
      {
        id,
        createdAt: new Date().toISOString(),
        price: 0,
        desc: "새 템플릿 설명을 입력하세요...",
        saved: false,
        collapsed: false,
      },
      ...prev,
    ]);
  }

  function onTempSave(id) {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, saved: true } : t)));
    alert("템플릿이 임시 저장되었습니다.");
  }

  // 핵심 수정 부분: 부모에게 데이터를 전달하는 함수
  function onApplyNow(tpl) {
    if (onSelect) {
      // 부모 컴포넌트의 estimates 테이블 필드명(estimated_amount)에 맞춰 데이터 가공
      onSelect({
        estimated_amount: tpl.price,
        description: tpl.desc
      });
    }
  }

  function onDelete(id) {
    if(window.confirm("템플릿을 삭제하시겠습니까?")) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    }
  }

  return (
    <div className="all-container cleaners-quotations-preparation-save-container">
      <div className="cleaners-quotations-preparation-save-wrapper">
        <span className="cleaners-quotations-preparation-save-title">자주 쓰는 견적서 양식</span>

        <div className="cleaners-quotations-preparation-save-row">
          <label className="cleaners-quotations-preparation-save-sort">
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        </div>

        <section className="qt-list-section">
          {sortedTemplates.map((t) => {
            const isEditing = editingId === t.id;
            return (
              <div 
                className={`cleaners-quotations-preparation-save-card ${isEditing ? 'is-editing' : ''}`} 
                key={t.id}
                onClick={() => handleCardClick(t.id)}
              >
                <div className="cleaners-quotations-preparation-save-card-grid">
                  <div className="cleaners-quotations-preparation-save-label-col">
                    <div className="cleaners-quotations-preparation-save-label">견적 금액</div>
                    <div className="cleaners-quotations-preparation-save-label">견적 설명</div>
                  </div>

                  <div className="qt-value-col">
                    <div className="qt-price">
                      {isEditing ? (
                        <input
                          type="number"
                          className="edit-input-price"
                          value={t.price}
                          onChange={(e) => onChangeTemplate(t.id, "price", Number(e.target.value))}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <>{money(t.price)} <span className="qt-won">원</span></>
                      )}
                    </div>

                    <div className={`qt-desc ${t.collapsed ? "is-collapsed" : ""}`}>
                      {isEditing ? (
                        <textarea
                          className="edit-textarea-desc"
                          value={t.desc}
                          onChange={(e) => onChangeTemplate(t.id, "desc", e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        t.desc
                      )}
                    </div>
                    
                    {isEditing && (
                      <button className="edit-done-btn" onClick={(e) => {
                        e.stopPropagation();
                        onFinishEdit();
                      }}>
                        수정 완료
                      </button>
                    )}

                    {!isEditing && t.saved && <div className="qt-saved-badge">임시저장됨</div>}
                  </div>

                  <div className="qt-action-col" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="qt-link-btn" onClick={() => onTempSave(t.id)}>
                      저장
                    </button>
                    <button type="button" className="qt-apply-btn" onClick={() => onApplyNow(t)}>
                      바로 적용
                    </button>
                    <button type="button" className="qt-del-btn" onClick={() => onDelete(t.id)}>
                      <IoIosClose size={30} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <button type="button" className="qt-add-card" onClick={onAddTemplate}>
            <IoMdAddCircleOutline size={30} />
            <div className="qt-add-text">
              <div className="qt-add-title">반복되는 견적 입력은 이제 그만!</div>
              <div className="qt-add-sub">상황별 양식을 저장해 업무 시간을 단축해 보세요.</div>
            </div>
          </button>
        </section>
      </div>

      <button className="qt-fab" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        ^
      </button>
    </div>
  );
}