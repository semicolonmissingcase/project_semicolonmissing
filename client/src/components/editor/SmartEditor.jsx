import { useRef, useEffect } from "react";

export default function SmartEditor({ onContentChange }) {
  const editorRef = useRef([]);

  useEffect(() => {
    // 스크립트 동적 로드
    const script = document.createElement('script');
    script.src = '/smarteditor2/dist/js/service/HuskyEZCreator.js';
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    
    script.onload = () => {
      if (window.nhn && window.nhn.husky) {
        window.nhn.husky.EZCreator.createInIFrame({
          oAppRef: editorRef.current,
          elPlaceHolder: "smartEditor",
          sSkinURI: "/smarteditor2/dist/SmartEditor2Skin.html",
          htParams: {
            bUseToolbar: true,
            bUseVerticalResizer: true,
            bUseModeChanger: true,
            fOnBeforeUnload: function() {},
            I18N_Locale: 'ko_KR',
          },
          fCreator: "createSEditor2",
          fOnAppLoad: function () {
            const editorFrame = document.querySelector('iframe[id*="smartEditor"]');
            if (editorFrame) {
              editorFrame.style.width = '100%';
              editorFrame.style.minWidth = '0';

              const innerDoc = editorFrame.contentDocument || editorFrame.contentWindow.document;
              if (innerDoc) {
                const style = innerDoc.createElement('style');
                style.innerHTML = `
                  /* 1. 툴바 배경 및 높이 제한 완전 해제 */
                  .se2_tool, .se2_tool_wrapper {
                      height: auto !important;
                      display: block !important;
                      padding: 5px !important;
                      background: #f8f9fa !important;
                      white-space: normal !important;
                  }

                  /* 2. 아이콘 그룹(ul) - 가로로 나열되다 공간 없으면 자동으로 내려감 */
                  .se2_tool ul {
                      display: inline-block !important;
                      float: left !important;
                      vertical-align: top !important;
                      margin: 2px 3px !important;
                      padding: 0 !important;
                      height: auto !important;
                      white-space: nowrap !important; /* 그룹 내 아이콘끼리는 유지 */
                  }

                  /* 3. [파란박스 타겟팅] 정렬/목록 그룹 강제 줄바꿈 */
                  /* 정렬 아이콘(justify)이 포함된 li의 부모 ul을 강제로 새 줄로 밀어냄 */
                  .se2_tool ul:has(.se2_justify), 
                  .se2_tool ul:has(.husky_seditor_ui_justifyleft),
                  .se2_tool ul:has(.se2_ol) {
                      clear: both !important;
                      display: block !important;
                      width: 100% !important;
                      margin-top: 8px !important;
                      padding-top: 5px !important;
                      border-top: 1px solid #e2e2e2 !important;
                  }

                  /* 4. 사진/지도 버튼(se2_multy) 우측 고정 해제 */
                  .se2_multy {
                      position: static !important;
                      float: left !important;
                      margin-left: 3px !important;
                      border-left: 1px solid #ddd !important;
                  }

                  /* 5. 에디터 본문 및 컨테이너 반응형 */
                  .se2_input_area, .se2_main, .se2_container { 
                      width: 100% !important; 
                      min-width: 0 !important; 
                  }
                `;
                innerDoc.head.appendChild(style);
              }
            }

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

            // 이벤트 리스너 등록
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
    
    document.head.appendChild(script);

    return () => {
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
    <div className="smart-editor-wrapper" style={{ width: '100%' }}>
      <textarea 
        name="smartEditor" 
        id="smartEditor"
        style={{ width: '100%', height: '400px' }}
      />
    </div>
  );
}