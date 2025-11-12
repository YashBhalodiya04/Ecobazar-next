"use client";
import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        fixed inset-0 z-[9999] flex flex-col gap-6 items-center justify-center
        bg-gradient-to-br from-green-400 via-green-500 to-green-700
        text-white overflow-hidden
        transition-all duration-1000 ease-out
        ${
          fadeOut
            ? "opacity-0 scale-110 pointer-events-none"
            : "opacity-100 scale-100"
        }
      `}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float-slower"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative">
          <div
            className="
            absolute inset-0 w-48 h-48 -translate-x-6 -translate-y-6
            bg-white/20 blur-3xl rounded-full animate-ping-slow
          "
          ></div>

          <div
            className="
            relative flex items-center justify-center w-36 h-36 
            rounded-3xl bg-white/10 backdrop-blur-xl
            border-2 border-white/30 shadow-2xl
            animate-scale-bounce
          "
          >
            <div className="absolute inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>

            <span
              className="
              relative text-6xl font-bold tracking-wider
              animate-fade-slide-up
              bg-gradient-to-br from-white to-green-100 bg-clip-text text-transparent
            "
            >
              E
            </span>
          </div>

          <div
            className="
            absolute inset-0 w-36 h-36
            border-4 border-transparent border-t-white/40 border-r-white/40
            rounded-3xl animate-spin-slow
          "
          ></div>
        </div>

        <div className="flex items-center gap-2 overflow-hidden">
          <p
            className="
            text-3xl font-bold tracking-wide
            animate-fade-slide-up animation-delay-300
            bg-gradient-to-r from-white via-green-50 to-white bg-clip-text text-transparent
          "
          >
            E-Cobazar
          </p>
        </div>

        <p
          className="
          text-sm font-light tracking-widest uppercase
          animate-fade-slide-up animation-delay-600
          text-white/80
        "
        >
          Your Shopping Destination
        </p>

        <div className="flex gap-2 animate-fade-slide-up animation-delay-900">
          <span className="w-2 h-2 bg-white/80 rounded-full animate-bounce animation-delay-0"></span>
          <span className="w-2 h-2 bg-white/80 rounded-full animate-bounce animation-delay-200"></span>
          <span className="w-2 h-2 bg-white/80 rounded-full animate-bounce animation-delay-400"></span>
        </div>
      </div>
    </div>
  );
}
