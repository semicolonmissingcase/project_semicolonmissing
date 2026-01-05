import React from 'react';
import './StoreSelectModal.css';

export default function StoreSelectModal({ isOpen, onClose, onSelect, stores, loading }) {
  if (!isOpen) {
    return null;
  }

  const handleSelect = (store) => {
    onSelect(store); 
    onClose();      
  };

  return (
    <div className="store-select-modal-overlay" onClick={onClose}>
      {/* 모달 컨텐츠  */}
      <div className="store-select-modal-content" onClick={(e) => e.stopPropagation()}>

        {/* 모달 헤더 */}
        <div className="store-select-modal-header">
          <h2>내 매장 목록</h2>
          <button className="store-select-modal-close-btn" onClick={onClose}>×</button>
        </div>

        {/* 매장 목록 */}
        <div className="store-select-modal-body">
          {loading ? (
            <p>매장 목록을 불러오는 중...</p>
          ) : stores.length > 0 ? (
            <ul className="store-select-modal-list">
              {stores.map(store => (
                <li key={store.id} className="store-select-modal-item" onClick={() => handleSelect(store)}>
                  <div className="store-item-info">
                    <strong className="store-item-name">{store.name}</strong>
                    <p className="store-item-address">{store.address}</p>
                  </div>
                  <button className="store-item-select-btn">선택</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>등록된 매장이 없습니다.</p>
          )}
        </div>

      </div>
    </div>
  );
}