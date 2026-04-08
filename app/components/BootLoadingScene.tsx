"use client";

import { useEffect, useRef, useState } from "react";

interface SceneProps {
  onComplete: () => void;
}

const DURATION_MS = 3000;

export default function BootLoadingScene({ onComplete }: SceneProps) {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(elapsed / DURATION_MS, 1);
      setProgress(pct);

      if (pct < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        onCompleteRef.current();
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="absolute inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center gap-8">
      {/* Happy Mac icon */}
      <svg
        viewBox="0 0 32 38"
        width={64}
        height={76}
        style={{ shapeRendering: "crispEdges" }}
        aria-label="Happy Mac"
        role="img"
      >
        {/* Monitor body */}
        <rect x="2" y="0" width="28" height="28" rx="2" fill="#c0c0c0" stroke="#333" strokeWidth="1" />
        {/* Screen */}
        <rect x="5" y="3" width="22" height="16" fill="#000" />
        {/* Eyes */}
        <rect x="10" y="7" width="3" height="4" fill="#00ff00" />
        <rect x="19" y="7" width="3" height="4" fill="#00ff00" />
        {/* Nose */}
        <rect x="15" y="11" width="2" height="2" fill="#00ff00" />
        {/* Smile */}
        <rect x="10" y="14" width="2" height="1" fill="#00ff00" />
        <rect x="12" y="15" width="8" height="1" fill="#00ff00" />
        <rect x="20" y="14" width="2" height="1" fill="#00ff00" />
        {/* Floppy slot */}
        <rect x="10" y="21" width="12" height="3" rx="0.5" fill="#808080" />
        {/* Stand */}
        <rect x="10" y="28" width="12" height="2" fill="#999" />
        {/* Base */}
        <rect x="6" y="30" width="20" height="3" rx="1" fill="#c0c0c0" stroke="#333" strokeWidth="0.5" />
      </svg>

      {/* Progress bar */}
      <div
        className="mac-beveled-inset bg-[#222] w-[60vw] max-w-[200px]"
        style={{ height: 14, padding: 2 }}
      >
        <div
          className="h-full"
          style={{
            width: `${progress * 100}%`,
            background: "repeating-linear-gradient(90deg, #c0c0c0 0px, #c0c0c0 6px, #808080 6px, #808080 8px)",
          }}
        />
      </div>
    </div>
  );
}
