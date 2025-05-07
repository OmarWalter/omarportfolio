"use client";

import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "./use-outside-click";

type Card = (typeof cards)[number];

export function PostGrid() {
  const [active, setActive] = useState<Card | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  // Focus trap for accessibility
  useEffect(() => {
    if (active && ref.current) {
      ref.current.focus();
    }
  }, [active]);

  const moodColors: Record<string, string> = {
    sad: "text-gray-400",
    happy: "text-yellow-400",
    romo: "text-pink-400",
    angry: "text-red-400",
  };

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-100"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
              aria-label="Close modal"
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              tabIndex={-1}
              role="dialog"
              aria-labelledby={`title-${active.title}-${id}`}
              aria-modal="true"
              className="w-full max-w-[650px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <Image
                  priority
                  width={650}
                  height={160}
                  src={active.src}
                  alt={`Cover image for ${active.title} poem`}
                  className="w-full h-40 lg:h-40 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>
              <div>
                <div className="flex justify-between items-start p-4">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      id={`title-${active.title}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      {active.description}
                    </motion.p>
                  </div>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-400 text-xs md:text-sm lg:text-base max-h-40 md:max-h-64 overflow-auto [scrollbar-width:none] [-ms-overflow-style:none]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ul className="w-full max-w-4xl mx-auto z-10 min-h-[300px] p-4 bg-gray-800/50 rounded-xl">
        <div className="flex flex-col space-y-4">
          {cards.length > 0 ? (
            cards.map((card, index) => {
              console.log("Rendering card:", card.title); // Debug log
              return (
                <motion.div
                  layoutId={`card-${card.title}-${id}`}
                  key={`card-${index}`}
                  onClick={() => setActive(card)}
                  className="p-4 flex flex-col md:flex-row justify-between items-center bg-neutral-800 hover:bg-neutral-700 rounded-xl cursor-pointer border border-gray-600"
                >
                  <div className="flex gap-4 flex-col md:flex-row">
                    <motion.div layoutId={`image-${card.title}-${id}`}>
                      <Image
                        width={80}
                        height={80}
                        src={card.src}
                        alt={`Thumbnail for ${card.title} poem`}
                        loading="lazy"
                        className="h-20 w-20 md:h-12 md:w-12 rounded-lg object-cover object-top"
                      />
                    </motion.div>
                    <div>
                      <motion.h3
                        layoutId={`title-${card.title}-${id}`}
                        className="font-medium text-white text-center md:text-left"
                      >
                        {card.title}
                      </motion.h3>
                      <motion.p
                        layoutId={`description-${card.description}-${id}`}
                        className={`text-center md:text-left ${
                          moodColors[card.mood] || "text-gray-400"
                        }`}
                      >
                        {card.description}
                      </motion.p>
                    </div>
                  </div>
                  <motion.button
                    layoutId={`button-${card.title}-${id}`}
                    className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0"
                  >
                    {card.ctaText}
                  </motion.button>
                </motion.div>
              );
            })
          ) : (
            <p className="text-white text-center">No poems available</p>
          )}
        </div>
      </ul>
    </>
  );
}

export const CloseIcon = () => (
  <motion.svg
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.05 } }}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-black"
  >
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </motion.svg>
);

const cards = [
  {
    description: "Shame",
    mood: "romo",
    title: "Shame and Modesty",
    src: "https://images.unsplash.com/photo-1568781269551-3e3baf5ec909?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ctaText: "View",
    content: () => (
      <>
        <p className="w-3/4">
          She shines like a star, radiant and soft,
          Her gaze carries the tenderness of dawn.
          Calm as morning dew, yet fierce like a tempest,
          Smooth as velvet, but sometimes a whirlwind.
          Her quietude soothes, her words weave dreams.
          A blend of poetry and wild passion,
        </p>
        <p className="w-3/4">
          Only with me does she draw near.
          At times fated for love, with a saintly glow,
          For her, my heart brims with delight.
          Hiding her laughter behind shy glances,
          She crafts new feelings with every breath.
          She became the heart of my tale.
        </p>
        <i>Omar</i>
      </>
    ),
  },
  {
    description: "Questioning",
    mood: "sad",
    title: "Why Should I Write Now",
    src: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ctaText: "View",
    content: () => (
      <>
        <p className="w-3/4">
          Her laughter was my reason to rise,
          Her gentle voice, a melody of care.
          Her warm eyes watching over me,
          Filled each dawn with boundless hope.
        </p>
        <p className="w-3/4">
          Why wake now, without her voice?
          In the quiet night, love speaks no more.
          Silence reigns, even the wind is hushed.
          Without her, life’s joy has faded away.
        </p>
        <p className="w-3/4">
          I was reckless, she worried for my well-being.
          Her scolding was love, her guidance my light.
          Her small frustrations pierced my heart,
          Her sorrow left wounds I cannot heal.
        </p>
        <p className="w-3/4">
          Why seek food or care now?
          Her written words linger in my keepsakes.
          Why write when she won’t listen?
          For a fleeting moment, I’m alone, and she’s at peace.
        </p>
        <i>Omar</i>
      </>
    ),
  },
  {
    description: "Sad",
    mood: "sad",
    title: "The Cure of Words",
    src: "https://images.unsplash.com/photo-1564934304050-e9bb87a29c13?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ctaText: "View",
    content: () => (
      <>
        <p className="w-3/4">
          She was both remedy and wound.
          Her love, my first taste of ecstasy.
          With one look, she claimed my soul,
          I vanished into her gaze, I melted away.
        </p>
        <p className="w-3/4">
          In love, we shattered, but she pieced me back.
          She softened the scars just a little.
          Her every word carried healing power.
          Each time I saw her, she felt so close, so mine.
        </p>
        <i>Omar</i>
      </>
    ),
  },
  {
    description: "Romantic",
    mood: "romo",
    title: "She Can,But I Will",
    src: "https://images.unsplash.com/photo-1517856713891-215e57a13c0d?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ctaText: "View",
    content: () => (
      <>
        <p className="w-3/4">
          She cannot see the world; I’ll light up her vision.
          She cannot speak to me; I’ll amplify her silent voice.
        </p>
        <p className="w-3/4">
          She cannot hear my voice; I’ll offer every word to her.
          She cannot roam this earth; I’ll carry her spirit along.
        </p>
        <p className="w-3/4">
          When life grows cold and still, I’ll be her warmth and flame.
          In every quiet moment, I’ll bring her heart’s wishes to life.
        </p>
        <i>Omar</i>
      </>
    ),
  },
  {
    description: "Missing",
    mood: "sad",
    title: "You Are Not There",
    src: "https://images.unsplash.com/photo-1473163928189-364b2c4e1135?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ctaText: "View",
    content: () => (
      <>
        <p className="w-3/4">
          My errors have torn us apart.
          How can I endure this ache with your memories?
          Your every phrase haunts the stillness of night,
          Each night stretches into endless years.
        </p>
        <p className="w-3/4">
          Why does this fool weep when you’re gone?
          Why do I grieve when your reproaches have faded?
          You took all the warmth with you.
          Why does this emptiness punish me without you?
        </p>
        <i>Omar</i>
      </>
    ),
  },
];