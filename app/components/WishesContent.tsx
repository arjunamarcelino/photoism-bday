"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { wishes, Wish } from "@/data/content";

function WishDialog({ wish, onClose }: { wish: Wish; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mac-beveled bg-mac-bg w-[90vw] max-w-md max-h-[80vh] z-50 border-2 border-black flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label={`Wish from ${wish.author}`}
      >
        {/* Title bar */}
        <div className="mac-title-bar h-[19px] flex items-center px-1 shrink-0 border-b border-black relative">
          <button
            onClick={onClose}
            className="w-[11px] h-[11px] border border-black bg-white hover:bg-black active:bg-black shrink-0 relative z-10 cursor-pointer"
            aria-label="Close"
          />
          <div className="flex-1 flex justify-center relative z-10">
            <span
              className="bg-white px-2 text-xs font-[family-name:var(--font-retro)] leading-none select-none"
              style={{ fontSize: "13px" }}
            >
              From {wish.author}
            </span>
          </div>
          <div className="w-[11px] shrink-0" />
        </div>

        {/* Content */}
        <div className="p-3 mac-beveled-inset m-1 bg-white">
          {/* Media — scales to fit without scrolling */}
          <div className="bg-gray-100 mac-beveled-inset">
            {wish.mediaType === "video" ? (
              <video
                src={wish.mediaUrl}
                controls
                preload="metadata"
                className="w-full max-h-[50vh] object-contain"
                playsInline
                autoPlay
              />
            ) : (
              <Image
                src={wish.mediaUrl}
                alt={`Photo from ${wish.author}`}
                width={800}
                height={600}
                className="w-full h-auto max-h-[50vh] object-contain"
                sizes="(max-width: 768px) 90vw, 400px"
              />
            )}
          </div>

          {/* Message */}
          {wish.message && (
            <p className="mt-2 text-gray-700 leading-relaxed font-[family-name:var(--font-retro)] whitespace-pre-line" style={{ fontSize: "13px" }}>
              {wish.message}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default function WishesContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);

  const closeDialog = useCallback(() => setSelectedWish(null), []);

  // Cleanup videos on unmount (capture ref at effect time)
  useEffect(() => {
    const container = containerRef.current;
    return () => {
      const videos = container?.querySelectorAll("video");
      videos?.forEach((v) => {
        v.pause();
        v.currentTime = 0;
      });
    };
  }, []);

  if (wishes.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-mac-dark font-[family-name:var(--font-retro)]">
        <p>No wishes yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-3 gap-3 p-2">
      {wishes.map((wish) => (
        <button
          key={wish.id}
          onClick={() => setSelectedWish(wish)}
          className="bg-white border border-gray-300 p-2 mac-beveled cursor-pointer text-left hover:brightness-95 transition-all"
        >
          {/* Author */}
          <h3 className="font-bold mb-1 font-[family-name:var(--font-retro)]" style={{ fontSize: "12px" }}>
            {wish.author}
          </h3>

          {/* Media thumbnail — uniform height for all types */}
          <div className="relative w-full h-24 sm:h-32 bg-gray-100 mac-beveled-inset overflow-hidden">
            {wish.mediaType === "video" ? (
              <>
                <video
                  src={wish.mediaUrl}
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  playsInline
                  muted
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="text-2xl text-white drop-shadow">▶</span>
                </div>
              </>
            ) : (
              <Image
                src={wish.mediaUrl}
                alt={`Photo from ${wish.author}`}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            )}
          </div>

          {/* Message snippet */}
          {wish.message && (
            <p className="mt-1 text-gray-600 font-[family-name:var(--font-retro)] truncate" style={{ fontSize: "10px" }}>
              {wish.message}
            </p>
          )}
          <span className="text-mac-shadow font-[family-name:var(--font-retro)] mt-1 block" style={{ fontSize: "10px" }}>
            see more...
          </span>
        </button>
      ))}

      {/* Detail dialog */}
      {selectedWish && <WishDialog wish={selectedWish} onClose={closeDialog} />}
    </div>
  );
}
