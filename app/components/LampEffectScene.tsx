"use client";

import { useState, useEffect } from "react";
import { playSound } from "@/app/lib/audio";

interface SceneProps {
  onComplete: () => void;
}

export default function LampEffectScene({ onComplete }: SceneProps) {
  const [showText, setShowText] = useState(false);
  const [showDoor, setShowDoor] = useState(false);

  useEffect(() => {
    const textTimer = setTimeout(() => setShowText(true), 800);
    const doorTimer = setTimeout(() => setShowDoor(true), 1600);
    return () => {
      clearTimeout(textTimer);
      clearTimeout(doorTimer);
    };
  }, []);

  const handleKnock = () => {
    playSound("/audio/knock.mp3");
    setTimeout(() => onComplete(), 300);
  };

  return (
    <div className="absolute inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden">
      {/* Lamp glow layers */}
      {/* Ambient wash */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[80%]"
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(255,215,0,0.08) 0%, transparent 70%)",
          animation: "lampGlow 1.5s ease-out forwards",
        }}
      />
      {/* Mid glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[60%]"
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(255,235,205,0.15) 0%, rgba(255,215,0,0.08) 30%, transparent 70%)",
          filter: "blur(40px)",
          animation: "lampGlow 1.2s ease-out 0.2s both",
        }}
      />
      {/* Core bright spot */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[30%]"
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(255,249,230,0.6) 0%, rgba(255,215,0,0.3) 40%, transparent 80%)",
          filter: "blur(8px)",
          animation: "lampGlow 1s ease-out 0.4s both",
        }}
      />
      {/* Light cone */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full"
        style={{
          background:
            "conic-gradient(from 70deg at 50% 0%, transparent 0deg, rgba(255,249,230,0.06) 30deg, rgba(255,249,230,0.1) 50deg, rgba(255,249,230,0.06) 70deg, transparent 100deg)",
          animation: "lampGlow 1.4s ease-out 0.3s both",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-12 px-6">
        {/* Greeting text */}
        {showText && (
          <div
            className="text-center"
            style={{ animation: "fadeIn 0.8s ease-out forwards" }}
          >
            <p className="text-white/90 text-xl sm:text-2xl md:text-3xl font-light leading-relaxed max-w-lg">
              Hey there!
              <br />
              <span className="text-white/70 text-lg sm:text-xl md:text-2xl">
                Are you ready to have fun with us?
              </span>
            </p>
          </div>
        )}

        {/* Door */}
        {showDoor && (
          <div
            className="flex flex-col items-center gap-4"
            style={{ animation: "fadeIn 0.6s ease-out forwards" }}
          >
            <button
              onClick={handleKnock}
              className="relative group cursor-pointer"
              aria-label="Knock on the door"
              style={{ animation: "gentleBounce 2s ease-in-out infinite" }}
            >
              {/* Door frame */}
              <div className="w-32 h-52 sm:w-40 sm:h-64 rounded-t-lg border-2 border-amber-900/60 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #8b4513 0%, #654321 50%, #4a2a0a 100%)",
                  boxShadow: "inset 2px 2px 8px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.6)",
                }}
              >
                {/* Door panels */}
                <div className="absolute inset-3 top-3 bottom-[55%] border border-amber-800/40 rounded-sm" />
                <div className="absolute inset-3 top-[50%] bottom-3 border border-amber-800/40 rounded-sm" />
                {/* Door knob */}
                <div
                  className="absolute right-4 top-1/2 w-4 h-4 rounded-full"
                  style={{
                    background: "radial-gradient(circle at 30% 30%, #d4a843 0%, #8b7332 100%)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
                  }}
                />
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  boxShadow: "0 0 40px rgba(255,215,0,0.15)",
                }}
              />
            </button>

            <p className="text-white/40 text-sm tracking-widest uppercase">
              Knock on the door
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
