"use client";

import { useState } from "react";
import DarkRoomScene from "./components/DarkRoomScene";
import LampEffectScene from "./components/LampEffectScene";
import DoorOpenScene from "./components/DoorOpenScene";
import BirthdayGreeting from "./components/BirthdayGreeting";
import DesktopScene from "./components/DesktopScene";

type Scene = 1 | 2 | 3 | 4;

export default function BirthdayPage() {
  const [scene, setScene] = useState<Scene>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const advance = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setScene((prev) => {
      const next = prev + 1;
      return (next <= 4 ? next : 4) as Scene;
    });
    setTimeout(() => setIsTransitioning(false), 600);
  };

  return (
    <main className="relative h-full w-full">
      {scene === 1 && <DarkRoomScene onComplete={advance} />}
      {scene === 2 && <LampEffectScene onComplete={advance} />}
      {scene === 3 && <DoorOpenScene onComplete={advance} />}
      {scene === 4 && (
        <div className="h-full overflow-y-auto">
          <BirthdayGreeting />
          <DesktopScene />
        </div>
      )}
    </main>
  );
}
