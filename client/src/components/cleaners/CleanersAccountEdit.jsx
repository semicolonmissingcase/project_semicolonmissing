import { useState, useEffect } from "react";
import { CleanersModalConfirmModal } from "./cleaners-modal/CleanersModalConfirmModal.jsx";
import { useDispatch, useSelector } from "react-redux";
import { clearCleaners } from "../../../src/store/slices/cleanersSlice.js";
import cleanersThunk from "../../store/thunks/cleanersThunk.js";
import { IoMdAddCircleOutline } from "react-icons/io";
import { RiArrowDropDownFill, RiArrowDropUpFill } from "react-icons/ri";
import { FaRegTrashCan } from "react-icons/fa6";
import './CleanersAccountEdit.css';
import banksThunk from "../../store/thunks/banksThunk.js";

function CleanerAccountEdit() {
  const dispatch = useDispatch();
  const { bankList } = useSelector(state => state.banks);
  const [toggleNew, setToggleNew] = useState(true);
  const [toggleInfo, setToggleInfo] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState("");
  const { account } = useSelector((state) => state.cleaners);

  // 계좌 정보 작성 및 수정용 state
  const [accountInfo, setAccountInfo] = useState({
    id: '',
    cleanerId: '',
    bankCode: '',
    depositor: '',
    accountNumber: '',
  });

  // 1. 초기 로드: 컴포넌트가 켜질 때 계좌 정보 조회
  useEffect(() => {
    dispatch(cleanersThunk.fetchAccounts()); // 계좌 조회
    dispatch(banksThunk.getBanksThunk());
    return () => dispatch(clearCleaners());
  }, [dispatch]);

  useEffect(() => {
    function init() {
      const newAccountInfo = {
        id: account.id,
        cleanerId: account.cleanerId,
        bankCode: account.bankCode,
        depositor: account.depositor,
        accountNumber: account.accountNumber,
      };
  
      setAccountInfo(newAccountInfo);
    }

    if(account) init();
  }, [account]);

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
    console.log(name, value);
    setAccountInfo((prev) => ({ ...prev, [name]: value }));
  };

  const openSaveModal = (e) => {
    e.preventDefault();
    setConfirmType("save");
    setConfirmOpen(true);
  };

  //  핸들러 함수들
  const toggleMenuNew = () => setToggleNew(!toggleNew);
  const toggleMenuInfo = () => setToggleInfo(!toggleInfo);

  async function handleDelete() {
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
                        {account ? "계좌 정보 수정하기" : "신규 정산 계좌 추가"}
                      </span>
                    </div>
                    {account ? (
                      <p className="cleaners-account-edit-account-message">
                        현재 등록된 계좌: <br /> <strong>{account?.bank?.name} {account.accountNumber} {account.depositor}</strong>
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
                        <option value="options" defaultValue>계좌를 선택해 주세요.</option>
                        {
                          bankList && bankList.map(item => <option value={item.code}>{item.name}</option>)
                        }
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