"use client";

import { useState, useRef } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { photos } from "@/data/content";

export default function GalleryContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [topCard, setTopCard] = useState<string | null>(null);

  // Pre-compute scattered positions for each card
  const cardPositions = photos.map((_, i) => ({
    x: (i % 3) * 120 - 100 + Math.random() * 40,
    y: Math.floor(i / 3) * 100 + Math.random() * 30,
    rotate: -15 + Math.random() * 30,
  }));

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-mac-dark font-[family-name:var(--font-retro)] font-[family-name:var(--font-retro-fallback)]">
        <p>No photos yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[400px] sm:min-h-[500px] overflow-hidden"
    >
      {/* Mobile: scrollable row */}
      <div className="flex gap-4 overflow-x-auto p-4 sm:hidden snap-x snap-mandatory">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="shrink-0 w-56 snap-center"
          >
            <div className="bg-white p-2 shadow-md border border-gray-200">
              <div className="relative w-full h-44 bg-gray-100">
                <Image
                  src={photo.url}
                  alt={photo.caption ?? `Photo ${photo.id}`}
                  fill
                  className="object-cover"
                  sizes="224px"
                />
              </div>
              {photo.caption && (
                <p className="text-xs text-center mt-2 text-gray-600 font-[family-name:var(--font-retro)] font-[family-name:var(--font-retro-fallback)]">
                  {photo.caption}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: draggable scattered cards */}
      <div className="hidden sm:block relative h-[500px]" ref={containerRef}>
        {photos.map((photo, i) => (
          <motion.div
            key={photo.id}
            drag
            dragConstraints={containerRef}
            dragElastic={0.1}
            onDragStart={() => setTopCard(photo.id)}
            className="absolute cursor-grab active:cursor-grabbing"
            style={{
              x: cardPositions[i].x + 150,
              y: cardPositions[i].y + 20,
              rotate: cardPositions[i].rotate,
              zIndex: topCard === photo.id ? 50 : photos.length - i,
            }}
          >
            <div className="bg-white p-2 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow w-48 md:w-56">
              <div className="relative w-full h-36 md:h-44 bg-gray-100">
                <Image
                  src={photo.url}
                  alt={photo.caption ?? `Photo ${photo.id}`}
                  fill
                  className="object-cover"
                  sizes="240px"
                />
              </div>
              {photo.caption && (
                <p className="text-xs text-center mt-2 text-gray-600 font-[family-name:var(--font-retro)] font-[family-name:var(--font-retro-fallback)]">
                  {photo.caption}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
