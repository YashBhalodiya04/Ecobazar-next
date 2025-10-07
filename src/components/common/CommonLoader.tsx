"use client";
import React, { useEffect } from "react";

interface CommonLoaderProps {
  loading: boolean;
  fullscreen?: boolean;
  message?: string; // optional message below loader
}

const CommonLoader: React.FC<CommonLoaderProps> = ({
  loading,
  fullscreen = true,
  message = "Loading, please wait...",
}) => {
  // Disable scrolling when fullscreen loader is active
  useEffect(() => {
    if (fullscreen && loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading, fullscreen]);

  if (!loading) return null;

  return (
    <div
      className={`${
        fullscreen
          ? "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
          : "flex flex-col items-center justify-center p-4"
      } animate-fadeIn`}
      role="status"
      aria-live="polite"
    >
      <div className="relative flex flex-col items-center justify-center">
        <div className="w-14 h-14 border-4 border-t-green-500 border-gray-300 rounded-full animate-spin"></div>
        <span className="mt-4 text-white font-medium text-sm tracking-wide animate-pulse">
          {message}
        </span>
      </div>
    </div>
  );
};

export default CommonLoader;
