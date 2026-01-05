import { useNavigate } from "react-router-dom";
import "./Registration.css";

export default function Registration () {
  const navigate = useNavigate();

  function ownerRegistration() {    
    navigate('owners');
  };
  
  function cleanersRegistration() {
    navigate('cleaners');
  };

  return (
    <div className="all-container">
      <div className="registration-container">
        <div className="ice-doctor-logo1 registration-logo"></div>
        <div className="registration-card-container">
          <div className="card-shadow registration-btn-container">
            <div className="registration-comment">
              <p className="registration-top-comment">안녕하세요, 점주님!</p><br />
              <p>아이스 닥터에서<br />
                제빙기 관리 기사님을 찾아보시고<br />
                매장의 제빙기를 관리해보세요!
              </p>
            </div>
            <div className="registration-owner-img" style={{ backgroundImage: `url('/icons/owner.svg')` }}></div>
            <button type="button" className="btn-medium bg-blue" onClick={ownerRegistration}>점주님 회원가입</button>
          </div>
          <div className="card-shadow registration-btn-container">
            <div className="registration-comment">
              <p className="registration-top-comment">안녕하세요, 기사님!</p><br />
              <p>아이스 닥터에서<br />
                부담 없이 첫 고객을 만나보시고<br />
                좋은 인연 이어가세요!
              </p>
            </div>
            <div className="registration-owner-img" style={{ backgroundImage: `url('/icons/cleaner.png')` }}></div>
            <button type="button" className="btn-medium bg-blue" onClick={cleanersRegistration}>기사님 회원가입</button>
          </div>
        </div>
      </div>
    </div>
  );
};