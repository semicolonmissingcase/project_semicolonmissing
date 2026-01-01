import { useRef, useState } from "react";
import { CleanersRegionDropdown, ConfirmModal } from "./cleaners-region-dropdown/CleanersRegionDropdown";
import "./CleanersProfileEdit.css";
import styles from "./CleanersProfileEdit.module.css";



function CleanersProfileEdit() {
  const [files, setFiles] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("/icons/default-profile.png");
  const profileImageInput = useRef(null);


  function handleFileChange(e) {
    const selectedFiles = Array.from(e.target.files);
    const allowedMimeTypes = ["image/jpeg", "image/png"];

    const validFiles = selectedFiles.filter(file => {
      return allowedMimeTypes.includes(file.type);
    });

    if (validFiles.length < selectedFiles.length) {
      alert("jpg, jpeg, png 파일만 첨부 가능합니다.");
    }
    
    const filesForState = validFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setFiles(filesForState);
  }

  function handleProfileImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImageUrl(URL.createObjectURL(file));
    }
  }

  const onProfileImageClick = () => {
    if (profileImageInput.current) {
      profileImageInput.current.click();
    }
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
    navigate(-1)
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
    <div className="all-container cleaners-profile-edit-container">
      <div className="cleaners-profile-edit-items-box">

        <div className="cleaners-profile-edit-title"><span>프로필 수정</span></div>
        
        <div className="cleaners-profile-edit-layout-center">
        <div className="cleaners-profile-edit-layout">
          

          <form className="cleaners-profile-edit-form">
            <div className="cleaners-profile-edit-layout-row">
              <div className="cleaners-profile-edit-profile-title">
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={profileImageInput}
                    onChange={handleProfileImageChange}
                  />
                  <div className={styles.profileImageContainer} onClick={onProfileImageClick}>
                    <img
                      src={profileImageUrl}
                      alt="Profile"
                      className={`${styles.profileImage} ${profileImage ? styles.imageSelected : ""}`}
                    />
                    <img src="/icons/edit-icon.png" alt="Edit" className={styles.editIcon} />
                  </div>
                </div>

              <div className="cleaners-profile-edit-profile">
                <div className="cleaners-profile-edit-layout-flex-column">
                  <label htmlFor="name">이름</label>
                  <input className="cleaners-profile-edit-input cleaners-profile-edit-name" id="name" name="name" value="&nbsp;&nbsp;&nbsp;김기사" readOnly/>
                </div>

                <div className="cleaners-profile-edit-layout-flex-column">
                  <label htmlFor="tagline">한 줄 소개</label>
                  <input className="cleaners-profile-edit-input cleaners-profile-edit-tagline" id="tagline" name="tagline" value="&nbsp;&nbsp;&nbsp;15년 경력의 믿음직한 제빙기 청소기사 김기사입니다." readOnly/>
                </div>

                <div className="cleaners-profile-edit-layout-flex-column">
                  <CleanersRegionDropdown name="workAreas" label="작업 지역" labelStyle={{ fontSize: "18px" }}/>
                </div>

                <div className="cleaners-profile-edit-layout-flex-column">
                  <label htmlFor="career">경력</label>
                  <input className="cleaners-profile-edit-input cleaners-profile-edit-career" id="career" name="career" value="&nbsp;&nbsp;&nbsp;15년" readOnly/>
                </div>


              <div className="cleaners-profile-edit-attachment">  
                <label className="cleaners-profile-edit-attachment-button" htmlFor="file">업로드</label>
                <input
                  className="cleaners-profile-edit-attachment-input"
                  type="file"
                  id="file"
                  name="file"
                  accept=".jpg,.jpeg,.png"
                  multiple
                  onChange={handleFileChange}
                />
              
                <ul className="cleaners-profile-edit-ul-title">
                  {files.map((file, idx) => (
                    <li className="cleaners-profile-edit-li-contents" key={idx}>
                      <a href={file.url} target="_blank" rel="noopener noreferrer">
                        {file.name}
                      </a>
                    </li>
                  ))}
                </ul>

                <span className="cleaners-profile-edit-file-hint">
                  ※jpg, jpeg, png 파일만 첨부 가능합니다.
                  <br />
                  &nbsp;&nbsp;&nbsp;관리자 제출용입니다.
                </span>

                <span className="cleaners-profile-edit-buttons">
                  <button type="button" className="cleaners-profile-edit-button-small-custom2" onClick={openCancelModal} >취소</button>
                  <button type="button" className="cleaners-profile-edit-button-small-custom2" onClick={openSaveModal} >완료</button>
                </span>
              </div>
              </div>     
            </div>
          </form>

          </div>

         </div>
      </div>
       
     <ConfirmModal
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
              정보를 수정하시겠습니까?
            </>
          )
        }
        onClose={closeConfirmModal}
        onConfirm={onConfirm}
      />    

    </div>
  );
}

export default CleanersProfileEdit;

