import { useNavigate } from 'react-router-dom';
import './CleanersUserQuotationsTitle.css';

function CleanersUserQuotationsTitle () {

  const navigate = useNavigate();

  return (

    <>
    <div className="all-container cleaners-user-quotations-title-container">
      <span className="cleaners-user-quotations-title-text">안녕하세요, 김기사 기사님! 요청 의뢰서입니다.</span>

      <div className="cleaners-user-quotations-title-small-container">
      <div className="cleaners-user-quotations-title-wrapper-selected"
        onClick={() => navigate('/cleaners/quotations/:id')}>
        <span className="cleaners-user-quotations-title-status-selected">지정</span>
        <div className="cleaners-user-quotations-title-vertical-line-selected-layout">
        <span className="cleaners-user-quotations-title-location-selected-location">대구시 중구 남일동</span>
        <span className="cleaners-user-quotations-title-place-selected-place">남일동 유명한 카페</span>
        <span className="cleaners-user-quotations-title-user-selected-user">이점주</span>
        <span className="cleaners-user-quotations-title-date-select-date">12월 27일<br /> 19시 ~ 20시</span>
        <div className="cleaners-user-quotations-title-img-frame">
          <img className="cleaners-user-quotations-title-img-selected" src="/icons/default-profile.png" alt="selected-icon" />
        </div>
        </div>
      </div>
      <div className="cleaners-user-quotations-title-wrapper-rejected">
        <span className="cleaners-user-quotations-title-status-rejected">반려</span>
        <div className="cleaners-user-quotations-title-vertical-line-rejected-layout">
        <span className="cleaners-user-quotations-title-location-rejected-location">대구시 중구 남일동</span>
        <span className="cleaners-user-quotations-title-place-rejected-place">남일동 유명한 카페2</span>
        <span className="cleaners-user-quotations-title-user-rejected-user">이점주2</span>
        <span className="cleaners-user-quotations-title-date-rejected-date">12월 23일<br /> 9시 ~ 10시</span>
        <div className="cleaners-user-quotations-title-img-frame">
          <img className="cleaners-user-quotations-title-img-selected" src="/icons/default-profile.png" alt="selected-icon" />
        </div>
        </div>
      </div>
      <div className="cleaners-user-quotations-title-wrapper-pending">
        <span className="cleaners-user-quotations-title-status-pending">&nbsp;</span>
        <div className="cleaners-user-quotations-title-vertical-line-pending-layout">
        <span className="cleaners-user-quotations-title-location-pending-location">대구시 중구 남일동</span>
        <span className="cleaners-user-quotations-title-place-pending-place">남일동 유명한 카페</span>
        <span className="cleaners-user-quotations-title-user-pending-user">이점주</span>
        <span className="cleaners-user-quotations-title-date-pending-date">12월 27일<br /> 19시 ~ 20시</span>
        <div className="cleaners-user-quotations-title-img-frame">
          <img className="cleaners-user-quotations-title-img-selected" src="/icons/default-profile.png" alt="selected-icon" />
        </div>
        </div>
      </div>
    </div>
    
    </div>
    </>
    
  )
}

export default CleanersUserQuotationsTitle;