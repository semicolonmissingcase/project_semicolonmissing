import './FavoriteCleaner.css'

// 찜한 기사님
export default function FavoriteCleaner() {

  return (
    <div className="tab-container">
      <div className="favorite-driver-grid">
        {[1, 2].map((i) => (
          <div key={i} className="fav-card">
            <div className="fav-avatar-large">🧊</div>
            <div className="fav-info">
              <h4>OOO 기사님 <span className="heart-red">♥</span></h4>
              <p className="rating-star">★ 4.8</p>
            </div>
            <div className="fav-btn-group">
              <button className="btn-cancel">찜 취소</button>
              <button className="btn-profile">프로필</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}