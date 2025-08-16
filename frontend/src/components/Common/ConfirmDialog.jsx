import React from "react";
import Modal from "./Modal";

export default function ConfirmDialog({ open, title = "Are you sure?", message = "", confirmText = "Confirm", cancelText = "Cancel", variant = "danger", onConfirm, onCancel }) {
  return (
    <Modal open={open} onClose={onCancel} title={title} footer={
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-3 py-2 border rounded"> {cancelText} </button>
        <button
          onClick={onConfirm}
          className={`px-3 py-2 rounded text-white ${variant === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {confirmText}
        </button>
      </div>
    }>
      {message && <p className="text-gray-600">{message}</p>}
    </Modal>
  );
}
