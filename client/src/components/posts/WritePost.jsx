import { useRef, useEffect } from "react";

export default function SmartEditor({ onContentChange }) {
  const editorRef = useRef([]);

  useEffect(() => {
    
    const script = document.createElement('script');
    script.src = '/smarteditor2/dist/js/service/HuskyEZCreator.js';
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    
    script.onload = () => {
      
      if (window.nhn && window.nhn.husky) {
        
        // 화면 너비에 따라 에디터 높이 설정
        const isMobile = window.innerWidth <= 820;
        const editorHeight = isMobile ? 300 : 400;
        
        window.nhn.husky.EZCreator.createInIFrame({
          oAppRef: editorRef.current,
          elPlaceHolder: "smartEditor",
          sSkinURI: "/smarteditor2/dist/SmartEditor2Skin.html",
          htParams: {
            bUseToolbar: true,
            bUseVerticalResizer: true,
            bUseModeChanger: true,
            fOnBeforeUnload: function(){},
          },
          fCreator: "createSEditor2",
          fOnAppLoad: function () {

            // 모바일에서 에디터 높이 조정
            const editorFrame = document.querySelector('iframe[id*="smartEditor"]');
            if (editorFrame && isMobile) {
              editorFrame.style.height = editorHeight + 'px';
              editorFrame.style.maxWidth = '100%';
              editorFrame.style.width = '100%';
            }

            const updateContent = () => {
              if (editorRef.current[0]) {
                editorRef.current[0].exec("UPDATE_CONTENTS_FIELD", []);
                const content = document.getElementById("smartEditor").value;
                if (onContentChange) {
                  onContentChange(content);
                }
              }
            };

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
      }
    };
    
    script.onerror = () => {
      console.error("스크립트 로드 실패!");
    };
    
    document.head.appendChild(script);

    // 화면 크기 변경 감지
    const handleResize = () => {
      const editorFrame = document.querySelector('iframe[id*="smartEditor"]');
      if (editorFrame) {
        const isMobile = window.innerWidth <= 820;
        if (isMobile) {
          editorFrame.style.maxWidth = '100%';
          editorFrame.style.width = '100%';
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      
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