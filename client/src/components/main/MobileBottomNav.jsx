import { useNavigate, useLocation } from 'react-router-dom';
import './MobileBottomNav.css';

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: '◀',
      label: '뒤로가기',
      action: () => window.history.back(),
      path: null
    },
    {
      icon: '🏠',
      label: '홈',
      action: () => navigate('/'),
      path: '/'
    },
    {
      icon: '👤',
      label: '마이페이지',
      action: () => navigate('/mypage'),
      path: '/mypage'
    }
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item, index) => (
        <button
          key={index}
          className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={item.action}
        >
          <span className="mobile-nav-icon">{item.icon}</span>
          <span className="mobile-nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}