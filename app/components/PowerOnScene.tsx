"use client";

import { useState, useEffect, useRef } from "react";
import { playSound } from "@/app/lib/audio";

interface SceneProps {
  onComplete: () => void;
}

export default function PowerOnScene({ onComplete }: SceneProps) {
  const [showHint, setShowHint] = useState(false);
  const [activated, setActivated] = useState(false);
  const [bgReady, setBgReady] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Preload lock screen background
  useEffect(() => {
    const img = new Image();
    img.src = "/images/home.png";
    img.onload = () => setBgReady(true);
    img.onerror = () => setBgReady(true); // don't block if missing
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleClick = () => {
    if (activated || !bgReady) return;
    setActivated(true);
    playSound("/audio/chime.mp3");
    timeoutRef.current = setTimeout(() => onComplete(), 500);
  };

  return (
    <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center">
      <button
        onClick={handleClick}
        aria-label="Power on"
        disabled={!bgReady}
        className="cursor-pointer border-none bg-transparent outline-none focus:outline-none disabled:cursor-wait"
      >
        <span
          className="block text-[#444] hover:text-[#888] transition-colors duration-300"
          style={{
            fontSize: "72px",
            lineHeight: 1,
            animation: bgReady ? "pulse 2s ease-in-out infinite" : "none",
            opacity: bgReady ? undefined : 0.2,
          }}
        >
          ⏻
        </span>
      </button>
      {showHint && (
        <p
          className="absolute bottom-[20%] text-white/40 font-[family-name:var(--font-retro)]"
          style={{
            animation: "hintFade 1s ease-out forwards",
            fontSize: "13px",
          }}
        >
          {bgReady ? "Click to power on" : "Loading..."}
        </p>
      )}
    </div>
  );
}
