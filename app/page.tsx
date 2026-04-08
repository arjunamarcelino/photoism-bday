"use client";

import { useState, useCallback, useRef } from "react";
import PowerOnScene from "./components/PowerOnScene";
import BootLoadingScene from "./components/BootLoadingScene";
import LockScreenScene from "./components/LockScreenScene";
import DesktopScene from "./components/DesktopScene";

type Scene = 1 | 2 | 3 | 4;

export default function BirthdayPage() {
  const [scene, setScene] = useState<Scene>(1);
  const isTransitioningRef = useRef(false);

  const advance = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setScene((prev) => {
      const next = prev + 1;
      return (next <= 4 ? next : 4) as Scene;
    });
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 600);
  }, []);

  return (
    <main className="relative h-full w-full">
      {scene === 1 && <PowerOnScene onComplete={advance} />}
      {scene === 2 && <BootLoadingScene onComplete={advance} />}
      {scene === 3 && <LockScreenScene onComplete={advance} />}
      {scene === 4 && <DesktopScene />}
    </main>
  );
}
