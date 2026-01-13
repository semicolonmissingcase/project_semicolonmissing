// import { CKEditor as BaseCKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import React from 'react';

// // Base64 업로드 어댑터
// class Base64UploadAdapter {
//   constructor(loader) {
//     this.loader = loader;
//   }

//   upload() {
//     return this.loader.file.then(
//       file =>
//         new Promise((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onload = () => {
//             resolve({ default: reader.result });
//           };
//           reader.onerror = error => {
//             reject(error);
//           };
//           reader.readAsDataURL(file);
//         })
//     );
//   }

//   abort() {
//     // 업로드 취소 로직 (필요시)
//   }
// }

// function Base64UploadAdapterPlugin(editor) {
//   editor.plugins.get('FileRepository').createUploadAdapter = loader => {
//     return new Base64UploadAdapter(loader);
//   };
// }

// export default function Editor({ onContentChange }) {
  
//   const editorUploadUrl = `${import.meta.env.VITE_APP_SERVER_URL}/api/posts/images/editor`;
//   console.log("--- [DEBUG] CKEditor uploadUrl:", editorUploadUrl);

//   return (
//     <div className="smart-editor-wrapper" style={{ width: '100%' }}>
//       <BaseCKEditor
//         editor={ClassicEditor}
//         config={{
//           licenseKey: 'GPL',
//           extraPlugins: [Base64UploadAdapterPlugin],
//           placeholder: "이미지를 드래그하거나 버튼을 눌러 추가해보세요.",
//           toolbar: [
//             'heading', '|', 
//             'bold', 'italic', 'link', 'uploadImage', 'insertTable', '|',
//             'bulletedList', 'numberedList', 'blockQuote', '|',
//             'undo', 'redo'
//           ],
//           ckfinder: {
//             uploadUrl: `${import.meta.env.VITE_APP_SERVER_URL}/api/posts/images/editor`,
//           },
//           image: {
//             toolbar: [
//               'imageStyle:inline',
//               'imageStyle:block',
//               'imageStyle:side',
//               '|',
//               'toggleImageCaption',
//               'imageTextAlternative'
//             ]
//           },
//           language: 'ko'
//         }}
//         data=""
//         onChange={(event, editor) => {
//           const data = editor.getData();
//           if (onContentChange) {
//             onContentChange(data);
//           }
//         }}
//       />
      
//       <style>{`
//         .ck-editor__editable {
//           min-height: 450px;
//           border-radius: 0 0 4px 4px !important;
//         }

//         @media screen and (max-width: 820px) {
//           .ck-editor__editable {
//             min-height: 350px;
//           }
//           .ck.ck-toolbar > .ck-toolbar__items {
//             flex-wrap: wrap !important;
//           }
//         }

//         @media screen and (max-width: 430px) {
//           .ck-editor__editable {
//             min-height: 250px;
//             padding: 0 10px !important;
//           }
//           .ck.ck-toolbar {
//             padding: 0 !important;
//           }
//           .ck.ck-button {
//             max-width: 30px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

import { CKEditor as BaseCKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import React from 'react';

/**
 * 서버 업로드 어댑터
 * post.uploader.js 미들웨어의 .single('image') 설정에 맞춰 
 * FormData의 키값을 'image'로 전송합니다.
 */
class ServerUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const formData = new FormData();
          // 중요: 미들웨어 필드명과 일치시켜야 함 (.single('image'))
          formData.append('image', file);

          fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/posts/images/editor`, {
            method: 'POST',
            body: formData,
            // 인증이 필요하다면 여기에 Authorization 헤더를 추가하세요.
          })
            .then((response) => response.json())
            .then((result) => {
              if (result.uploaded) {
                // 성공 시 서버에서 받은 이미지 URL을 에디터에 삽입
                resolve({ default: result.url });
              } else {
                reject(result.error?.message || '업로드 실패');
              }
            })
            .catch((error) => {
              reject('서버 연결 실패: ' + error.message);
            });
        })
    );
  }

  abort() {
    // 업로드 중단 로직 (필요 시 구현)
  }
}

// 어댑터를 플러그인으로 등록
function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new ServerUploadAdapter(loader);
  };
}

export default function Editor({ onContentChange }) {
  return (
    <div className="smart-editor-wrapper" style={{ width: '100%' }}>
      <BaseCKEditor
        editor={ClassicEditor}
        config={{
          licenseKey: 'GPL',
          // 1. 기존 Base64 대신 서버 업로드 플러그인 사용
          extraPlugins: [MyCustomUploadAdapterPlugin],
          placeholder: "이미지를 드래그하거나 버튼을 눌러 추가해보세요.",
          toolbar: [
            'heading', '|', 
            'bold', 'italic', 'link', 'uploadImage', 'insertTable', '|',
            'bulletedList', 'numberedList', 'blockQuote', '|',
            'undo', 'redo'
          ],
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
        .ck-editor__editable {
          min-height: 450px;
          border-radius: 0 0 4px 4px !important;
        }

        @media screen and (max-width: 820px) {
          .ck-editor__editable { min-height: 350px; }
          .ck.ck-toolbar > .ck-toolbar__items { flex-wrap: wrap !important; }
        }

        @media screen and (max-width: 430px) {
          .ck-editor__editable {
            min-height: 250px;
            padding: 0 10px !important;
          }
          .ck.ck-toolbar { padding: 0 !important; }
          .ck.ck-button { max-width: 30px; }
        }
      `}</style>
    </div>
  );
}