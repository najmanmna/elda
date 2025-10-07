"use client";
import { useState, useEffect } from "react";
import Container from "./Container";
import Image from "next/image";
import { useIsMobile } from "@/hooks/useIsMobile";

const localBanners = [
  {
    imageDesktop: "/banners/bg1.png",
    imageMobile: "/banners/bg1.png",
    heading: "Handcrafted Block Prints",
    subheading: "Inspired By Tradition, Sustainably Made",
    buttonTheme: "dark",
    link: "/shop",
  },
  {
    imageDesktop: "/banners/bg2.png",
    imageMobile: "/banners/bg2.png",
    heading: "Handcrafted Block Prints",
    subheading: "Inspired By Tradition, Sustainably Made",
    buttonTheme: "light",
    link: "/shop",
  },
  {
    imageDesktop: "/banners/bg3.png",
    imageMobile: "/banners/bg3.png",
    heading: "Handcrafted Block Prints",
    subheading: "Inspired By Tradition, Sustainably Made",
    buttonTheme: "light",
    link: "/shop",
  },
];

const CarouselWithZoom = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isMobile = useIsMobile();

  // Slide change every 8s
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % localBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container className="w-full pt-28 sm:pt-15 lg:col-span-3">
      <div className="relative w-full h-[40vh] sm:h-[80vh] overflow-hidden">
        {localBanners.map((item, index) => {
          const imageUrl = isMobile ? item.imageMobile : item.imageDesktop;

          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === selectedIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={imageUrl}
                alt={`Banner ${index + 1}`}
                fill
                className="object-cover scale-100 hover:scale-105 transition-transform duration-[15000ms] ease-in-out"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/20 z-0"></div>

              {(item.heading || item.subheading) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 z-10">
                  {item.heading && (
                    <h1 className="font-playfair text-white text-3xl sm:text-5xl font-bold drop-shadow-lg">
                      {item.heading}
                    </h1>
                  )}
                  {item.subheading && (
                    <p className="font-lato text-white text-sm sm:text-lg mt-2 drop-shadow-md">
                      {item.subheading}
                    </p>
                  )}
                  <a
                    href={item.link}
                    className="mt-4 inline-block px-6 py-3 bg-tech_bg_color text-primary font-semibold shadow-lg hover:bg-tech_primary hover:text-white transition-colors duration-300"
                  >
                    SHOP NOW
                  </a>
                </div>
              )}
            </div>
          );
        })}

        {/* Progress bars for each slide */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {localBanners.map((_, index) => (
            <div
              key={index}
              className="w-16 h-1 bg-gray-300 overflow-hidden rounded"
            >
              {selectedIndex === index && (
                <div
                  className="h-1 bg-tech_primary"
                  style={{ animation: "progress 5s linear forwards" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Inline CSS for progress animation */}
      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </Container>
  );
};

export default CarouselWithZoom;
