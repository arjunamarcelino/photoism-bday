"use client";

import { useState, useEffect } from "react";
import { playSound } from "@/app/lib/audio";

interface SceneProps {
  onComplete: () => void;
}

export default function DarkRoomScene({ onComplete }: SceneProps) {
  const [flicked, setFlicked] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Show hint after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (flicked) return;
    setFlicked(true);
    playSound("/audio/switch.mp3");
    setTimeout(() => onComplete(), 400);
  };

  return (
    <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center">
      {/* Noise grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Light switch */}
      <button
        onClick={handleClick}
        className="relative group cursor-pointer"
        aria-label="Toggle light switch"
      >
        {/* Switch plate */}
        <div
          className="w-20 h-32 rounded-lg relative"
          style={{
            background:
              "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%)",
            boxShadow:
              "inset 2px 2px 4px rgba(255,255,255,0.05), inset -2px -2px 4px rgba(0,0,0,0.8), 0 4px 12px rgba(0,0,0,0.9)",
          }}
        >
          {/* Toggle */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-6 h-10 rounded-sm transition-all duration-200"
            style={{
              top: flicked ? "20%" : "50%",
              background:
                "linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%)",
              boxShadow:
                "inset 1px 1px 2px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.5)",
            }}
          />
          {/* Screws */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#1a1a1a] border border-[#333]" />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#1a1a1a] border border-[#333]" />
        </div>

        {/* Hover glow */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            filter: "drop-shadow(0 0 30px rgba(255,255,255,0.15))",
          }}
        />
      </button>

      {/* Hint text */}
      {showHint && !flicked && (
        <p
          className="absolute bottom-16 text-white/40 text-sm tracking-widest uppercase"
          style={{ animation: "hintFade 1s ease-out forwards" }}
        >
          Find the switch
        </p>
      )}
    </div>
  );
}
