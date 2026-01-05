import { useNavigate, useLocation } from 'react-router-dom';
import './MobileBottomNav.css';
import { IoHome, IoPersonCircle, IoCaretBackSharp } from "react-icons/io5"


export default function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: <IoCaretBackSharp style={{ fontSize: '2rem', color: '#0C1B41'}} />,
      action: () => window.history.back(),
      path: null
    },
    {
      icon: <IoHome style={{ fontSize: '2rem', color: '#0C1B41'}} />,
      action: () => navigate('/'),
      path: '/'
    },
    {
      icon: <IoPersonCircle style={{ fontSize: '2rem', color: '#0C1B41'}} />,
      action: () => navigate('/mypage'),
      path: '/mypage'
    }
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item, index) => (
        <button
          key={index}
          className={`mobile-bottom-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={item.action}
        >
          <span className="mobile-bottom-icon">{item.icon}</span>
          <span className="mobile-bottom-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}