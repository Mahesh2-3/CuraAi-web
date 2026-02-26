import React from "react";
import { AlertTriangle, X, CheckCircle, Info } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  isAlert = false,
  type = "danger", // 'danger', 'success', 'info'
}) {
  if (!isOpen) return null;

  const typeConfig = {
    danger: {
      icon: <AlertTriangle size={24} />,
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500",
      iconBorder: "border-red-500/20",
      btnBg: "bg-red-500",
      btnHover: "hover:bg-red-600",
      shadow: "shadow-[0_4px_14px_0_rgba(239,68,68,0.39)]",
    },
    success: {
      icon: <CheckCircle size={24} />,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      iconBorder: "border-emerald-500/20",
      btnBg: "bg-emerald-500",
      btnHover: "hover:bg-emerald-600",
      shadow: "shadow-[0_4px_14px_0_rgba(16,185,129,0.39)]",
    },
    info: {
      icon: <Info size={24} />,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      iconBorder: "border-blue-500/20",
      btnBg: "bg-blue-500",
      btnHover: "hover:bg-blue-600",
      shadow: "shadow-[0_4px_14px_0_rgba(59,130,246,0.39)]",
    },
  };

  const currentConfig = typeConfig[type] || typeConfig.danger;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
      <div
        className="bg-zinc-800 border border-zinc-700 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-300 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 border ${currentConfig.iconBg} ${currentConfig.iconColor} ${currentConfig.iconBorder}`}
          >
            {currentConfig.icon}
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
          <p className="text-zinc-300 text-sm mb-6">{message}</p>

          <div className="flex w-full gap-3">
            {!isAlert && (
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-zinc-700 text-white hover:bg-zinc-600 transition-colors font-medium border border-zinc-600"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={() => {
                if (onConfirm) onConfirm();
                else onClose();
              }}
              className={`flex-1 py-2.5 rounded-xl text-white transition-colors font-medium ${currentConfig.btnBg} ${currentConfig.btnHover} ${currentConfig.shadow}`}
            >
              {isAlert ? "OK" : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
