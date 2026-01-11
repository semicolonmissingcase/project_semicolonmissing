import { useState, useEffect } from "react";
import { CleanersModalConfirmModal } from "./cleaners-modal/CleanersModalConfirmModal.jsx";
import { useDispatch, useSelector } from "react-redux";
import { clearCleaners } from "../../../src/store/slices/cleanersSlice.js";
import cleanersThunk from "../../store/thunks/cleanersThunk.js";
import { IoMdAddCircleOutline } from "react-icons/io";
import { RiArrowDropDownFill, RiArrowDropUpFill } from "react-icons/ri";
import { FaRegTrashCan } from "react-icons/fa6";
import './CleanersAccountEdit.css';

function CleanerAccountEdit() {
  const dispatch = useDispatch();

  const [toggleNew, setToggleNew] = useState(true);
  const [toggleInfo, setToggleInfo] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState("");
  const { accounts, cleanerId } = useSelector((state) => state.cleaners);

  const [accountInfo, setAccountInfo] = useState({
    id: '',
    cleanerId: '',
    bankCode: '',
    depositor: '',
    accountNumber: '',
    isDefault: false
  });

  // 1. 초기 로드: 컴포넌트가 켜질 때 계좌 정보 조회
  useEffect(() => {
    dispatch(cleanersThunk.fetchAccounts());
    return () => dispatch(clearCleaners());
  }, [dispatch]);

  // 2. Redux에 데이터가 들어오면 로컬 state 업데이트
  useEffect(() => {
    if (Array.isArray(accounts) && accounts.length > 0) {
      const acc = accounts[0];
      setAccountInfo({
        id: acc.id || '',
        bankCode: acc.bankCode || acc.bank_code || '',
        accountNumber: acc.accountNumber || acc.account_number || '',
        depositor: acc.depositor || '',
        isDefault: acc.isDefault || acc.is_default || true
      });
    } else {
      // 데이터가 없는 경우 초기화
      setAccountInfo({ id: '', bankCode: '', depositor: '', accountNumber: '', isDefault: true });
    }
  }, [accounts]);

  // 3. 공통 확인 모달 처리 로직
  const onConfirm = async () => {
    if (confirmType === "save") {
      try {
        const payload = {
          bankCode: accountInfo.bankCode,
          depositor: accountInfo.depositor,
          accountNumber: accountInfo.accountNumber,
          isDefault: true
        };

        // 기존 ID 여부에 따라 처리 (saveAccount Thunk 하나로 통합된 경우)
        if (accountInfo.id) {
          await dispatch(cleanersThunk.saveAccount({ ...payload, id: accountInfo.id })).unwrap();
        } else {
          await dispatch(cleanersThunk.saveAccount(payload)).unwrap();
        }

        alert("저장되었습니다.");
        setIsEditing(false);
        dispatch(cleanersThunk.fetchAccounts()); // 최신 데이터 다시 불러오기
      } catch (error) {
        alert(error || "저장에 실패했습니다.");
      }
    } else if (confirmType === "delete") {
      try {
        await dispatch(cleanersThunk.deleteAccount()).unwrap();
        alert("삭제되었습니다.");
        setIsEditing(false);
        dispatch(cleanersThunk.fetchAccounts());
      } catch (error) {
        alert(error || "삭제에 실패했습니다.");
      }
    }
    setConfirmOpen(false);
  };

  // 4. 이벤트 핸들러들
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountInfo((prev) => ({ ...prev, [name]: value }));
  };

  const openSaveModal = (e) => {
    e.preventDefault();
    setConfirmType("save");
    setConfirmOpen(true);
  };

  const openDeleteModal = (e) => {
    e.stopPropagation(); // 부모 클릭 이벤트 전파 방지
    setConfirmType("delete");
    setConfirmOpen(true);
  };


  //  핸들러 함수들
  const toggleMenuNew = () => setToggleNew(!toggleNew);
  const toggleMenuInfo = () => setToggleInfo(!toggleInfo);

  const openCancelModal = () => {
    setConfirmType("cancel");
    setConfirmOpen(true);
  };

  async function handleCancel() {
    try {
      //  사용자에게 확인
      if (!window.confirm("수정을 취소하시겠습니까? 입력한 내용은 저장되지 않습니다.")) {
        return;
      }

      //   입력 필드 초기화
      setAccountInfo({
        bankCode: '',
        accountNumber: '',
        depositor: '',
        isDefault: false
      });

      //  편집 모드 종료
      setIsEditing(false);

    } catch (error) {
      console.error("취소 처리 중 에러:", error);
    }
  }

  async function handleDelete(accountId) {
    try {
      //  삭제 확인
      if (!window.confirm("정말로 이 계좌 정보를 삭제하시겠습니까?")) {
        return;
      }

      //  삭제 Thunk 실행
      await dispatch(cleanersThunk.deleteAccount(accountInfo.cleanerId)).unwrap();

      alert("삭제가 완료되었습니다.");

      //  목록 새로고침
      dispatch(cleanersThunk.fetchAccounts(accountInfo.cleanerId));

      //  입력창 닫기
      setIsEditing(false);

    } catch (error) {
      console.error("삭제 실패:", error);
      alert(error || "삭제에 실패했습니다.");
    }
  }

  // 계좌 번호 하이픈 붙이기

  const formatAccountNumber = (bankCode, accountNumber) => {
    if (!accountNumber) return "";
    const pureNumber = accountNumber.replace(/[^0-9]/g, "");

    switch (bankCode) {
      case "신한은행": return pureNumber.replace(/(\d{3})(\d{3})(\d{6,})/, "$1-$2-$3");
      case "KB국민은행": return pureNumber.replace(/(\d{6})(\d{2})(\d{6,})/, "$1-$2-$3");
      case "우리은행": return pureNumber.replace(/(\d{4})(\d{3})(\d{6,})/, "$1-$2-$3");
      case "카카오뱅크": return pureNumber.replace(/(\d{4})(\d{2})(\d{7,})/, "$1-$2-$3");
      case "KEB하나은행": return pureNumber.replace(/(\d{3})(\d{6})(\d{5,})/, "$1-$2-$3");
      case "NH농협": return pureNumber.replace(/(\d{3})(\d{4})(\d{4})(\d{2,})/, "$1-$2-$3-$4");
      default: return pureNumber.replace(/(\d{3})(\d{4})(\d{4,})/, "$1-$2-$3");
    }
  };

  // -------------------- 이벤트 핸들러 --------------------
  const handleSave = () => {
    const payload = {
      cleanerId: cleanerId,
      accountData: {
        bankCode: accountInfo.bankCode,
        accountNumber: accountInfo.accountNumber,
        depositor: accountInfo.depositor,
        isDefault: true
      }
    };

    dispatch(cleanersThunk.createAccount(payload));
  };

  // -------------------- 데이터 업데이트 로직 --------------------
  async function onUpdate() {
    try {
      const payload = {
        cleanerId: cleanerId,
        updateData: {
          id: accountInfo.id,
          bankCode: accountInfo.bankCode,
          accountNumber: accountInfo.accountNumber,
          depositor: accountInfo.depositor,
          isDefault: true
        }
      };

      await dispatch(cleanersThunk.saveAccount(payload)).unwrap();
      alert("수정 성공!");
    } catch (error) {
      alert("수정 실패: " + error);
    }
  }

  // -------------------- JSX 렌더링 --------------------
  return (
    <div className="all-container cleaners-account-edit-wrapper">
      {loading && <div className="loading-overlay">데이터를 불러오는 중...</div>}

      <div className="cleaners-account-edit-account-management">
        <div className="cleaners-account-edit-add-account-wrapper">
          <div className="cleaners-account-edit-account-management-title" onClick={toggleMenuNew} style={{ cursor: 'pointer' }}>
            <button type="button">
              {toggleNew ? <RiArrowDropDownFill size={30} /> : <RiArrowDropUpFill size={30} />}
            </button>
            <p className="cleaners-account-edit-new-account-message">정산 계좌 설정</p>
          </div>

          <div className={toggleNew ? "cleaners-account-edit-toggle-updown-new-contents" : "cleaners-account-edit-toggle-updown-new-contents-closed"}>
            <div className="cleaners-account-edit-form-edit">
              {!isEditing ? (
                <div className="cleaners-account-edit-new-account-title-wrapper" onClick={() => setIsEditing(true)} style={{ cursor: 'pointer' }}>
                  <div className="cleaners-account-edit-add-button">
                    <div className="cleaners-account-edit-add-button-text">
                      <IoMdAddCircleOutline size={20} />
                      <span className="cleaners-account-edit-new-accounts">
                        {accountInfo.accountNumber ? "계좌 정보 수정하기" : "신규 정산 계좌 추가"}
                      </span>
                    </div>
                    {accountInfo.accountNumber ? (
                      <p className="cleaners-account-edit-account-message">
                        현재 등록된 계좌: <br /> <strong>{accountInfo.bankCode} {formatAccountNumber(accountInfo.bankCode, accountInfo.accountNumber)} {accountInfo.depositor}</strong>
                      </p>
                    ) : (
                      <p className="cleaners-account-edit-account-message">정산에 사용할 계좌를 등록해 주세요.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="cleaners-account-edit-form-wrapper">
                  <form className="cleaners-account-edit-form" onSubmit={openSaveModal}>
                    <span className="cleaners-account-edit-remove-layout">
                      <label className="cleaners-account-edit-account-title">정산 계좌 정보 입력</label>
                      <FaRegTrashCan size={20} onClick={handleDelete} />
                    </span>

                    <span className="cleaners-account-edit-layout-inputs">
                      <label>은행</label>
                      <select
                        className="cleaners-account-edit-input-layout"
                        name="bankCode"
                        value={accountInfo.bankCode || ""}
                        onChange={handleInputChange}
                        required>
                        <option value="options" defaultValue disabled hidden>계좌를 선택해 주세요.</option>
                        <option value="우리은행">우리은행</option>
                        <option value="KB국민은행">국민은행</option>
                        <option value="신한은행">신한은행</option>
                        <option value="카카오뱅크">카카오뱅크</option>
                        <option value="KEB하나은행">KEB하나은행</option>
                        <option value="iM뱅크">iM뱅크</option>
                        <option value="NH농협">NH농협</option>
                        <option value="SH수협은행">SH수협은행</option>
                      </select>

                      <label>계좌번호</label>
                      <input
                        className="cleaners-account-edit-input-layout"
                        name="accountNumber"
                        placeholder="'-' 없이 입력"
                        value={accountInfo.accountNumber || ""}
                        onChange={handleInputChange}
                        maxLength={20}
                      />

                      <label>예금주</label>
                      <input
                        className="cleaners-account-edit-input-layout"
                        name="depositor"
                        value={accountInfo.depositor || ""}
                        onChange={handleInputChange}
                        maxLength={20}
                      />
                    </span>

                    <div className="cleaners-account-edit-button">
                      <button className="cleaners-account-edit-cancel-button" type="button" onClick={() => setIsEditing(false)}>취소</button>
                      <button className="cleaners-account-edit-submit-button" type="submit">저장</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="cleaners-account-edit-account-info">
        <div className="cleaners-account-edit-info-account">
          <div className="cleaners-account-edit-account-info-title" onClick={toggleMenuInfo} style={{ cursor: 'pointer' }}>
            <button type="button">
              {toggleInfo ? <RiArrowDropUpFill size={30} /> : <RiArrowDropDownFill size={30} />}
            </button>
            <p className="cleaners-account-edit-account-info-message">정산 기준 안내</p>
          </div>
          {toggleInfo && (
            <div className="cleaners-account-edit-account-settlement-criteria-guide">
              <p>- 매주 월요일에 전주 작업분이 정산됩니다.</p>
              <p>- 정산일이 공휴일인 경우 전일에 지급됩니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 공통 확인 모달 */}
      <CleanersModalConfirmModal
        open={confirmOpen}
        message={
          confirmType === "delete"
            ? "정말로 계좌 정보를 삭제하시겠습니까?"
            : "계좌 정보를 저장하시겠습니까?"
        }
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirm}
      />
    </div>
  );
}

export default CleanerAccountEdit;