import './CleanerMyPageM.css';

function CleanerMyPageM () {

  return (
    <>
    <div className="cleaner-my-page-div">
      <div className="cleaner-my-page-wrapper">
      <h3 className="cleaner-my-page-title">프로필 편집</h3>

      <span className="cleaner-my-page-notice">※회원가입 시에 업로드한 사진을 교체하시려면 관리자에 문의 바랍니다.</span>

      <div className="cleaner-my-page-contents">
        <div className="cleaner-my-page-photo-frame">
        <img className="cleaner-my-page-profile-img" src="/icons/default-profile.png"/>
        </div>
        <div className="">
          <h4>안녕하세요, 김기사 기사님!</h4>
          <span>총 정산금액: <br/> 3,000,000원</span>
          <span>오늘의 의뢰 건수: 10건</span>
          <span>오늘의 예약 건수: 1건</span>
        </div>
      </div>
      </div>
        <button type="button">프로필 편집</button>
        <button type="button">정보 수정</button>
    </div>
      <div className="cleaner-my-page-buttons">
        <div className="cleaner-my-page">
        <button type="button">현재 정산 상태</button>  
        <button type="button">오늘 예정 일정</button>  
        </div>
        <div className="cleaner-my-page">
        <button type="button">오늘 작업 리스트</button> 
        </div>
        <div className="cleaner-my-page">
        <button type="button">대기(예약)</button>
        <button type="button">취소·미방문</button>
        <button type="button">정산 대기</button>
        <button type="button">완료</button>
        </div>
      </div>
      
    </>
  )
}

export default CleanerMyPageM;