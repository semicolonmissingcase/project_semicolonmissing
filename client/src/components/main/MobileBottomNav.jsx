import { useNavigate, useLocation } from 'react-router-dom';
import './MobileBottomNav.css';

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: '◀',
      action: () => window.history.back(),
      path: null
    },
    {
      icon: '🏠',
      action: () => navigate('/'),
      path: '/'
    },
    {
      icon: '👤',
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