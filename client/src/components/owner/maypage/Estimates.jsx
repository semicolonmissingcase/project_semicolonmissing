import React, { useState } from 'react';
import './Estimates.css';

export default function Estimates() {
  // 선택된 매장 정보를 저장하는 상태 (초기값은 null)
  const [selectedStore, setSelectedStore] = useState(null);

  // 임시 데이터 (나중에 백엔드 API에서 가져올 부분)
  const stores = [
    { id: 1, name: '매장이름A', address: '서울시 강남구', date: '2025/12/30', time: '14:00' },
    { id: 2, name: '매장이름B', address: '서울시 서초구', date: '2025/12/31', time: '10:00' },
    { id: 3, name: '매장이름C', address: '경기도 성남시', date: '2026/01/02', time: '16:00' },
    { id: 3, name: '매장이름C', address: '경기도 성남시', date: '2026/01/02', time: '16:00' },
    { id: 3, name: '매장이름C', address: '경기도 성남시', date: '2026/01/02', time: '16:00' },
    { id: 3, name: '매장이름C', address: '경기도 성남시', date: '2026/01/02', time: '16:00' },
    { id: 3, name: '매장이름C', address: '경기도 성남시', date: '2026/01/02', time: '16:00' },
    { id: 3, name: '매장이름C', address: '경기도 성남시', date: '2026/01/02', time: '16:00' },
  ];

  const handleSelectStore = (store) => {
    setSelectedStore(store);
    // 클릭 시 하단으로 자동 스크롤하고 싶다면 여기에 로직 추가 가능
  };

  return (
    <div className="estimates-page">
      <div className="estimates-tab-container">
        <h3 className="estimates-tab-title">견적 요청 목록</h3>
        
        <div className="estimates-request-scroll-container">
          {stores.map((store) => (
            <div key={store.id} className="estimates-quote-request-card">
              <div className="estimates-req-header">{store.name}</div>
              <div className="estimates-req-body">
                <p>{store.address}</p>
                <p>{store.date}</p>
                <p>{store.time}</p>
              </div>
              <button 
                className={`estimates-confirm-quote-btn ${selectedStore?.id === store.id ? 'active' : ''}`}
                onClick={() => handleSelectStore(store)}
              >
                {selectedStore?.id === store.id ? '확인 중' : '받은 견적 확인'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 매장이 선택되었을 때만 하단 영역 노출 */}
      {selectedStore && (
        <div className="estimates-bottom-blue-section">
          <div className="estimates-tab-container">
            <div className="estimates-store-selection-banner">
              {selectedStore.name}
            </div>

            <div className="estimates-driver-quote-grid">
              {[1, 2].map((driver) => (
                <div key={driver} className="estimates-driver-selection-card">
                  <div className="estimates-driver-profile-row">
                    <div className="estimates-driver-image-box">
                      <img 
                        src="https://via.placeholder.com/120" 
                        alt="기사님" 
                        className="estimates-driver-img"
                      />
                    </div>
                    <div className="estimates-driver-brief">
                      <h4>OOO 기사님 <span className="estimates-heart-icon">♡</span></h4>
                      <p>리뷰 점수 4.9</p>
                      <p>작업 건수 150건</p>
                    </div>
                  </div>
                  
                  <div className="estimates-quote-price-section">
                    <div className="estimates-price-info">
                      <span className="estimates-label">견적금액</span>
                      <span className="estimates-price">150,000원</span>
                    </div>
                  </div>

                  <div className="estimates-card-action-row">
                    <button className="estimates-btn-light">견적서 보기</button>
                    <button className="estimates-btn-primary">채팅하기</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}