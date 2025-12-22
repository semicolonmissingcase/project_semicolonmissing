import './AdminLogin.css';

export default function AdminLogin() {

  return (
    <div className="all-container">
      <div className="adminlogin-container">
        <div className="adminlogin-logo ice-doctor-logo1"></div>
        <div className="adminlogin-form-container">
          <label className="adminlogin-label-text">이메일</label>
          <input type="text" className="input-medium"/>
          <label className="adminlogin-label-text">비밀번호</label>
          <input type="text" className="input-medium"/>
          <button type="button" className="adminlogin-login-btn">로그인</button>
        </div>
      </div>
    </div>
  )
}