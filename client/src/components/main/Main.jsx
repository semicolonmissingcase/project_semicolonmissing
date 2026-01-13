import "./MainTopSection.css";
import "./MainCleaningInfo.css";
import "./MainServiceProcess.css";
import "./MainQna.css";
import { useState } from "react";
import MainQna from "./MainQna.jsx";

export default function Main() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = ['/icons/임시1.jpg', '/icons/임시2.jpg'];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* 메인 이미지 */}
      <div>
        <div className="main-top-img">
          <div className="main-top-text">
            <h2>전문 기사님과<br />카페를 바로 연결!</h2>
            <p>
              정기 청소로 얼음은 항상 깨끗하게,<br />
              관리 부담은 최소로.<br />
              간편한 매칭으로 시간과 비용을 절약하세요.
            </p>
          </div>
        </div>     
      </div>

      {/* 제빙기 청소 왜 하는지에 대한 설명 */}
      <div className="all-container main-cleaning-info">
        <div className="main-cleaning-info-text">
          <h2>깨끗한 얼음을 위한 선택</h2><br />
          <p>
            세균, 곰팡이, 석회질, 보이지 않는 얼음 속 위험, 방치하면 음료 맛과 위생에 큰 영향을 줍니다. <br />
            정기적인 제빙기 청소는 깨끗하고 맛있는 얼음 유지, 세균 걱정 없는 안전한 음료, 기계 수명 연장까지 한 번에 해결합니다.<br />
            전문 청소 기사님들이 신속하고 철저하게 제빙기를 관리해 드립니다.<br />
            지금 바로 청소 예약하고, 건강하고 신선한 얼음을 경험하세요.<br />
          </p>
        </div>
        <div className="main-cleaning-info-images">
          <button className="main-carousel-control main-carousel-prev" onClick={prevSlide}>
            ◀
          </button>
          <div className="main-carousel-wrapper" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {images.map((img, index) => (
              <div
                key={index}
                className="main-cleaning-info-img"
                style={{ backgroundImage: `url('${img}')` }}
              ></div>
            ))}
          </div>
          <button className="main-carousel-control main-carousel-next" onClick={nextSlide}>
            ▶
          </button>
        </div>
      </div>

      {/* 서비스 진행 방식 */}
      <div className="main-howto-service">
        <h2>제빙기 케어 진행 과정</h2>
        <div className="main-howto-service-container">
          <div className="main-howto-service-step">
            <div className="main-howto-service-img" style={{ backgroundImage: `url('/icons/service1.png')` }}></div>
            <p>점주님이 예약 신청서를 작성해줍니다.</p>
          </div>
          <div className="main-howto-service-arrow">▶</div>
          <div className="main-howto-service-step">
            <div className="main-howto-service-img" style={{ backgroundImage: `url('/icons/service2.png')` }}></div>
            <p>기사님께서 견적서를 보내주십니다.</p>
          </div>
          <div className="main-howto-service-arrow">▶</div>
          <div className="main-howto-service-step">
            <div className="main-howto-service-img" style={{ backgroundImage: `url('/icons/service3.png')` }}></div>
            <p>채팅을 통해 대화하며 자세한 종율 후 매칭됩니다.</p>
          </div>
          <div className="main-howto-service-arrow">▶</div>
          <div className="main-howto-service-step">
            <div className="main-howto-service-img" style={{ backgroundImage: `url('/icons/service4.png')` }}></div>
            <p>결제 후 예약이 완료되면 기사님께서 방문하십니다.</p>
          </div>
        </div>
      </div>

      {/* 주요문의 */}
      <div>
        <MainQna />
      </div>
    </>
  )
}