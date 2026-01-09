import { useRef, useState, useEffect } from "react";
import { CleanersRegionDropdown, ConfirmModal } from "./cleaners-region-dropdown/CleanersRegionDropdown";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMeThunk } from "../../store/thunks/authThunk.js";
import "./CleanersProfileEdit.css";

function CleanersProfileEdit() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [career, setCareer] = useState("");
  const [files, setFiles] = useState([]);
  
  // 프로필 이미지 및 모달 상태
  const [profileImageUrl, setProfileImageUrl] = useState("/icons/default-profile.png");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isImgModalOpen, setIsImgModalOpen] = useState(false);
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "OOO 기사님");
      setProfileImageUrl(user.profile || "/icons/default-profile.png");
    } else {
      dispatch(getMeThunk());
    }
  }, [user, dispatch]);

  // 이미지 선택 시 미리보기 모달 오픈
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsImgModalOpen(true);
    }
  };

  const handleSaveImage = () => {
    setProfileImageUrl(previewUrl);
    setIsImgModalOpen(false);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles.map(file => ({ name: file.name, url: URL.createObjectURL(file) }))]);
  };

  const onConfirm = () => {
    if (confirmType === "save") {
      // API 호출 로직 위치
      navigate("/cleaners/mypage");
    }
    setConfirmOpen(false);
  };

  return (
    <div className="cleaner-profile-edit-container">
      <div className="cleaner-profile-edit-card">
        
        {/* 상단 프로필 섹션 */}
        <div className="cleaner-profile-edit-header">
          <div className="cleaner-profile-edit-img-container">
            <div 
              className="cleaner-profile-edit-img" 
              style={{ backgroundImage: `url('${profileImageUrl}')` }} 
            />
            {/* 프로필 수정 연필 버튼 */}
            <label htmlFor="profile-upload" className="cleaner-profile-edit-badge" />
            <input id="profile-upload" type="file" style={{ display: "none" }} accept="image/*" onChange={handleImageSelect} />
          </div>
          
          <div className="cleaner-profile-edit-info">
            <div className="cleaner-profile-edit-name-row">
              <p className="cleaner-profile-edit-input-name">{user?.name || "기사님"}</p>
            </div>
            <p className="cleaner-profile-edit-email">{user?.email || "cleaner@cleaner.com"}</p>
          </div>
        </div>

        {/* 바디 입력 필드 */}
        <div className="cleaner-profile-edit-body">
          <div className="cleaner-profile-edit-field">
            <label>한 줄 소개</label>
            <textarea 
              className="cleaner-profile-edit-textarea" 
              value={tagline} 
              onChange={(e) => setTagline(e.target.value)} 
              placeholder="자신을 소개하는 문구를 입력해주세요."
            />
          </div>

          <div className="cleaner-profile-edit-field">
            <label>자격증</label>
            <div className="cleaner-profile-edit-file-row">
              <div className="cleaner-profile-edit-file-name-box">
                {files.length > 0 ? files[files.length - 1].name : "자격증 파일 이름"}
                {files.length > 0 && <span className="file-remove-x" onClick={() => setFiles([])}>X</span>}
              </div>
              <label htmlFor="cert-upload" className="cleaner-profile-edit-btn-upload">업로드</label>
              <input id="cert-upload" type="file" multiple style={{ display: 'none' }} onChange={handleFileChange} />
            </div>
          </div>

          <div className="cleaner-profile-edit-field">
            {/* 지역 선택은 외부 모듈 사용 */}
            <CleanersRegionDropdown label="작업 지역" />
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="cleaner-profile-edit-footer">
          <button className="cleaner-profile-edit-btn-cancel" onClick={() => { setConfirmType("cancel"); setConfirmOpen(true); }}>수정 취소</button>
          <button className="cleaner-profile-edit-btn-submit" onClick={() => { setConfirmType("save"); setConfirmOpen(true); }}>수정 완료</button>
        </div>
      </div>

      {/* 이미지 미리보기 모달 */}
      {isImgModalOpen && (
        <div className="cleaner-profile-edit-modal-overlay">
          <div className="cleaner-profile-edit-modal-content">
            <h3>프로필 이미지 미리보기</h3>
            <img src={previewUrl} alt="미리보기" className="cleaner-profile-edit-modal-preview-img"/>
            <div className="cleaner-profile-edit-modal-btns">
              <button onClick={() => setIsImgModalOpen(false)} className="cleaner-profile-edit-modal-btn-cancel">취소</button>
              <button onClick={handleSaveImage} className="cleaner-profile-edit-modal-btn-save">저장하기</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        message={confirmType === "cancel" ? "수정 내용이 삭제됩니다. 취소하시겠습니까?" : "정보를 수정하시겠습니까?"}
        onConfirm={onConfirm}
      />
    </div>
  );
}

export default CleanersProfileEdit;