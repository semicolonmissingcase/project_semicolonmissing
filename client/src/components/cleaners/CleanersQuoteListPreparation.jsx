import './CleanersQuoteListPreparation.css';

function CleanersQuoteListPreparation () {

  

  return (
    <>

    <h3>자주 쓰는 견적서 양식</h3>

    <div calssName="cleaners-quote-list-preparation-wrapper">

      <div className="cleaners-quote-list-preparation-profile">

        <img className="cleaners-quote-list-preparation-profile-img" src="/icons/default-profile.png" alt="기사 프로필 사진"/>

        <span className="cleaners-quote-list-preparation-profile-name">OOO 기사님</span>
        <div className="cleaners-quote-list-preparation-profile-user-rating">
          <img src="/icons/star.png" alt="별점"/>
          <p className="cleaners-quote-list-preparation-profile-text">
            제빙기 전문 5년차, 친절하고 꼼꼼하게 작업합니다.
          </p>

        </div>

      </div>

      <div className="cleaners-quote-list-preparation-quote-list">

        <form>
          <label htmlFor="price">견적 금액</label>
          <input 
          name="price" 
          id="price" 
          className="cleaners-quote-list-preparation-quote-list-price"
          /> <span>원</span>
          

          <label htmlFor="details">견적 설명</label>
          <input 
          name="details" 
          id="details" 
          type="text" 
          placeholder="견적서 작성" 
          className="cleaners-quote-list-preparation-quote-list-details" / >  

          <button type="button">작성 취소</button>
          <button type="submit">임시 저장</button>

        </form> 
        
      </div>

    </div>
    </>
  )
}

export default CleanersQuoteListPreparation;

