import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./CleanersModalConfirmModal.css";

export function CleanersModalConfirmModal({ open, message, onClose, onConfirm }) {

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.    removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="cleaners-modal-modal-backdrop"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        // 바깥 클릭 닫기(원하면 제거 가능)
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="cleaners-modal-modal-box">

        <div className="cleaners-modal-cancel-submit-text-button">
        <div className="cleaners-modal-modal-text">
          {message}
        </div>

        <div className="cleaners-modal-modal-button-row">
          <button
            className="cleaners-modal-modal-button"
            type="button"
            onClick={onClose}
            style={{background: "var(--color-light-gray", borderRadius: "5px"}}
          >
            취소
          </button>

          <button
            className="cleaners-modal-modal-button"
            type="button"
            onClick={onConfirm}
            autoFocus
            style={{background: "var(--color-light-gray", borderRadius: "5px"}}
          >
            확인
          </button>
        </div>
        </div>

      </div>
    </div>,
    document.body
  );
}