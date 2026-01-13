import './AdminLogin.css';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminLoginThunk } from '../../../store/thunks/adminAuthThunk.js';

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. Redux 상태 가져오기 
  const { isLoading } = useSelector((state) => state.adminAuth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,  
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 페이지 새로고침 방지
    
    const resultAction = await dispatch(adminLoginThunk(formData));

    if(adminLoginThunk.fulfilled.match(resultAction)) {
      alert('로그인 성공!');
      navigate('/hospital');
    } 
    else if(adminLoginThunk.rejected.match(resultAction)) {
      const errorMsg = resultAction.payload?.msg || '로그인에 실패했습니다.';
      alert(errorMsg); 
    }
  };

  return (
    <div className="all-container">
      <div className="adminlogin-container">
        <div className="adminlogin-logo ice-doctor-logo1"></div>
        <form className="adminlogin-form-container" onSubmit={handleSubmit}>
          <label className="adminlogin-label-text">이메일</label>
          <input type="email" name='email'value={formData.email} onChange={handleChange} className="input-medium"/>
          <label className="adminlogin-label-text">비밀번호</label>
          <input type="password" name='password' value={formData.password} onChange={handleChange} className="input-medium"/>
          <button type="submit" className="adminlogin-login-btn" disabled={isLoading}> {isLoading ? '로그인 중' : '로그인' }</button>
        </form>
      </div>
    </div>
  );
}