import "./App.css"
import { Outlet } from 'react-router-dom';
import Header from "./components/header/Header.jsx"
import Main from "./components/main/Main.jsx"
import Footer from "./components/main/Footer.jsx"
import React from 'react';

function App() {

  return (
    <div className="App">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App
