"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

type Testimonial = {
  quote: string;
  name: string;
  redirect: string;
  pic: string;
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 41) - 20; // -20° to 20° for 3D effect
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setDragDistance(0);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setDragDistance(e.clientX - startX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 100;
    if (dragDistance > threshold) {
      handlePrev();
    } else if (dragDistance < -threshold) {
      handleNext();
    }
  };

  return (
    <div
      className="max-w-sm md:max-w-6xl mx-auto antialiased font-sans px-4 md:px-8 lg:px-20 py-20 select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="relative grid grid-cols-1 md:grid-cols-[2fr_2fr] gap-20">
        <div>
          <div
            className="relative h-80 w-full"
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d",
            }}
          >
            <AnimatePresence>
              {testimonials.map((testimonial, index) => {
                const offset = index - active;
                const isActiveCard = isActive(index);
                return (
                  <motion.div
                    key={testimonial.name}
                    initial={{
                      opacity: 0,
                      scale: 0.8,
                      translateX: offset > 0 ? 200 : -200, // Reduced slide distance
                      translateZ: -200,
                      rotateY: randomRotateY(),
                    }}
                    animate={{
                      opacity: isActiveCard ? 1 : 0.7,
                      scale: isActiveCard ? 1 : 0.85,
                      translateX: isActiveCard
                        ? -100 // Shift active card left
                        : -100 + offset * 80, // Shift inactive cards left with fanning
                      translateZ: isActiveCard ? 100 : -100 - Math.abs(offset) * 50,
                      rotateY: isActiveCard ? 0 : randomRotateY(),
                      zIndex: isActiveCard ? 999 : 999 - Math.abs(offset),
                      boxShadow: isActiveCard
                        ? "0 10px 30px rgba(0, 0, 0, 0.3)"
                        : "0 5px 15px rgba(0, 0, 0, 0.1)",
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.8,
                      translateX: offset > 0 ? -200 : 200, // Slide out adjusted
                      translateZ: -200,
                      rotateY: randomRotateY(),
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 origin-center"
                    style={{
                      transformStyle: "preserve-3d",
                      filter: isActiveCard ? "none" : "brightness(0.8)",
                    }}
                  >
                    <Image
                      src={testimonial.pic}
                      alt={testimonial.name}
                      width={500}
                      height={500}
                      draggable={false}
                      className="h-full w-full rounded-3xl object-cover object-center"
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex justify-between flex-col py-4 w-full">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            <h3 className="text-2xl font-bold dark:text-white text-black">
              {testimonials[active].name}
            </h3>
            <motion.p className="text-lg text-gray-500 mt-8 dark:text-neutral-300">
              {testimonials[active].quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    filter: "blur(10px)",
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="inline-block"
                >
                  {word} 
                </motion.span>
              ))}
            </motion.p>
            <a
              href={testimonials[active].redirect}
              className="relative inline-flex items-center justify-center mt-4 px-8 py-2 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 rounded-lg group"
            >
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-green-500 rounded-full group-hover:w-56 group-hover:h-56"></span>
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
              <span className="relative">Visit Now</span>
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};