import { useState, useEffect } from "react";
import { CleanersRegionDropdown } from "./cleaners-region-dropdown/CleanersRegionDropdown.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMeThunk, updateCleanerInfoThunk, uploadFileThunk } from "../../store/thunks/authThunk.js";
import ConfirmModal from "../result/ConfirmModal.jsx";
import "./CleanersProfileEdit.css";

function CleanersProfileEdit() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // 프로필 정보 상태
  const [tagline, setTagline] = useState("");
  
  // 프로필 이미지 관련 상태
  const [profileImageUrl, setProfileImageUrl] = useState("/icons/default-profile.png");
  const [selectedProfileFile, setSelectedProfileFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isImgModalOpen, setIsImgModalOpen] = useState(false);

  // 자격증 관련 상태
  const [certificateFiles, setCertificateFiles] = useState([]);

  // 작업 지역 관련 상태
  const [selectedRegions, setSelectedRegions] = useState([]);

  // 모달 관련 상태
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState(null);

  // 사용자 정보 로드
  useEffect(() => {
    if (user) {
      setProfileImageUrl(user.profile || "/icons/default-profile.png");
      setTagline(user.tagline || "");

      // 기존 자격증 정보 로드
      if (user.certifications) {
        setCertificateFiles(user.certifications.map(cert => {
          const fileName = cert.path.split(/[\\/]/).pop();
          return {
            file: null,
            name: fileName,
            url: cert.path
          };
        }));
      }

      // 기존 작업 지역 정보 로드
      if (user.driverRegions) {
        setSelectedRegions(user.driverRegions.map(region => region.locationId));
      }
    } else {
      dispatch(getMeThunk());
    }
  }, [user, dispatch]);

  // 프로필 이미지 선택
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedProfileFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsImgModalOpen(true);
    }
  };

  // 프로필 이미지 저장
  const handleSaveImage = () => {
    setProfileImageUrl(previewUrl);
    setIsImgModalOpen(false);
  };

  // 자격증 파일 추가
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setCertificateFiles(prev => [
      ...prev,
      ...newFiles.map(file => ({
        file: file,
        name: file.name,
        url: URL.createObjectURL(file)
      }))
    ]);
  };

  // 자격증 삭제
  const removeCertificate = (indexToRemove) => {
    const fileToRemove = certificateFiles[indexToRemove];
    if (fileToRemove.file) {
      URL.revokeObjectURL(fileToRemove.url);
    }
    setCertificateFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // 수정 취소 처리
  const handleCancel = () => {
    setModalConfig({
      title: '수정 취소',
      message: '수정된 내용이 저장되지 않습니다. 정말로 취소하시겠습니까?',
      onConfirm: () => navigate("/cleaners/mypage"),
      onClose: () => setIsConfirmModalOpen(false),
      showConfirmButton: true,
    });
    setIsConfirmModalOpen(true);
  };

  // 수정 완료 처리
  const handleUpdateProfile = async () => {
    // 변경된 내용이 있는지 확인
    const originalProfile = user.profile;
    const originalTagline = user.tagline || "";
    const originalCerts = user.certifications?.map(c => c.path) || [];
    const originalRegions = user.driverRegions?.map(r => r.locationId).sort() || [];

    try {
      let profilePath = originalProfile;
      let finalCertsData = certificateFiles
        .filter(cert => !cert.file)
        .map(cert => ({ name: cert.name, url: cert.url }));

      const isProfileImageChanged = !!selectedProfileFile;
      const newCertificateFiles = certificateFiles.filter(cert => !!cert.file);

      if (isProfileImageChanged) {
        profilePath = await dispatch(uploadFileThunk(selectedProfileFile)).unwrap();
      }
      // 새 자격증 파일 처리
      if (newCertificateFiles.length > 0) {
        const uploadPromises = newCertificateFiles.map(cert => 
          dispatch(uploadFileThunk(cert.file)).unwrap()
        );
        const newCertUrls = await Promise.all(uploadPromises);
        const newCertsData = newCertificateFiles.map((cert, index) => ({
          name: cert.file.name.split('.').slice(0, -1).join('.') || cert.file.name,
          url: newCertUrls[index]
        }));
        finalCertsData = [...finalCertsData, ...newCertsData];
      }

      const isTaglineChanged = originalTagline !== tagline;
      const areRegionsChanged = JSON.stringify(originalRegions) !== JSON.stringify([...selectedRegions].sort());
      const originalCertUrls = originalCerts.sort();
      const finalCertUrls = finalCertsData.map(c => c.url).sort();
      const areCertsChanged = JSON.stringify(originalCertUrls) !== JSON.stringify(finalCertUrls);

      if(!isProfileImageChanged && !isTaglineChanged && !areRegionsChanged && !areCertsChanged) {
        setModalConfig({
          title: '알림',
          message: '변경된 내용이 없습니다.',
          onClose: () => setIsConfirmModalOpen(false)
        });
        setIsConfirmModalOpen(true);
        return;
      }

      const updateData = {
        profile: profilePath,
        tagline: tagline,
        certifications: finalCertsData,
        regions: selectedRegions,
      };
    
      await dispatch(updateCleanerInfoThunk(updateData)).unwrap();

      setModalConfig({
        title: '수정 완료',
        message: '프로필이 성공적으로 수정되었습니다.',
        onClose: () => {
          setIsConfirmModalOpen(false);
          dispatch(getMeThunk());
        }
      });
      setIsConfirmModalOpen(true);

    } catch (error) {
      setModalConfig({
        title: '오류',
        message: error.info || "프로필 수정 중 오류가 발생했습니다.",
        onClose: () => setIsConfirmModalOpen(false)
      });
      setIsConfirmModalOpen(true);
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
            <input 
              id="profile-upload" 
              type="file" 
              style={{ display: "none" }} 
              accept="image/*" 
              onChange={handleImageSelect} 
            />
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
              <input 
                id="cert-upload" 
                type="file" 
                multiple 
                style={{ display: 'none' }} 
                onChange={handleFileChange} 
              />
            </div>
          </div>

          <div className="cleaner-profile-edit-field">
            <CleanersRegionDropdown 
              label="작업 지역"
              initialRegions={selectedRegions}
              onRegionChange={setSelectedRegions}
            />
          </div>
        </div>

        <div className="cleaner-profile-edit-footer">
          <button className="cleaner-profile-edit-btn-cancel" onClick={handleCancel}>
            수정 취소
          </button>
          <button className="cleaner-profile-edit-btn-submit" onClick={handleUpdateProfile}>
            수정 완료
          </button>
        </div>
      </div>

      {/* 프로필 이미지 미리보기 모달 */}
      {isImgModalOpen && (
        <div className="cleaner-profile-edit-modal-overlay">
          <div className="cleaner-profile-edit-modal-content">
            <h3>프로필 이미지 미리보기</h3>
            <img src={previewUrl} alt="미리보기" className="cleaner-profile-edit-modal-preview-img"/>
            <div className="cleaner-profile-edit-modal-btns">
              <button onClick={() => setIsImgModalOpen(false)} className="cleaner-profile-edit-modal-btn-cancel">
                취소
              </button>
              <button onClick={handleSaveImage} className="cleaner-profile-edit-modal-btn-save">
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 확인 모달 */}
      {isConfirmModalOpen && modalConfig && (
        <ConfirmModal
          open={isConfirmModalOpen}
          onClose={modalConfig.onClose}
          title={modalConfig.title}
          message={modalConfig.message}
          onConfirm={modalConfig.onConfirm}
          showConfirmButton={modalConfig.showConfirmButton}
        />
      )}
    </div>
  );
}

export default CleanersProfileEdit;