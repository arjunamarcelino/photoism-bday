"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { playSound } from "@/app/lib/audio";

interface SceneProps {
  onComplete: () => void;
}

/** Birthday date used as the lock screen passcode */
const BIRTHDAY_PASSCODE = "080426" as const;

export default function LockScreenScene({ onComplete }: SceneProps) {
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const dismissError = useCallback(() => {
    setShowError(false);
    setPassword("");
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  // Escape/Enter key to dismiss error dialog
  useEffect(() => {
    if (!showError) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        dismissError();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showError, dismissError]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (unlocked) return;
    if (password === BIRTHDAY_PASSCODE) {
      setUnlocked(true);
      timeoutRef.current = setTimeout(() => onComplete(), 300);
    } else {
      setShowError(true);
      playSound("/audio/alert.mp3");
    }
  };

  return (
    <div className="absolute inset-0 bg-mac-bg overflow-y-auto flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        {/* Welcome text */}
        <p
          className="text-mac-dark text-center px-4 mb-2 font-[family-name:var(--font-retro)]"
          style={{ fontSize: "13px" }}
        >
          Hey there! Are you ready to have fun with us?
        </p>
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full mac-beveled overflow-hidden bg-white flex items-center justify-center">
          <span className="text-2xl text-mac-dark font-bold">S</span>
        </div>

        {/* Username */}
        <p
          className="font-[family-name:var(--font-retro)] text-mac-dark"
          style={{ fontSize: "13px" }}
        >
          Sharon
        </p>

        {/* Password form */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mac-beveled-inset bg-white px-2 py-1 text-center w-40 outline-none font-[family-name:var(--font-retro)]"
            style={{ fontSize: "13px" }}
            aria-label="Password"
            autoComplete="off"
          />
          <button
            type="submit"
            className="mac-beveled bg-mac-bg px-6 py-1 cursor-pointer border border-black font-[family-name:var(--font-retro)] active:translate-y-px"
            style={{ fontSize: "13px" }}
          >
            OK
          </button>
        </form>

        {/* Hint */}
        <p className="text-mac-shadow font-[family-name:var(--font-retro)]" style={{ fontSize: "12px" }}>
          Hint: today&apos;s date (DDMMYY)
        </p>
      </div>

      {/* Error dialog */}
      {showError && (
        <>
          <div className="fixed inset-0 bg-black/20 z-50" onClick={dismissError} />
          <div
            className="fixed top-1/3 left-1/2 -translate-x-1/2 mac-beveled bg-mac-bg w-72 z-50 border-2 border-black"
            role="alertdialog"
            aria-label="Incorrect password"
          >
            <div className="mac-title-bar h-[19px] flex items-center px-1 relative border-b border-black">
              <div className="flex-1 flex justify-center relative z-10">
                <span
                  className="bg-white px-2 text-xs font-[family-name:var(--font-retro)] leading-none select-none"
                  style={{ fontSize: "13px" }}
                >
                  Alert
                </span>
              </div>
            </div>
            <div className="p-3 flex items-start gap-3">
              <span className="text-2xl leading-none">⚠️</span>
              <p className="font-[family-name:var(--font-retro)] leading-snug" style={{ fontSize: "13px" }}>
                Hmm, that doesn&apos;t seem right! Try again?
              </p>
            </div>
            <div className="flex justify-center pb-2">
              <button
                onClick={dismissError}
                className="mac-beveled bg-mac-bg px-6 py-1 cursor-pointer border border-black font-[family-name:var(--font-retro)] active:translate-y-px"
                style={{ fontSize: "13px" }}
                autoFocus
              >
                OK
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
