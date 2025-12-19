import './CleanerQuoteListPreparation.css';

function CleanerQuotationPreparation () {



  return (
    <>

    <h3>자주 쓰는 견적서 양식</h3>

    <div calssName="cleaner-quotation-preparation-wrapper">

      <div className="cleaner-quotation-preparation-profile">

        <img className="cleaner-quotation-preparation-profile-img" src="/icons/default-profile.png" alt="기사 프로필 사진"/>

        <span className="cleaner-quotation-preparation-profile-name">OOO 기사님</span>
        <div className="cleaner-quotation-preparation-profile-user-rating">
          <img src="/icons/star.png" alt="별점"/>
          <p className="cleaner-quotation-preparation-profile-text">
            제빙기 전문 5년차, 친절하고 꼼꼼하게 작업합니다.
          </p>

        </div>

      </div>

      <div className="cleaner-quotation-preparation-quotation">

        <form>
          <label htmlFor="price">견적 금액</label>
          <input name="price" id="price" className="cleaner-quotation-preparation-quotation-price" /><span>원</span>
          {/* 그.. 코드로 적어서 필터? 역할 하는 기호로 숫자만 쓸 수 있게.. 하기 */}

          <label htmlFor="details">견적 설명</label>
          <input name="details" id="details" type="text" placeholder="견적서 작성" className="cleaner-quotation-preparation-quotation-details" / >  

          <button type="button">작성 취소</button>
          <button type="submit">임시 저장</button>

        </form> 
        
      </div>

    </div>
    </>
  )
}

export default CleanerQuotationPreparation;