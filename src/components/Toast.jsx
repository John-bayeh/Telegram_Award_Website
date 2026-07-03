import React, { useEffect, useRef } from "react";

/**
 * Toast — slides down from the top.
 *
 * Props:
 *   toast  : { type: "confirm"|"success"|"error"|"info", message, sub?, onConfirm?, onCancel? } | null
 *   onClose: () => void
 */
export default function Toast({ toast, onClose }) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!toast || toast.type === "confirm") return;
    const delay = toast.type === "success" ? 2000 : 3000;
    timerRef.current = setTimeout(onClose, delay);
    return () => clearTimeout(timerRef.current);
  }, [toast, onClose]);

  const visible = !!toast;

  return (
    <>
      {/* Backdrop — only for confirm */}
      {toast?.type === "confirm" && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
          onClick={() => { toast.onCancel?.(); onClose(); }}
        />
      )}

      {/* Toast card — slides down from top */}
      <div
        role={toast?.type === "confirm" ? "alertdialog" : "status"}
        aria-live="polite"
        style={{
          position: "fixed",
          top: visible ? "24px" : "-200px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(400px, calc(100% - 32px))",
          zIndex: 50,
          opacity: visible ? 1 : 0,
          transition: "top 0.35s cubic-bezier(.2,.8,.2,1), opacity 0.28s ease",
        }}
        className="rounded-2xl border border-white/10 bg-[#18191f] shadow-[0_12px_40px_rgba(0,0,0,0.6)] px-5 pt-5 pb-4"
      >
        {toast && (
          <>
            {/* Title */}
            <p className={`text-[15px] font-semibold leading-snug mb-1 ${
              toast.type === "success" ? "text-emerald-400" :
              toast.type === "error"   ? "text-red-400"     :
              "text-white"
            }`}>
              {toast.message}
            </p>

            {/* Subtitle */}
            <p className="text-[13px] text-gray-400 mb-4">
              {toast.sub ?? (
                toast.type === "confirm" ? "You can only vote once per category. This cannot be undone." :
                toast.type === "success" ? "Your vote has been recorded and locked in."  :
                toast.type === "error"   ? "Something went wrong. Please try again."     :
                ""
              )}
            </p>

            {/* Confirm actions */}
            {toast.type === "confirm" ? (
              <div className="flex gap-2.5 justify-end">
                <button
                  onClick={() => { toast.onCancel?.(); onClose(); }}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/10 transition active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { toast.onConfirm?.(); onClose(); }}
                  style={{ background: "linear-gradient(135deg, #2AABEE, #229ED9)" }}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition active:scale-95 shadow-lg"
                >
                  Confirm Vote
                </button>
              </div>
            ) : (
              /* Progress bar for auto-dismiss */
              <div className="h-[3px] w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    toast.type === "success" ? "bg-emerald-500" :
                    toast.type === "error"   ? "bg-red-400"     : "bg-[#2AABEE]"
                  }`}
                  style={{
                    animation: `toastShrink ${toast.type === "success" ? "2s" : "3s"} linear forwards`,
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
