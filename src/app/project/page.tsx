"use client";

import Preloader from "@/components/pre-loader";
import { Dock } from "@/components/dock/dock";
import { Cover } from "@/components/slider/cover";
import { Slider } from "@/components/slider/slider";
import { FlipWords } from "@/components/hero-background/flip-words";
import React, { useEffect, useState } from "react";

export default function Project() {
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const words = [
    "Man's dearest possession is life.",
    "Live it so as to feel no torturing regrets for wasted years.",
    "Never know the burning shame of a mean and petty past.",
    "All my life, all my strength were given to the finest cause",
    "the fight for the Liberation of Mankind.",
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="bg-white">
      {isLoading ? (
        <Preloader />
      ) : (
        <>
          <div className="sticky z-[100]">
            <Dock />
          </div>
          <h1
            className="
              text-4xl md:text-4xl lg:text-6xl 
              font-semibold max-w-7xl mx-auto 
              text-center mt-6 relative z-20 py-6 
              bg-clip-text text-transparent 
              bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 
              dark:from-neutral-800 dark:via-white dark:to-white
            "
          >
            Exceptional Websites at <Cover>Lightning Speed</Cover>
          </h1>
          <Slider />
          <br />
          <div className="flex justify-center px-4 sm:px-6 lg:px-8">
            <div
              className="
                bg-white dark:bg-neutral-800 
                text-center text-4xl
                rounded-xl shadow-lg 
                p-6 sm:p-8 
                max-w-7xl w-full 
                border border-neutral-200 dark:border-neutral-700
                font-times 
                transition-all duration-300
              "
            >
              <FlipWords words={words} />
            </div>
          </div>
          <br />
        </>
      )}
    </div>
  );
}