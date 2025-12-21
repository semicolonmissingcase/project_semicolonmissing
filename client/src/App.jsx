import "./App.css"
import { Outlet, useLocation } from 'react-router-dom';
import Header from "./components/header/Header.jsx"
import Main from "./components/main/Main.jsx"
import Footer from "./components/main/Footer.jsx"
import MobileBottomNav from "./components/main/MobileBottomNav.jsx";
import React from 'react';

function App() {
  const Location = useLocation();

  const isChatpage = location.pathname.includes('/chatroom');
  
  return (
    <div className="App app-wrapper">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      {/* 데스크톱 푸터 */}
      {!isChatpage && <Footer className="desktop-footer"/>}

      {/* 모바일 하단 네이게이션 */}
      <MobileBottomNav />
    </div>
  )
}

export default App
