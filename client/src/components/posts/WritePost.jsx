import Editor from "../editor/Editor.jsx";

export default function WritePost({ onContentChange }) {
  return (
    <div className="write-post-container">
      {/* 부모로부터 받은 onContentChange를 자식에게 전달 */}
      <Editor onContentChange={onContentChange} />
    </div>
  );
}