import "./App.css"
import Header from "./components/header/Header.jsx"
import Main from "./components/main/Main.jsx"
import Footer from "./components/main/Footer.jsx"

function App() {

  return (
    <>
    <div className='app-header-container'>
      <Header />  
    </div>
    <Main /> 
    <Footer /> 
    </>
  )
}

export default App
