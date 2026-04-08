"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { photos } from "@/data/content";

export default function GalleryContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [topCard, setTopCard] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = useCallback((id: string) => {
    setLoadedImages((prev) => new Set(prev).add(id));
  }, []);

  // Pre-compute scattered positions for each card (stable across re-renders)
  const cardPositions = useMemo(
    () =>
      photos.map((_, i) => ({
        x: (i % 3) * 80 - 60 + Math.random() * 40,
        y: Math.floor(i / 3) * 80 + Math.random() * 30,
        rotate: -15 + Math.random() * 30,
      })),
    []
  );

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-mac-dark font-[family-name:var(--font-retro)]">
        <p>No photos yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[400px] sm:min-h-[500px] overflow-hidden"
    >
      {/* Background text */}
      <p className="absolute inset-0 flex items-center justify-center pointer-events-none select-none font-[family-name:var(--font-retro)] text-black/10 text-4xl sm:text-6xl">
        photoism
      </p>
      {/* Draggable scattered cards */}
      <div className="relative h-[400px] sm:h-[500px]">
        {photos.map((photo, i) => (
          <motion.div
            key={photo.id}
            drag
            dragConstraints={containerRef}
            dragElastic={0.1}
            onDragStart={() => setTopCard(photo.id)}
            onPointerDown={() => setTopCard(photo.id)}
            className="absolute cursor-grab active:cursor-grabbing touch-none"
            style={{
              x: cardPositions[i].x + 100,
              y: cardPositions[i].y + 10,
              rotate: cardPositions[i].rotate,
              zIndex: topCard === photo.id ? 50 : photos.length - i,
            }}
          >
            <div className="bg-white p-2 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow w-36 sm:w-48 md:w-56 pointer-events-none select-none">
              <div className="relative w-full h-28 sm:h-36 md:h-44 bg-gray-100">
                {!loadedImages.has(photo.id) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-[family-name:var(--font-retro)] text-mac-shadow" style={{ fontSize: "11px" }}>
                      Loading...
                    </span>
                  </div>
                )}
                <Image
                  src={photo.url}
                  alt={photo.caption ?? `Photo ${photo.id}`}
                  fill
                  className={`object-cover transition-opacity ${loadedImages.has(photo.id) ? "opacity-100" : "opacity-0"}`}
                  draggable={false}
                  sizes="(max-width: 640px) 144px, 240px"
                  onLoad={() => handleImageLoad(photo.id)}
                />
              </div>
              {photo.caption && (
                <p className="text-xs text-center mt-2 text-gray-600 font-[family-name:var(--font-retro)]">
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
