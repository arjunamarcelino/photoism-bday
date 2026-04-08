"use client";

export default function BirthdayGreeting() {
  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #87CEFA 0%, #ADD8E6 40%, #E0F4FF 100%)",
      }}
    >
      {/* Floating particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${4 + Math.random() * 8}px`,
            height: `${4 + Math.random() * 8}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `rgba(255, 255, 255, ${0.3 + Math.random() * 0.4})`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}

      {/* Main greeting */}
      <div
        className="relative z-10 text-center max-w-2xl"
        style={{ animation: "fadeIn 1s ease-out forwards" }}
      >
        <h1
          className="font-[family-name:var(--font-display)] font-bold leading-tight mb-6"
          style={{
            fontSize: "clamp(2.5rem, 10vw, 5rem)",
            color: "#ffffff",
            textShadow:
              "0 2px 10px rgba(135,206,250,0.5), 0 4px 20px rgba(173,216,230,0.3)",
          }}
        >
          Happy Birthday,
          <br />
          Ka Sharon!
        </h1>

        <p
          className="text-white/80 text-lg sm:text-xl md:text-2xl font-light leading-relaxed max-w-md mx-auto"
          style={{ animation: "fadeIn 1s ease-out 0.4s both" }}
        >
          From all of us who love you dearly.
          <br />
          Today we celebrate YOU!
        </p>

        {/* Scroll indicator */}
        <div
          className="mt-16 flex flex-col items-center gap-2"
          style={{ animation: "fadeIn 1s ease-out 1s both" }}
        >
          <p className="text-white/50 text-sm tracking-widest uppercase">
            Scroll down to explore
          </p>
          <div
            className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1"
          >
            <div
              className="w-1.5 h-3 bg-white/50 rounded-full"
              style={{
                animation: "gentleBounce 1.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
