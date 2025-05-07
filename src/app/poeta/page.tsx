"use client";

import React, { useState, useEffect } from "react";
import { Dock } from "@/components/dock/dock";
import { PostGrid } from "@/components/post/post-grid";
import { TextGenerateEffect } from "@/components/post/text-generate-effect";
import Preloader from "@/components/pre-loader";
import SakuraCanvas from "@/components/SakuraCanvas";

const words = `My Lovely Poem, Love will forever with my life`;

export default function Poem() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return isLoading ? (
    <Preloader />
  ) : (
    <div className="relative min-h-screen bg-gray-900 flex flex-col items-center">
      <SakuraCanvas className="absolute inset-0 z-0 pointer-events-none" />
      <TextGenerateEffect
        className="text-3xl md:text-4xl lg:text-5xl font-bold max-w-4xl mx-auto text-center mt-4 z-10 text-red-600 bg-shimmer-gradient bg-[length:200%_100%]"
        words={words}
        aria-label="Animated text effect for poem title"
      />
      <div className="w-full max-w-4xl mx-auto z-10 pb-20">
        <PostGrid />
      </div>
      <Dock />
    </div>
  );
}