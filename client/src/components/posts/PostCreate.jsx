import "./PostCreate.css";
import React, { useState } from 'react';

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
    <div style={{ padding: '20px' }}>
      <h1>새 게시글 작성</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          {/* SmartEditor 컴포넌트 사용 */}
          <SmartEditor onContentChange={handleContentChange} />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>
          저장
        </button>
      </form>
    </div>
  );
};