import { useNavigate } from "react-router-dom";
import "./PostCreate.css";
import WritePost from "./WritePost.jsx";
import React from 'react';

export default function PostCreate () {
  const navigate = useNavigate();

  function qnaPage() {
    navigate('/qnaposts');
  }

  function resultPage() {
    navigate('/results')
  };

  return (
    <div className="postcreate-background">
      <div className="all-container postcrete-container"> 
      <div className="postcreat-title">
        <h2>문의 등록</h2>
      </div>
        <WritePost />  
        <div className="postcreate-btn-container">
          <button type="button" className="bg-light btn-medium" onClick={qnaPage}>
            작성 취소
          </button>
          <button type="button" className="bg-blue btn-medium" onClick={resultPage}>
            문의 하기
          </button>
        </div>
      </div>
    </div>
  );
};