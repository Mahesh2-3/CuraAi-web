import React from "react";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
      <div
        className="bg-zinc-800 border border-zinc-700 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
          <p className="text-zinc-400 text-sm mb-6">{message}</p>

          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-zinc-700 text-white hover:bg-zinc-600 transition-colors font-medium border border-zinc-600"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors font-medium shadow-[0_4px_14px_0_rgba(239,68,68,0.39)]"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
