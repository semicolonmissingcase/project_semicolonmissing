import React, { useRef, useEffect } from "react";

export default function SmartEditor({ onContentChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (window.nhn && window.nhn.husky) {
      // 에디터 생성 함수 호출
      window.nhn.husky.EZCreator.createInIFrame({
        oAppRef: editorRef,
        elPlaceHolder: "smartEditor",
        sSkinURI: "/smarteditor2/workspace/static/SmartEditor2Skin-2.10.0.html",
        htParams: {
          bUseToolbar: true,
          bUseVerticalResizer: true,
          bUseModeChanger: true,
        },
        fCreator: "createSEditor2",
        fOnAppLoad: function (oEditor) {
          // 에디터 인스턴스를 ref에 저장
          editorRef.current = oEditor;

          // 에디터의 내용을 가져오는 함수
          const updateContent = () => {
            if (editorRef.current) {
              editorRef.current.getById["smartEditor"].exec("UPDATE_CONTENTS_FIELD", []);
              const content = document.getElementById("smartEditor").value;
              if (onContentChange) {
                onContentChange(content);
              }
            }
          };

          // 키보드를 누르거나 마우스를 클릭할 때마다 내용 업데이트
          const editorDoc = editorRef.current.getById["smartEditor"].oDoc;
          if (editorDoc) {
            editorDoc.addEventListener('keyup', updateContent);
            editorDoc.addEventListener('click', updateContent);
            editorDoc.addEventListener('paste', updateContent);
          }
        }
      });
    }

    // 컴포넌트가 언마운트될 때 에디터 인스턴스 정리
    return () => {
      const editorContainer = document.getElementById("smartEditor");
      if (editorContainer && editorContainer.parentNode) {
        // 스마트에디터2는 공식적인 destroy 메소드가 없으므로 DOM 정리
        const iframes = editorContainer.parentNode.querySelectorAll('iframe');
        iframes.forEach(iframe => iframe.remove());
      }
      editorRef.current = null;
    };
  }, [onContentChange]);

  return (
    <textarea 
      name="smartEditor" 
      id="smartEditor" 
      rows="10" 
      cols="100" 
      style={{ width: '100%' }}
    />
  );
}