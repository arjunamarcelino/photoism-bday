"use client";

import { useEffect, useRef } from "react";
import { playSound } from "@/app/lib/audio";

interface SceneProps {
  onComplete: () => void;
}

export default function DoorOpenScene({ onComplete }: SceneProps) {
  const doorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    playSound("/audio/door-open.mp3");

    const door = doorRef.current;
    const handleEnd = (e: AnimationEvent) => {
      if (e.animationName === "swingOpen") {
        onComplete();
      }
    };
    door?.addEventListener("animationend", handleEnd);
    return () => door?.removeEventListener("animationend", handleEnd);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
      {/* Bright content visible behind the door */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #87CEFA 0%, #ADD8E6 50%, #E0F4FF 100%)",
        }}
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-white/60 text-2xl font-light">
          </p>
        </div>
      </div>

      {/* Door frame */}
      <div className="relative w-48 h-72 sm:w-56 sm:h-80 md:w-64 md:h-96" style={{ perspective: "1200px" }}>
        {/* Frame border */}
        <div
          className="absolute -inset-3 rounded-t-lg"
          style={{
            background: "linear-gradient(135deg, #3d2b1f 0%, #2a1a0e 100%)",
            boxShadow: "0 0 60px rgba(0,0,0,0.8)",
          }}
        />

        {/* Door panel that swings */}
        <div
          ref={doorRef}
          className="absolute inset-0 rounded-t-sm z-10"
          style={{
            transformOrigin: "left center",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            willChange: "transform",
            animation: "swingOpen 1.2s cubic-bezier(0.65, 0, 0.35, 1) 0.3s forwards",
            background: "linear-gradient(135deg, #8b4513 0%, #654321 50%, #4a2a0a 100%)",
            boxShadow: "inset 2px 2px 8px rgba(0,0,0,0.6), -20px 0 40px rgba(0,0,0,0.5)",
          }}
        >
          {/* Door panels */}
          <div className="absolute inset-4 top-4 bottom-[55%] border border-amber-800/40 rounded-sm" />
          <div className="absolute inset-4 top-[50%] bottom-4 border border-amber-800/40 rounded-sm" />
          {/* Door knob */}
          <div
            className="absolute right-5 top-1/2 w-5 h-5 rounded-full"
            style={{
              background: "radial-gradient(circle at 30% 30%, #d4a843 0%, #8b7332 100%)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
