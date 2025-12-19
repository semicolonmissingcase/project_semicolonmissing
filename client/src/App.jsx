import "./App.css"
import { Outlet, useLocation } from 'react-router-dom';
import Header from "./components/header/Header.jsx"
import Main from "./components/main/Main.jsx"
import Footer from "./components/main/Footer.jsx"
import React from 'react';

function App() {
  const Location = useLocation();

  const isChatpage = location.pathname.includes('/chatroom');
  
  return (
    <div className="App">
      <Header />
      <main>
        <Outlet />
      </main>
      {!isChatpage && <Footer />}
    </div>
  )
}

export default App
