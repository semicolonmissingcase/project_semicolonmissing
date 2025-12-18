import React, { useRef, useEffect } from "react";

export default function SmartEditor({ onContentChange }) {
  const editorRef = useRef([]);

  useEffect(() => {
    console.log("1. useEffect 시작");
    
    // 스크립트 동적 로드
    const script = document.createElement('script');
    script.src = '/smarteditor2/dist/js/service/HuskyEZCreator.js';
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    
    script.onload = () => {
      console.log("2. 스크립트 로드 완료!");
      console.log("3. window.nhn 존재?", !!window.nhn);
      
      if (window.nhn && window.nhn.husky) {
        console.log("4. 에디터 초기화 시작");
        
        window.nhn.husky.EZCreator.createInIFrame({
          oAppRef: editorRef.current,
          elPlaceHolder: "smartEditor",
          sSkinURI: "/smarteditor2/dist/index.html",
          htParams: {
            bUseToolbar: true,
            bUseVerticalResizer: true,
            bUseModeChanger: true,
          },
          fCreator: "createSEditor2",
          fOnAppLoad: function () {
            console.log("5. 에디터 로드 완료!");

            const updateContent = () => {
              if (editorRef.current[0]) {
                editorRef.current.getById["smartEditor"].exec("UPDATE_CONTENTS_FIELD", []);
                const content = document.getElementById("smartEditor").value;
                if (onContentChange) {
                  onContentChange(content);
                }
              }
            };

            const editorDoc = editorRef.current.getById["smartEditor"].oDoc;
            if (editorDoc) {
              editorDoc.addEventListener('keyup', updateContent);
              editorDoc.addEventListener('click', updateContent);
              editorDoc.addEventListener('paste', updateContent);
            }
          }
        });
      }
    };
    
    script.onerror = () => {
      console.error("스크립트 로드 실패!");
    };
    
    document.head.appendChild(script);

    return () => {
      const editorContainer = document.getElementById("smartEditor");
      if (editorContainer && editorContainer.parentNode) {
        const iframes = editorContainer.parentNode.querySelectorAll('iframe');
        iframes.forEach(iframe => iframe.remove());
      }
      editorRef.current = [];
      
      // 스크립트도 제거
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [onContentChange]);

  return (
    <div className="all-container">
      <textarea 
        name="smartEditor" id="smartEditor" />
    </div>
  );
}