"use client";

import { useEffect } from "react";

interface MacWindowProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function MacWindow({ title, isOpen, onClose, children }: MacWindowProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      {/* Window */}
      <div
        className="relative bg-mac-bg border-2 border-black w-full max-w-3xl max-h-[80vh] flex flex-col mac-beveled"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ animation: "fadeIn 0.2s ease-out" }}
      >
        {/* Title bar */}
        <div className="mac-title-bar h-[19px] flex items-center px-1 shrink-0 border-b border-black relative">
          {/* Close box */}
          <button
            onClick={onClose}
            className="w-[11px] h-[11px] border border-black bg-white hover:bg-black active:bg-black shrink-0 relative z-10 cursor-pointer before:absolute before:-inset-4 before:content-['']"
            aria-label="Close window"
          />
          {/* Title */}
          <div className="flex-1 flex justify-center relative z-10">
            <span
              className="bg-white px-2 text-xs font-[family-name:var(--font-retro)] leading-none select-none"
              style={{ fontSize: "13px" }}
            >
              {title}
            </span>
          </div>
          {/* Spacer for symmetry */}
          <div className="w-[11px] shrink-0" />
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-3 mac-beveled-inset m-1 bg-white min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
}
