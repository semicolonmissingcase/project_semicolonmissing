import { CKEditor as BaseCKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function Editor({ onContentChange }) {
  
  // 기존의 useEffect(스크립트 로드 및 iframe 스타일 주입) 로직은 
  // 라이브러리 자체에서 처리하므로 모두 삭제되었습니다.

  return (
    <div className="smart-editor-wrapper" style={{ width: '100%' }}>
      <BaseCKEditor
        editor={ClassicEditor}
        config={{
          placeholder: "이미지를 드래그하거나 버튼을 눌러 추가해보세요.",
          toolbar: [
            'heading', '|', 
            'bold', 'italic', 'link', 'uploadImage', 'insertTable', '|', // uploadImage 추가
            'bulletedList', 'numberedList', 'blockQuote', '|',
            'undo', 'redo'
          ],
          // 이미지 업로드 시 데이터를 문자열(Base64)로 처리하는 설정
          image: {
            toolbar: [
              'imageStyle:inline',
              'imageStyle:block',
              'imageStyle:side',
              '|',
              'toggleImageCaption',
              'imageTextAlternative'
            ]
          },
          language: 'ko'
        }}
        data=""
        onChange={(event, editor) => {
          const data = editor.getData();
          if (onContentChange) {
            onContentChange(data);
          }
        }}
      />
      
      <style>{`
        /* 1. 기본 설정 (데스크탑) */
        .ck-editor__editable {
          min-height: 450px;
          border-radius: 0 0 4px 4px !important;
        }

        /* 2. 태블릿 및 작은 모니터 (820px 이하) */
        @media screen and (max-width: 820px) {
          .ck-editor__editable {
            min-height: 350px;
          }
          /* 툴바 안의 버튼 간격 미세 조정 */
          .ck.ck-toolbar > .ck-toolbar__items {
            flex-wrap: wrap !important; /* 아이콘이 넘치면 자동으로 아래로 */
          }
        }

        /* 3. 모바일 (430px 이하) */
        @media screen and (max-width: 430px) {
          .ck-editor__editable {
            min-height: 250px; /* 모바일은 화면이 작으므로 높이 축소 */
            padding: 0 10px !important; /* 좌우 여백 줄임 */
          }
          /* 모바일에서 툴바를 더 컴팩트하게 */
          .ck.ck-toolbar {
            padding: 0 !important;
          }
          .ck.ck-button {
            max-width: 30px; /* 버튼 크기 살짝 축소 */
          }
        }
      `}</style>
    </div>
  );
}