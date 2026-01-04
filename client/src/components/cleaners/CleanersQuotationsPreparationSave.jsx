import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux"; // 1. 추가
import cleanersThunk from "../../store/thunks/cleanersThunk.js"; // Thunk 경로 확인
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import "./CleanersQuotationsPreparationSave.css";

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
  const dispatch = useDispatch();
  const [sort, setSort] = useState("latest");
  
  
  // 1. Redux 데이터 구독
  const reduxTemplates = useSelector((state) => state.cleaners.templates);

  // 2. Redux 데이터가 변경될 때마다 로컬 state 업데이트
  useEffect(() => {
    if (reduxTemplates && reduxTemplates.length > 0) {
      // 서버 필드명(estimatedAmount, description) 그대로 사용
      setTemplates(reduxTemplates);
    }
  }, [reduxTemplates]); // reduxTemplates가 바뀌면 실행

  
  // 편집 중인 상태를 관리하기 위한 로컬 state (이건 유지해도 좋습니다)
  const [templates, setTemplates] = useState([]);

  // 3. Redux 데이터가 변경될 때 로컬 state 동기화 (편집을 위해)
  useEffect(() => {
    if (reduxTemplates) {
      setTemplates(reduxTemplates);
    }
  }, [reduxTemplates]);

  // 4. 저장 버튼 클릭 시 Redux Thunk 호출 (서버 저장)
  function onTempSave(tpl) {
    // 예: 서버에 저장하는 thunk가 있다고 가정
    dispatch(cleanersThunk.saveTemplateThunk(tpl))
      .unwrap()
      .then(() => alert("서버에 저장되었습니다."))
      .catch(() => alert("저장 실패"));
  }

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
    onSelect({
      estimatedAmount: tpl.estimatedAmount, // 필드명 수정
      description: tpl.description           // 필드명 수정
    });
    }
  } 

  // [참고] 데이터 변경 시 Number 처리 확인
  function onChangeTemplate(id, field, value) {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
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

        <section className="cleaners-quotations-preparation-save-list-section">
        {sortedTemplates.map((t) => {
          const isEditing = editingId === t.id;
          return (
            <div 
              className={`cleaners-quotations-preparation-save-card ${isEditing ? 'is-editing' : ''}`} 
              key={t.id} // Key가 제대로 들어가 있는지 확인
              onClick={() => handleCardClick(t.id)}
            >
              <div className="cleaners-quotations-preparation-save-card-grid">
                <div className="cleaners-quotations-preparation-save-label-col">
                  <div className="cleaners-quotations-preparation-save-label">견적 금액</div>
                  <div className="cleaners-quotations-preparation-save-label">견적 설명</div>
                </div>

                <div className="cleaners-quotations-preparation-save-value-col">
                  <div className="cleaners-quotations-preparation-save-price">
                    {isEditing ? (
                      <input
                        type="number"
                        className="edit-input-price"
                        value={t.estimatedAmount ?? ""} // nullish coalescing 사용
                        onChange={(e) => onChangeTemplate(t.id, "estimatedAmount", Number(e.target.value))}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <>{money(t.estimatedAmount || 0)} <span className="cleaners-quotations-preparation-save-won">원</span></>
                    )}
                  </div>

                  <div className={`cleaners-quotations-preparation-save-desc ${t.collapsed ? "is-collapsed" : ""}`}>
                    {isEditing ? (
                      <textarea
                        className="edit-textarea-description"
                        value={t.description || ""} // 빈 값 처리
                        onChange={(e) => onChangeTemplate(t.id, "desccription", e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      t.description
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

                    {!isEditing && t.saved && <div className="cleaners-quotations-preparation-save-saved-badge">임시저장됨</div>}
                  </div>

                  <div className="cleaners-quotations-preparation-save-action-col" onClick={(e) => e.stopPropagation()}>
                  <button type="button" className="cleaners-quotations-preparation-save-link-btn" onClick={() => onTempSave(t.id)}>저장</button>
                  <button type="button" className="cleaners-quotations-preparation-save-apply-btn" onClick={() => onApplyNow(t)}>바로 적용</button>
                  <button type="button" className="cleaners-quotations-preparation-save-del-btn" onClick={() => onDelete(t.id)}>
                    <IoIosClose size={30} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

          <button type="button" className="cleaners-quotations-preparation-save-add-card" onClick={onAddTemplate}>
            <IoMdAddCircleOutline size={30} />
            <div className="cleaners-quotations-preparation-save-add-text">
              <div className="cleaners-quotations-preparation-save-add-title">반복되는 견적 입력은 이제 그만!</div>
              <div className="cleaners-quotations-preparation-save-add-sub">상황별 양식을 저장해 업무 시간을 단축해 보세요.</div>
            </div>
          </button>
        </section>
      </div>

      <button className="cleaners-quotations-preparation-save-fab" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        ^
      </button>
    </div>
  );
}