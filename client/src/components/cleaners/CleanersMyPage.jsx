import './CleanersMyPage.css';

function CleanersMyPage () {

  return (
    <>
    <div className="all-container cleaners-my-page-div">
      <div className="cleaners-my-page-wrapper">
        <span>안녕하세요, 김기사 기사님!</span>
      <h3 className="cleaners-my-page-title">총 정산금액: 3,000,000원</h3>

      <span className="cleaners-my-page-notice">※회원가입 시에 업로드한 사진을 교체하시려면 관리자에 문의 바랍니다.</span>

      <div className="cleaners-my-page-contents">
        <div className="cleaners-my-page-photo-frame">
        <img className="cleaners-my-page-profile-img" src="/icons/default-profile.png"/>
        </div>
        <div className="c">
          <span>오늘의 의뢰 건수: 10건</span>
          <span>오늘의 예약 건수: 1건</span>
        </div>
      </div>
      </div>
        <button type="button">프로필 편집</button>
        <button type="button">정보 수정</button>

        <div className="cleaners-my-page-buttons">
        <div className="cleaners-my-page">
        <button type="button">현재 정산 상태</button>  
        <button type="button">오늘 예정 일정</button>  
        </div>
        <div className="cleaners-my-page">
        <button type="button">오늘 작업 리스트</button> 
        </div>
        <div className="cleaners-my-page">
        <button type="button">대기(예약)</button>
        <button type="button">취소·미방문</button>
        <button type="button">정산 대기</button>
        <button type="button">완료</button>
        </div>
      </div>
      <div className="cleaners-my-page-lists-all-wrapper">

        <div className="cleaners-my-page-lists-1">
          <div className="cleaners-my-page-lists-1-layout">
          <span className="cleaners-my-page-lists-1-place">대구 중구 남일동</span>
            <div className="cleaners-my-page-lists-1-user-info">
              <div><span>이점주</span></div>
              <div><span>유명한 카페</span></div>
            </div>
          </div>
          <div className="cleaners-my-page-lists-1-status">
          예약
          </div>
        </div>

        <div className="cleaners-my-page-lists-2">
          <span className="cleaners-my-page-lists-2-place">대구 중구 남일동</span>
            <div className="cleaners-my-page-lists-2-user-info">
              <div><span>이점주</span></div>
              <div><span>유명한 카페</span></div>
            </div>
          <div className="cleaners-my-page-lists-2-status">
          예약
          </div>
        </div>

      </div>

        
    </div>
      
    </>
  )
}

export default CleanersMyPage;