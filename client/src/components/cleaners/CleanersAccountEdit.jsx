import { CleanersModalConfirmModal } from "./cleaners-modal/CleanersModalConfirmModal.jsx";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "axios";
import cleanersThunk from "../../store/thunks/cleanersThunk.js";
import { clearCleaners } from "../../store/slices/cleanersSlice.js";
import './CleanersAccountEdit.css';
import { IoMdAddCircleOutline } from "react-icons/io";
import { RiArrowDropDownFill } from "react-icons/ri";
import { RiArrowDropUpFill } from "react-icons/ri";
import { FaRegTrashCan } from "react-icons/fa6";

function CleanerAccountEdit () {

    const [selectAddAccount, setSelectAddAccount] = useState(false); // <--- Line 74였던 이 부분을 위로 올립니다.
    const [accountData, setAccountData] = useState({
        bank: '',
        accountNumber: '',
        depositor: ''
    });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
  async function init() {
    const result = await dispatch(
      cleanersThunk.accountInfoThunk(params.id)
    );

    if (result.type.endsWith("/rejected")) {
      alert("정보 획득 실패");
      return;
    }

    const data = result.payload.data;

    setAccountData({
      bank: data.bank ?? "",
      accountNumber: data.accountNumber ?? "",
      depositor: data.depositor ?? "",
    });
  }

  init();

  return () => {
    dispatch(clearCleaners());
  };
  }, [dispatch, params.id, navigate]);


  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountData(prev => ({ ...prev, [name]: value }));
  };

  // 저장 로직 (Modal의 onConfirm 내부에서 호출)
  const handleSave = async () => {
    try {
      await axios.post("/api/adjustments/update", accountData);
      alert("저장되었습니다.");
      closeConfirmModal();
    } catch (err) {
      alert("저장 실패");
    }
  };

  // ✅ Redux Store에서 데이터 및 상태 가져오기
    const { accountInfo, loading, error } = useSelector(state => state.cleaners);

    // useEffect 로직 수정
    useEffect(() => {
        dispatch(cleanersThunk.accountInfoThunk(params.id));

        // 클린업 함수는 그대로 유지
        return () => {
            dispatch(clearCleaners());
        };
    }, [dispatch, params.id]); // navigate 의존성은 필요 없을 수 있습니다.

    // ✅ accountInfo가 로드되거나 변경될 때만 accountData 업데이트
    useEffect(() => {
        if (accountInfo) {
            setAccountData({
                bank: accountInfo.bank ?? "",
                accountNumber: accountInfo.accountNumber ?? "",
                depositor: accountInfo.depositor ?? "",
            });
        }
    }, [accountInfo]); // accountInfo가 변경될 때만 실행

    // 로딩 및 에러 처리 (인증 오류가 Redux에 rejected로 잡힐 경우)
    if (loading) {
        return <div className="loading">계좌 정보를 불러오는 중입니다...</div>;
    }

    if (error) {
        // 서버에서 인증 오류를 반환했을 때 (401), Redux Thunk가 rejectWithValue로 잡았을 경우
        // alert(`정보 획득 실패: ${error}`); 
        // navigate(-1); 
        return <div className="error-message">계좌 정보를 불러오는 데 실패했습니다.</div>;
    }

  const [toggleNew, setToggleNew] = useState(false);
  const [toggleInfo, setToggleInfo] = useState(false);

  const toggleMenuNew = () => {

    setToggleNew(!toggleNew)

  };

  const toggleMenuInfo = () => {

    setToggleInfo(!toggleInfo)

  };

  const toggleAddAccount = (e) => {
  e.stopPropagation();           // 바깥 토글로 클릭 전파 방지
  setSelectAddAccount(prev => !prev);
  };

  const [selectRemoveAccount, setSelectRemoveAccount] = useState(false);

  const handleRemoveAccount = (e) => {
  e.stopPropagation();     // 상위 토글 영향 방지
  setSelectRemoveAccount(true);
  setSelectAddAccount(false);
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

    <>

    <div className="all-container cleaners-account-edit-wrapper">

    <div className="cleaners-account-edit-account-management">
        
        <div className="cleaners-account-edit-add-account-wrapper">
          
        <div className="cleaners-account-edit-account-management-title" 
        onClick={toggleMenuNew}>

          <button
            type="button"
          >
            {toggleNew? (
              <RiArrowDropUpFill size={30} />
            ) : (
              <RiArrowDropDownFill size={30} />
            )}
          </button>
          <p className="cleaners-account-edit-new-account-message">신규 정산 계좌</p>

        </div>

      <div className={
            toggleNew
              ? "cleaners-account-edit-toggle-updown-new-contents-toggledown" 
              : "cleaners-account-edit-toggle-updown-new-contents"
          }
        >

      <div className="cleaners-account-edit-form-edit">

      <div className="cleaners-account-edit-new-account-title-wrapper">

          <div className="cleaners-account-edit-add-button"
            onClick={toggleAddAccount}>
          <div className={
            selectAddAccount
              ? "cleaners-account-edit-toggle-updown-form-contents-toggledown" 
              : "cleaners-account-edit-toggle-updown-form-contents"
          }
          >
          <div className="cleaners-account-edit-add-button-text">
          <IoMdAddCircleOutline size={20} />
          <span className="cleaners-account-edit-new-accounts">신규 정산 계좌 추가</span>
          </div>
          <p className="cleaners-account-edit-account-message">정산에 사용할 계좌를 선택해 주세요.</p>
        </div>
      </div>
      </div>

      {selectAddAccount && (
  <div className="cleaners-account-edit-form-wrapper">
    <form className="cleaners-account-edit-form">

      <span
        className="cleaners-account-edit-remove-layout"
        onClick={handleRemoveAccount}
      >
        <label className="cleaners-account-edit-account-title">
          정산 계좌
        </label>
        <FaRegTrashCan 
        onClick={openCancelModal}
        size={20}/>
      </span>
      
      <span className="cleaners-account-edit-layout-inputs">
      <label htmlFor="banks">은행</label>
      <select 
      className="cleaners-account-edit-input-layout" 
      name="bank" // name을 모델과 맞춤
      value={accountData.bank}
      onChange={handleInputChange}
      >
        <option value="Woori Bank">우리은행</option>
        <option value="iM Bank">iM뱅크</option>
        <option value="Kookmin Bank">국민은행</option>
        <option value="Shinhan Bank">신한은행</option>
        <option value="Hana Bank">하나은행</option>
        <option value="Citibank Korea Inc.">한국시티은행</option>
        <option value="Nonghyup Bank Co., Ltd.">NH농협</option>
        <option value="Suhyup Bank">SH수협</option>
        <option value="Korean Federation of Community Credit Cooperatives">
          MG새마을금고
        </option>
      </select>

      <label htmlFor="accounts">계좌번호</label>
      <input 
      className="cleaners-account-edit-input-layout" 
      name="accountNumber"
      value={accountData.accountNumber}
      onChange={handleInputChange} 
      />

      <label htmlFor="account-holder">예금주</label>
      <input 
      className="cleaners-account-edit-input-layout" 
      name="depositor"
      value={accountData.depositor}
      onChange={handleInputChange}
      />
      </span>
      
      <div className="cleaners-account-edit-button">
        <button className="cleaners-account-edit-cancel-button" type="button" onClick={openCancelModal}>취소</button>
        <button className="cleaners-account-edit-submit-button" type="submit" onClick={openSaveModal}>저장</button>
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
        
        <div className="cleaners-account-edit-account-info-title" onClick={toggleMenuInfo}>

          <button
            type="button"
          >
            {toggleInfo ? (
              <RiArrowDropUpFill size={30} />
            ) : (
              <RiArrowDropDownFill size={30} />
            )}
          </button>
          <p className="cleaners-account-edit-account-info-message"> 정산 계좌 정보</p>

        </div>

        <div className={
            toggleInfo 
              ? "cleaners-account-edit-toggle-updown-info-contents-toggledown" 
              : "cleaners-account-edit-toggle-updown-info-contents"
          }
        >
        <div className="cleaners-account-edit-account-settlement-criteria-guide">

          <span>
            정산 기준 안내
          </span>
          
          <p>
            - 매주 월요일에 전주 작업분이 정산됩니다.
          </p>
          <p>
            - 정산일이 공휴일인 경우 전일에 지급됩니다.
          </p>

        </div>

      </div>
      </div>

      </div>

       <CleanersModalConfirmModal
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
                계좌 정보를 수정하시겠습니까?
              </>
            )
          }
          onClose={closeConfirmModal}
          onConfirm={onConfirm}
        />       

    </div>

    </>
  )

};

export default CleanerAccountEdit;