import { useRef, useState, useEffect } from "react";
import { CleanersRegionDropdown, ConfirmModal } from "./cleaners-region-dropdown/CleanersRegionDropdown";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMeThunk, updateCleanerInfoThunk } from "../../store/thunks/authThunk.js";
import "./CleanersProfileEdit.css";

function CleanersProfileEdit() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // --- 상태 변수 수정 ---
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");

  // 프로필 이미지 관련 상태
  const [profileImageUrl, setProfileImageUrl] = useState("/icons/default-profile.png");
  const [selectedProfileFile, setSelectedProfileFile] = useState(null); // 실제 업로드할 파일 객체
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isImgModalOpen, setIsImgModalOpen] = useState(false);

  // 자격증 관련 상태
  const [certificateFiles, setCertificateFiles] = useState([]); // { file, name, url } 형태의 객체 배열

  // 작업 지역 관련 상태
  const [selectedRegions, setSelectedRegions] = useState([]); // 초기값을 빈 배열로 수정

  // 모달 관련 상태
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState(null);
   const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // 성공 모달 상태

  // --- useEffect 수정 ---
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setProfileImageUrl(user.profile || "/icons/default-profile.png");
      setTagline(user.tagline || "");

      // 기존 자격증 정보 로드
      if (user.certifications) {
        setCertificateFiles(user.certifications.map(cert => {
          const fileName = cert.path.split(/[\\/]/).pop(); // 경로에서 파일명 추출
          return {
            file: null, // 기존 파일은 파일 객체가 없음
            name: fileName,
            url: cert.path // 백엔드에서 제공하는 정적 파일 경로
          };
        }));
      }

      // 기존 작업 지역 정보 로드 (오류 수정)
      if (user.driverRegions) {
        setSelectedRegions(user.driverRegions.map(region => region.locationId));
      }

    } else {
      dispatch(getMeThunk());
    }
  }, [user, dispatch]);

  // --- 핸들러 함수 ---
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedProfileFile(file); // 업로드할 파일 객체 저장
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
    const newFiles = Array.from(e.target.files);
    setCertificateFiles(prev => [
      ...prev,
      ...newFiles.map(file => ({
        file: file, // 실제 파일 객체 저장
        name: file.name,
        url: URL.createObjectURL(file)
      }))
    ]);
  };

  const removeCertificate = (indexToRemove) => {
    // 메모리 누수 방지를 위해 createObjectURL로 생성된 URL 해제
    const fileToRemove = certificateFiles[indexToRemove];
    if (fileToRemove.file) { // 새로 추가된 파일만 URL 해제 대상
      URL.revokeObjectURL(fileToRemove.url);
    }
    setCertificateFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const onConfirm = async () => {
    if (confirmType === "save") {
      try {
        const formData = new FormData();

        // 텍스트 데이터 추가
        formData.append('tagline', tagline);
        formData.append('regions', JSON.stringify(selectedRegions));

        // 프로필 이미지 파일 추가 (새로 선택된 경우에만)
        if (selectedProfileFile) {
          formData.append('profileImage', selectedProfileFile);
        }

        // 자격증 파일 추가 (새로 추가된 파일만)
        certificateFiles.forEach(cert => {
          if (cert.file) { // cert.file이 있는 경우만 새로 추가된 파일
            formData.append('certificateFiles', cert.file);
          }
        });

        const resultAction = await dispatch(updateCleanerInfoThunk(formData));

        if (updateCleanerInfoThunk.fulfilled.match(resultAction)) {
          setConfirmOpen(false);
          setIsSuccessModalOpen(true); // 성공 모달 열기
        } else {
          const errorMessage = resultAction.payload || "프로필 수정에 실패했습니다."
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error("프로필 수정 실패:", error);
        alert(`프로필 수정 중 오류가 발생했습니다: ${error.message || error}`);
        setConfirmOpen(false);
      }
    } else if (confirmType === "cancel") {
      setConfirmOpen(false);
      navigate("/cleaners/mypage");
    }
  };

  return (
    <div className="cleaner-profile-edit-container">
      <div className="cleaner-profile-edit-card">

        <div className="cleaner-profile-edit-header">
          <div className="cleaner-profile-edit-img-container">
            <div
              className="cleaner-profile-edit-img"
              style={{ backgroundImage: `url('${profileImageUrl}')` }}
            />
            <label htmlFor="profile-upload" className="cleaner-profile-edit-badge" />
            <input id="profile-upload" type="file" style={{ display: "none" }} accept="image/*" onChange={handleImageSelect} />
          </div>

          <div className="cleaner-profile-edit-info">
            <div className="cleaner-profile-edit-name-row">
              <p className="cleaner-profile-edit-input-name">{user?.name} 기사님</p>
            </div>
            <p className="cleaner-profile-edit-email">{user?.email || "정보 불러오기 실패"}</p>
          </div>
        </div>

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

          {/* --- 자격증 표시 --- */}
          <div className="cleaner-profile-edit-field">
            <label>자격증</label>
            {certificateFiles.map((cert, index) => (
              <div key={index} className="cleaner-profile-edit-file-row">
                <div className="cleaner-profile-edit-file-name-box">
                  <a href={cert.url} target="_blank" rel="noopener noreferrer">{cert.name}</a>
                </div>
                <span className="file-remove-x" onClick={() => removeCertificate(index)}>X</span>
              </div>
            ))}
            <div className="cleaner-profile-edit-file-row">
              <label htmlFor="cert-upload" className="cleaner-profile-edit-btn-upload">파일 추가</label>
              <input id="cert-upload" type="file" multiple style={{ display: 'none' }} onChange={handleFileChange} />
            </div>
          </div>

          <div className="cleaner-profile-edit-field">
            <CleanersRegionDropdown label="작업 지역"
              initialRegions={selectedRegions}
              onRegionChange={setSelectedRegions}
            />
          </div>
        </div>

        <div className="cleaner-profile-edit-footer">
          <button className="cleaner-profile-edit-btn-cancel" onClick={() => { setConfirmType("cancel"); setConfirmOpen(true); }}>수정 취소</button>
          <button className="cleaner-profile-edit-btn-submit" onClick={() => { setConfirmType("save"); setConfirmOpen(true); }}>수정 완료</button>
        </div>
      </div>

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

      {/* 프로필 수정 성공 모달 */}
      <ConfirmModal 
        open={isSuccessModalOpen}
        onClose={async() => {
          setIsSuccessModalOpen(false);
          await dispatch(getMeThunk());
        }}
        message='프로필이 변경되었습니다.'
        onClick={async () => {
          setIsSuccessModalOpen(false);
          await dispatch(getMeThunk());
        }}
      />
    </div>
  );
}

export default CleanersProfileEdit;