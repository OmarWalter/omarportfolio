"use client";

import React, { useState, useEffect } from "react";
import { Dock } from "@/components/dock/dock";
import { Background } from "@/components/hero-background/background";
import SakuraCanvas from "../components/SakuraCanvas";
import Preloader from "@/components/pre-loader";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);


  return (
    <div>
      {isLoading ? (
        <Preloader />
      ) : (
        <>
          <SakuraCanvas />
          <Background
            words={["My Name is Omar Walter", "I am Web Developer", "Blockchain", "Cryptocurrency"]}
          />
          <Dock />
        </>
      )}
    </div>
  );
}