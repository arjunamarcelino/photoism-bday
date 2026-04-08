"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { wishes } from "@/data/content";

export default function WishesContent() {
  const containerRef = useRef<HTMLDivElement>(null);

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
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
      {wishes.map((wish) => (
        <div
          key={wish.id}
          className="bg-white border border-gray-300 p-3 mac-beveled"
        >
          {/* Author */}
          <h3 className="font-bold text-sm mb-2 font-[family-name:var(--font-retro)]">
            {wish.author}
          </h3>

          {/* Media */}
          <div className="relative w-full h-40 bg-gray-100 mb-2 mac-beveled-inset">
            {wish.mediaType === "video" ? (
              <video
                src={wish.mediaUrl}
                controls
                preload="metadata"
                className="w-full h-full object-cover"
                playsInline
              />
            ) : (
              <Image
                src={wish.mediaUrl}
                alt={`Photo from ${wish.author}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>

          {/* Message */}
          <p className="text-sm text-gray-700 leading-relaxed overflow-y-auto max-h-24">
            {wish.message}
          </p>
        </div>
      ))}
    </div>
  );
}
