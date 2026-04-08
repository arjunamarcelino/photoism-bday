"use client";

import { useState } from "react";
import MacWindow from "./MacWindow";
import GalleryContent from "./GalleryContent";
import WishesContent from "./WishesContent";

type WindowType = "gallery" | "wishes" | null;

export default function DesktopScene() {
  const [openWindow, setOpenWindow] = useState<WindowType>(null);

  return (
    <section
      className="min-h-screen relative"
      style={{
        backgroundColor: "#008080",
        backgroundImage: "url('/images/wallpaper-blurred.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Menu bar */}
      <div className="sticky top-0 z-40 h-[20px] bg-white border-b border-black flex items-center px-2 gap-4 font-[family-name:var(--font-retro)] font-[family-name:var(--font-retro-fallback)]"
        style={{ fontSize: "11px" }}
      >
        <span className="font-bold text-sm">&#63743;</span>
        <span className="font-bold">File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Special</span>
        <span className="ml-auto">
          {new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </span>
      </div>

      {/* Desktop icons */}
      <div className="flex flex-col gap-6 p-6 sm:p-10">
        {/* Gallery icon */}
        <button
          onClick={() => setOpenWindow("gallery")}
          className="flex flex-col items-center gap-1 w-20 group cursor-pointer"
        >
          <div className="w-12 h-12 flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-10 h-10" fill="none">
              <rect x="2" y="4" width="28" height="24" rx="1" fill="#FFD700" stroke="black" strokeWidth="1.5" />
              <rect x="4" y="6" width="24" height="18" fill="white" stroke="black" strokeWidth="0.5" />
              <circle cx="11" cy="12" r="3" fill="#87CEFA" />
              <path d="M4 20 L12 14 L18 18 L22 15 L28 20 V24 H4Z" fill="#4CAF50" />
            </svg>
          </div>
          <span className="text-white text-xs font-[family-name:var(--font-retro)] font-[family-name:var(--font-retro-fallback)] text-center leading-tight group-hover:bg-black group-hover:text-white px-1"
            style={{
              textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
              fontSize: "11px",
            }}
          >
            Gallery
          </span>
        </button>

        {/* Wishes icon */}
        <button
          onClick={() => setOpenWindow("wishes")}
          className="flex flex-col items-center gap-1 w-20 group cursor-pointer"
        >
          <div className="w-12 h-12 flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-10 h-10" fill="none">
              <rect x="4" y="2" width="24" height="28" rx="1" fill="white" stroke="black" strokeWidth="1.5" />
              <line x1="8" y1="8" x2="24" y2="8" stroke="black" strokeWidth="0.8" />
              <line x1="8" y1="12" x2="24" y2="12" stroke="black" strokeWidth="0.8" />
              <line x1="8" y1="16" x2="20" y2="16" stroke="black" strokeWidth="0.8" />
              <line x1="8" y1="20" x2="22" y2="20" stroke="black" strokeWidth="0.8" />
              <line x1="8" y1="24" x2="18" y2="24" stroke="black" strokeWidth="0.8" />
              <path d="M12 2 L16 6 L20 2" fill="#FF6B6B" stroke="black" strokeWidth="0.5" />
            </svg>
          </div>
          <span className="text-white text-xs font-[family-name:var(--font-retro)] font-[family-name:var(--font-retro-fallback)] text-center leading-tight group-hover:bg-black group-hover:text-white px-1"
            style={{
              textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
              fontSize: "11px",
            }}
          >
            Wishes
          </span>
        </button>
      </div>

      {/* Windows */}
      <MacWindow
        title="Gallery"
        isOpen={openWindow === "gallery"}
        onClose={() => setOpenWindow(null)}
      >
        <GalleryContent />
      </MacWindow>

      <MacWindow
        title="Wishes"
        isOpen={openWindow === "wishes"}
        onClose={() => setOpenWindow(null)}
      >
        <WishesContent />
      </MacWindow>
    </section>
  );
}
