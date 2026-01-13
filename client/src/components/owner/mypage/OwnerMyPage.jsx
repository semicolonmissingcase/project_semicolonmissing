import React, { useEffect, useState } from 'react';
import './OwnerMyPage.css';
import Estimates from './Estimates.jsx'; // 받은견적
import Reservations from './Reservations.jsx'; // 예약내역
import MyReviews from './MyReviews.jsx'; // 내 리뷰
import FavoriteCleaner from './FavoriteCleaner.jsx'; // 찜한 기사님
import InquiryHistory from './InquiryHistory.jsx' // 문의내역
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { uploadProfileImageThunk } from '../../../store/thunks/authThunk.js';
import { getOwnerStats } from '../../../api/axiosOwner.js';

export default function OwnerMyPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const APP_SERVER_URL = import.meta.env.VATE_APP_SERVER_URL
  const { user, loading } = useSelector((state) => state.auth);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [activeTab, setActiveTab] = useState('받은 견적');
  const [isModalOpen, setIsModalOpen] = useState(false); // 프로필 모달
  const [stats, setStats] = useState(null); // 상단 통계용

  const renderTabContent = () => {
    switch (activeTab) {
      case '받은 견적': return <Estimates />;
      case '예약 완료': return <Reservations />;
      case '리뷰 관리': return <MyReviews />;
      case '찜한 기사님': return <FavoriteCleaner />;
      case '문의 내역': return <InquiryHistory />;
      default: return <div style={{padding: '20px'}}>준비 중인 페이지입니다.</div>;
    }
  };

  // 상단 통계용
  useEffect(() => {
    const fetchStats = async() => {
      try {
        const statsData = await getOwnerStats();
        setStats(statsData);
      } catch (error) {
        console.error('마이페이지 통계 로딩 실패:', error);
      }
    };

    fetchStats();
  }, []);

  // 미리보기 업뎃
  useEffect(() => {
    setIsModalOpen(false);
    setSelectedFile(null);
    if(user && user.profile) {      
      setPreviewUrl(user.profile);
    } else {
      setPreviewUrl('/icons/default-profile.png');
    }
  }, [user, APP_SERVER_URL]);

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if(file) {
      setSelectedFile(file);
      // 선택한 파일로 즉시 미리보기 url 생성
      const reader = new FileReader();

      reader.onloadend = () => {
        if(typeof reader.result === 'string') {
          setPreviewUrl(reader.result);
          setIsModalOpen(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 취소 핸들러
  const handleCancelUpload = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    
    if(user && user.profile) {
      setPreviewUrl(APP_SERVER_URL + user.profile);
    } else {
      setPreviewUrl('/icons/default-profile.png');
    }
  }

  // 업로드 핸들러
  const handleUpload = () => {
    if(!selectedFile) {
      alert('새로운 프로필 이미지를 선택해주세요.');
      return
    }

    dispatch(uploadProfileImageThunk(selectedFile))
      .unwrap()
      .then(() => {
        setIsModalOpen(false); // 업로드 성공시 모달 닫기
        setSelectedFile(null); // 파일 선택 상태 초기화
      })
      .catch((error) => {
        alert('업로드에 실패했습니다. 다시 시도해주세요.')
      });
  };
  
  // 네비게이션 부분
  function userInfo() {
    navigate('/owners/info');
  }

  return (
    <div className="owner-mypage-container">
      {/* 1. 상단 프로필 */}
      <header className="owner-mypage-profile-header">
        <button className="owner-mypage-edit-info-btn" onClick={userInfo}>회원정보 수정</button>
        <div className="owner-mypage-profile-main">
          <div className="owner-mypage-profile-image-container">
            <div className="owner-mypage-profile-placeholder-img" style={{ backgroundImage: `url('${previewUrl}')` }}></div>
            <button className="owner-mypage-profile-edit-badge"></button>
            <input 
              type="file" 
              id="profile-upload" 
              style={{ display: 'none' }} 
              accept="image/*" 
              onChange={handleFileChange}
            />

            {/* 연필 모양의 버튼 역할을 하는 label */}
            <label 
              htmlFor="profile-upload" 
              className="owner-mypage-profile-edit-badge">
            </label>
          </div>

            <div className="owner-mypage-info-container">
              <div className="owner-mypage-profile-info">
                <h2>{user?.name}</h2>
                <p>{user?.email}</p>
              </div>

              {isModalOpen && (
                <div className="owner-mypage-modal-overlay">
                  <div className="owner-mypage-modal-content">
                    <h3>프로필 이미지 미리보기</h3>
                    <img src={previewUrl} alt="프로필 미리보기" className="owner-mypage-modal-preview-img"/>
                    <div className="owner-mypage-modal-btns">
                      <button onClick={handleCancelUpload} className="owner-mypage-modal-btn-cancel">
                        취소
                      </button>
                      <button onClick={handleUpload} disabled={loading} className="owner-mypage-modal-btn-save">
                        {loading ? '저장 중...' : '저장하기'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="owner-mypage-stats-container">
                <div className="owner-mypage-stat-item">
                  <p>이용 횟수</p>
                  <p>{stats ? stats.completedReservations : '-'}</p>
                </div>
                <div className="owner-mypage-stat-item">
                  <p>리뷰 갯수</p>
                  <p>{stats ? stats.reviewCount : '-'}</p>
                </div>
                <div className="owner-mypage-stat-item">
                  <p>견적 요청</p>
                  <p>{stats ? stats.totalReservations : '-'}</p>
                </div>
                <div className="owner-mypage-stat-item">
                  <p>받은 견적</p>
                  <p>{stats ? stats.estimateCount : '-'}</p>
                </div>
              </div>
            </div>
        </div>
      </header>

      {/* 2. 탭 메뉴 */}
      <nav className="owner-mypage-tabs">
        {['받은 견적', '예약 완료', '리뷰 관리', '찜한 기사님', '문의 내역'].map(tab => (
          <button 
            key={tab}
            className={`owner-mypage-tab-item ${activeTab === tab ? 'owner-mypage-active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* 3. 동적 컨텐츠 렌더링 */}
      <div className="owner-mypage-tab-content-wrapper">
        {renderTabContent()}
      </div>
    </div>
  );
};