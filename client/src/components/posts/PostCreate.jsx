import "./PostCreate.css";
import React, { useState } from 'react';
import SmartEditor from '../editor/SmartEditor.jsx'; 

export default function PostCreate () {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // SmartEditor의 내용이 변경될 때마다 호출될 함수
  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 'content' state에는 에디터의 HTML 내용이 담겨 있습니다.
    console.log('제목:', title);
    console.log('내용:', content);
    // 여기서 서버로 제목과 내용을 전송하는 API를 호출하면 됩니다.
  };

  return (
    <div className="all-container">   
      <form onSubmit={handleSubmit}>
        <div className="postcreate-title-container">
          <input type="text" placeholder="제목을 입력하세요" value={title} 
            onChange={(e) => setTitle(e.target.value)} className="postcreate-title" />
        </div>
        <div className="postcreate-content">
          {/* SmartEditor 컴포넌트 사용 */}
          <SmartEditor onContentChange={handleContentChange} />
        </div>
        <div className="postcreate-btn-container">
        <button type="submit" className="postcreate-save-btn">
          저장
        </button>
        </div>
      </form>
    </div>
  );
};