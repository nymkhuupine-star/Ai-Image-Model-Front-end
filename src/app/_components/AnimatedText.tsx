"use client";

import { useState, useEffect } from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  speed?: number; // milliseconds per character
}

export function AnimatedText({ text, className = "", speed = 30 }: AnimatedTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <p className={`text-white/90 ${className}`}>
      {displayedText}
      {currentIndex < text.length && (
        <span className="inline-block w-0.5 h-5 bg-white/70 ml-1 animate-pulse" />
      )}
    </p>
  );
}