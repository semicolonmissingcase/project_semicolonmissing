import { useEffect, useState } from "react";
import "./CleanersInfoEdit.css";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../result/ConfirmModal.jsx"; // 확인 모달
import CleanerPwModal from "./cleaners-modal/cleanerPwModal.jsx"; // 비밀번호 변경 모달
import NameEditModal from "../commons/NameEditModal.jsx"; // 이름 변경 모달
import { useDispatch, useSelector } from "react-redux";
import { getMeThunk, updateCleanerInfoThunk } from "../../store/thunks/authThunk.js";
import { getAccountThunk } from "../../api/axiosCleaner.js";
import { CiEdit } from "react-icons/ci"; // 이름 변경 아이콘

export default function CleanersInfoEdit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoggedIn, isLoading } = useSelector((state) => state.auth);
  const [cleanerName, setCleanerName] = useState("");

  // 이름 수정 모달 관련 상태
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [tempName, setTempName] = useState("");

  // 전화번호 상태
  const [phonePrefix, setPhonePrefix] = useState("010");
  const [phoneMiddle, setPhoneMiddle] = useState("");
  const [phoneLast, setPhoneLast] = useState("");

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState(null);
  const [pwModalOpen, setPwModalOpen] = useState(false); // 비밀번호 모달

  // 계좌 확인용
  const [hasSettlementAccount, setHasSettlementAccount] = useState(false);
  const [isAccountLoading, setIsAccountLoading] = useState(true);

  useEffect(() => {
    if (!user && isLoggedIn === false && isLoading === false) {
      dispatch(getMeThunk());
    }
  }, [dispatch, user, isLoggedIn, isLoading]);

  // user 정보 로드 시 전화번호 및 이름 파싱
  useEffect(() => {
    if (user?.name) {
      setCleanerName(user.name);
    }
    if (user?.phoneNumber) {
      const parts = user.phoneNumber.split('-');
      if (parts.length === 3) {
        setPhonePrefix(parts[0]);
        setPhoneMiddle(parts[1]);
        setPhoneLast(parts[2]);
      } else {
        const num = user.phoneNumber.replace(/[^0-9]/g, '');
        setPhonePrefix(num.substring(0, 3));
        setPhoneMiddle(num.substring(3, 7));
        setPhoneLast(num.substring(7, 11));
      }
    }
  }, [user]);

  // 계좌 정보 조회
  useEffect(() => {
    const fetchAccountInfo = async () => {
      if(!isLoggedIn) {
        setIsAccountLoading(false);
        return;
      }
      try {
        setIsAccountLoading(true);
        const response = await getAccountThunk();
        const accounts = response.data?.data?.rows;
        setHasSettlementAccount(accounts && accounts.length > 0);
      } catch (error) {
        console.error('계좌 정보 조회 실패:', error);
        setHasSettlementAccount(false);
      } finally {
        setIsAccountLoading(false);
      }
    };
    fetchAccountInfo();
  }, [isLoggedIn]);

  // 전화번호 입력 핸들러
  const handlePhonePartChange = (setter) => (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    setter(numericValue);
  };

  // 이름 수정 모달 열기
  const handleOpenNameModal = () => {
    setTempName(cleanerName);
    setIsNameModalOpen(true);
  };

  const handleSaveName = () => {
    const newName = tempName.trim();
    if (!newName) {
      alert('이름을 입력해주세요.');
      return;
    }
    setCleanerName(newName);
    setIsNameModalOpen(false);
  };

  // 수정 완료 버튼
  const handleUpdateProfile = async () => {
    const newPhoneNumber = `${phonePrefix}-${phoneMiddle}-${phoneLast}`;
    const newName = cleanerName;

    const isNameChanged = user?.name !== newName;
    const isPhoneNumberChanged = user?.phoneNumber !== newPhoneNumber;

    if (!isNameChanged && !isPhoneNumberChanged) {
      setModalConfig({
        title: '알림',
        message: '변경된 내용이 없습니다.',
        onClose: () => setIsConfirmModalOpen(false)
      });
      setIsConfirmModalOpen(true);
      return;
    }

    const updateData = {};
    if(isNameChanged) {
      updateData.name = newName;
    }
    if(isPhoneNumberChanged) {
      updateData.phoneNumber = newPhoneNumber;
    }

    try {
      await dispatch(updateCleanerInfoThunk(updateData)).unwrap();
      dispatch(getMeThunk());

      setModalConfig({
        title: '수정 완료',
        message: '정보가 성공적으로 수정되었습니다.',
        onClose: () => {
          setIsConfirmModalOpen(false);
        }
      });

      setIsConfirmModalOpen(true);

    } catch (error) {
      const errorMessage = error.info || "정보 수정 중 오류가 발생했습니다."
      setModalConfig({
        title: '오류',
        message: errorMessage,
        onClose: () => setIsConfirmModalOpen(false)
      });
      setIsConfirmModalOpen(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const profileImageUrl = user?.profile || '/icons/default-profile.png';

  if(isAccountLoading) {
    return (
      <div className="cleaners-info-container">
        <p>계자 정보를 불러오는 중입니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="cleaners-info-container">
        {/* 프로필 섹션 */}
        <div className="cleaners-info-profile-header">
          <div 
            className="cleaners-info-profile-img" 
            style={{ backgroundImage: `url('${profileImageUrl}')` }}
          ></div>
          
          {/* 이름과 수정 버튼을 감싸는 컨테이너 추가 */}
          <div className="cleaners-info-name-wrapper">
            <h2 className="cleaners-info-name">
              {cleanerName} 기사님
            </h2>
            <div className="cleaners-info-edit-container">
              <CiEdit className="cleaners-info-edit-icon" />
              <button 
                type="button" 
                className="cleaners-info-edit-name-btn" 
                onClick={handleOpenNameModal}
              ></button>
            </div>
          </div>
          
          <p className="cleaners-info-email">{user?.email}</p>
        </div>

        {/* 설정 리스트 섹션 */}
        <div className="cleaners-info-settings-list">
          {/* 전화번호 */}
          <div className="cleaners-info-row">
            <label className="cleaners-info-label">전화번호</label>
            <div className="cleaners-info-phone-inputs">
              <select
                value={phonePrefix}
                onChange={(e) => setPhonePrefix(e.target.value)}
                className="cleaners-info-select"
              >
                <option value="010">010</option>
                <option value="011">011</option>
                <option value="016">016</option>
                <option value="017">017</option>
                <option value="018">018</option>
                <option value="019">019</option>
              </select>
              <span className="cleaners-info-dash">-</span>
              <input
                type="text"
                maxLength="4"
                value={phoneMiddle}
                onChange={handlePhonePartChange(setPhoneMiddle)}
                className="cleaners-info-input"
              />
              <span className="cleaners-info-dash">-</span>
              <input
                type="text"
                maxLength="4"
                value={phoneLast}
                onChange={handlePhonePartChange(setPhoneLast)}
                className="cleaners-info-input"
              />
            </div>
          </div>

          {/* 알림설정 */}
          <div className="cleaners-info-row">
            <label>알림설정</label>
            <div className="checkbox-apple">
              <input className="yep" id="check-apple" type="checkbox" />
              <label htmlFor="check-apple"></label>
            </div>
          </div>

          {/* 비밀번호 변경 */}
          <div className="cleaners-info-row">
            <label>비밀번호 변경</label>
            <button type="button" className="cleaners-info-btn-change"
              onClick={() => setPwModalOpen(true)}>
              변경하기
            </button>
          </div>
          
          {/* 정산 안내 섹션 */}
          <div className="cleaners-info-settlement-info">
            {hasSettlementAccount ? (
              <>
              <div className="cleaners-info-settlement-comments">
                <p className="cleaners-info-settlement-status">정산 가능</p>
                <p className="cleaners-info-settlement-desc">※ 계좌 인증이 완료되어 정산이 가능합니다.</p>
              </div>
              </>
            ) : (
              <>
              <div className="cleaners-info-settlement-comments">
                <p className="cleaners-info-settlement-status">정산 불가능</p>
                <p className="cleaners-info-settlement-desc">※ 정산 계좌 정보가 없습니다.</p>
              </div>
                <button type="button" className="cleaners-info-btn-add-account"
                onClick={() => navigate('/cleaners/accountedit')}>
                  정산 계좌 추가
                </button>
              </>
            )}
          </div>
        </div>


        {/* 하단 버튼 */}
        <div className="cleaners-info-actions">
          <button type="button" className="cleaners-info-btn-cancel" onClick={() => navigate(-1)}>수정 취소</button>
          <button type="button" className="cleaners-info-btn-submit" onClick={handleUpdateProfile}>수정 완료</button>
        </div>
      </div>

      {/* 완료 모달 */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        config={modalConfig}
      /> 

      {/* 비밀번호 변경 모달 */}
      <CleanerPwModal 
        isOpen={pwModalOpen}
        onClose={() => setPwModalOpen(false)}
      /> 

      {/* 이름 수정 모달 호출 */}
      <NameEditModal 
        isOpen={isNameModalOpen}
        tempName={tempName}
        setTempName={setTempName}
        onCancel={() => setIsNameModalOpen(false)}
        onSave={handleSaveName}
      />
    </>
  );
}