import React from "react";
import { BackgroundLines } from "./background-lines";
import { FlipWords } from "./flip-words";
import Link from "next/link";

interface BackgroundProps {
    words: string[];
  }

export function Background({ words }: BackgroundProps) {
    return (
        <>
            <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 relative" >
            <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-sans py-2 sm:py-4 md:py-8 lg:py-10 relative z-20 font-bold tracking-tight">
                Hello World, <br /><FlipWords words={words} />
            </h2>
                <p className="max-w-lg sm:max-w-xl mx-auto text-lg md:text-2xl text-center text-blue-1000 pb-2 sm:pb-4 md:pb-6 font-bold shine">
                    
Full Stack & Blockchain Developer with 7 years of experience building web applications and decentralized systems. Passionate about designing elegant user interfaces, mastering modern technologies, and advancing open-source initiatives in both full-stack and blockchain ecosystems.
                </p>
                <Link
                    href="https://drive.google.com/file/d/1WqghFOz6tRwaG5tCLyJELHxLno6snHkt/view?usp=drive_link"
                    target="_blank"
                    className="relative z-50 bg-black dark:bg-white rounded-full text-white dark:text-black px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 mt-4 sm:mt-6 lg:mt-8"
                >
                    Know Me
                </Link>
            </BackgroundLines>
        </>
    );
}
