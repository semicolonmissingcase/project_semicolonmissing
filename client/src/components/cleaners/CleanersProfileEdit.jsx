import { useState } from 'react';
import './CleanersProfileEdit';

function CleanersProfileEdit () {

  const [files, setFiles] = useState([]);
  
    function handleFileChange(e) {
      const selectedFiles = Array.from(e.target.files).map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }));
  
      setFiles(selectedFiles);
    }
  

    return (

        <>
        <div className="all-container cleaners-profile-edit-wrapper">

        <div className="cleaners-profile-edit-fieldset-wrapper">
        <form className="cleaners-profile-edit-form">

          <label htmlFor="name">이름</label>
          <input className="cleaners-profile-edit-name" />
          <label htmlFor="tagline">한 줄 소개</label>
          <input className="cleaners-profile-edit-tagline" />

          <fieldset className="cleaners-profile-edit-fieldset">

          <legend className="cleaners-profile-edit-title-place">작업 지역</legend>

          <label htmlFor="수도권 전체">수도권 전체
          <input className="cleaners-profile-edit-place" type="checkbox" id="place" name="place" />
          </label>
          <label htmlFor="서울">서울
          <input className="cleaners-profile-edit-place" type="checkbox" id="서울" name="서울" value="서울" />
          </label>
          <label htmlFor="경기도">경기도
          <input className="cleaners-profile-edit-place" type="checkbox" id="place" name="place" />
          </label>

          <label htmlFor="career">경력</label>
          <input className="cleaners-profile-edit-career" />

          
          {/* 수도권 체크 시

          서울 + 경기도 자동 체크

          해제 시 개별 선택 가능 */}
          
          <label htmlFor="대구">강원도
          <input className="cleaners-profile-edit-place" type="checkbox" id="place" name="place" />
          </label>

          <label htmlFor="부산">부산
          <input className="cleaners-profile-edit-place" type="checkbox" id="place" name="place" />
          </label>
          <label htmlFor="대구">대구
          <input className="cleaners-profile-edit-place" type="checkbox" id="place" name="place" />
          </label>
          <label htmlFor="대구">경북
          <input className="cleaners-profile-edit-place" type="checkbox" id="place" name="place" />
          </label>
          <label htmlFor="대구">경남
          <input className="cleaners-profile-edit-place" type="checkbox" id="place" name="place" />
          </label>

          <label htmlFor="대구">전북
          <input className="cleaners-profile-edit-place" type="checkbox" id="place" name="place" /> 
          </label>
          <label htmlFor="대구">전남
          <input className="cleaners-profile-edit-place" type="checkbox" id="place" name="place" />
          </label>
          <label htmlFor="대구">충북
          <input className="cleaners-profile-edit-place" type="checkbox" id="place" name="place" />
          </label>
          <label htmlFor="대구">충남
          <input className="cleaners-profile-edit-place" type="checkbox" id="place" name="place" />
          </label>

          <label htmlFor="대구">제주도
          <input className="cleaners-profile-edit-place" type="checkbox" id="place" name="place" />
          </label>
          
          </fieldset>

          <label 
        className="cleaners-user-quote-list-details-attachment-btn" 
        for="file">업로드</label>
        <input 
        className="cleaners-user-quote-list-details-attachment" 
        type="file" 
        id="file" 
        name="file" 
        accept=".jpg,.jpeg,.png,.zip" 
        multiple 
        onChange={handleFileChange} />
        
          <ul className="cleaners-user-quote-list-details-ul-title">
          {files.map((file, idx) => (
            <li className="cleaners-user-quote-list-details-li-contents" key={idx}>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {file.name}
              </a>
            </li>
          ))}
        </ul>
        
        <span>※jpg, jpeg, png, zip 파일만 첨부 가능합니다.<br />
              &nbsp;&nbsp;&nbsp;관리자 제출용입니다.</span>  

        </form>
        </div>

        </div>


        </>
    )
}

export default CleanersProfileEdit;