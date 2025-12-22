import { useRef, useEffect } from "react";

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
          sSkinURI: "/smarteditor2/dist/SmartEditor2Skin.html", // ← 파일명 확인!
          htParams: {
            bUseToolbar: true,
            bUseVerticalResizer: true,
            bUseModeChanger: true,
          },
          fCreator: "createSEditor2",
          fOnAppLoad: function () {
            console.log("5. 에디터 로드 완료!");

            // 내용 업데이트 함수
            const updateContent = () => {
              if (editorRef.current[0]) {
                editorRef.current[0].exec("UPDATE_CONTENTS_FIELD", []);
                const content = document.getElementById("smartEditor").value;
                if (onContentChange) {
                  onContentChange(content);
                }
              }
            };

            // 이벤트 리스너 등록 (iframe 내부 문서에)
            try {
              const editorFrame = document.querySelector('iframe[id*="smartEditor"]');
              if (editorFrame && editorFrame.contentDocument) {
                const editorBody = editorFrame.contentDocument.body;
                editorBody.addEventListener('keyup', updateContent);
                editorBody.addEventListener('click', updateContent);
                editorBody.addEventListener('paste', updateContent);
              }
            } catch (error) {
              console.error("이벤트 리스너 등록 실패:", error);
            }
          }
        });
      } else {
        console.error("window.nhn.husky가 없습니다!");
      }
    };
    
    script.onerror = () => {
      console.error("스크립트 로드 실패! 경로를 확인하세요: /smarteditor2/dist/js/service/HuskyEZCreator.js");
    };
    
    document.head.appendChild(script);

    return () => {
      // 정리 작업
      const editorContainer = document.getElementById("smartEditor");
      if (editorContainer && editorContainer.parentNode) {
        const iframes = editorContainer.parentNode.querySelectorAll('iframe');
        iframes.forEach(iframe => iframe.remove());
      }
      editorRef.current = [];
      
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [onContentChange]);

  return (
    <div className="smart-editor-wrapper">
      <textarea 
        name="smartEditor" 
        id="smartEditor"
        style={{ width: '100%', height: '400px' }}
      />
    </div>
  );
}