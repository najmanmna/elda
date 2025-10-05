"use client";
import { useState, useEffect } from "react";
import Container from "./Container";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { urlFor } from "@/sanity/lib/image";
import { useIsMobile } from "@/hooks/useIsMobile";

const CarouselWithDots = ({ banner }: { banner: any[] }) => {
  const [api, setApi] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isMobile = useIsMobile(); // 👈 detect screen size

  // Filter banners based on `showOn`
  const filteredBanners = banner.filter((item) => {
    if (isMobile) {
      return item.showOn === "mobile" || item.showOn === "both";
    }
    return item.showOn === "desktop" || item.showOn === "both";
  });

  const onInit = (emblaApi: any) => {
    setApi(emblaApi);
    setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  };

  // Auto-slide every 5s
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext(); // loop enabled will wrap automatically
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="w-full lg:col-span-3">
      <Carousel
        className="relative w-full  overflow-hidden"
        setApi={onInit}
        opts={{ loop: true }}
      >
        <CarouselContent>
          {filteredBanners.map((item, index) => {
            const image = isMobile ? item?.mobile?.image : item?.desktop?.image;
            const buttonTheme = isMobile
              ? item?.mobile?.buttonTheme
              : item?.desktop?.buttonTheme;
            const imageUrl = isMobile
              ? urlFor(image).width(900).height(900).url() // smaller size for mobile
              : urlFor(image).url(); // keep desktop original
            return (
              <CarouselItem key={index} className="pl-0">
                <div className="relative w-full h-[60vh] sm:h-[80vh] aspect-[4/3] sm:aspect-[21/9] flex items-center justify-center mx-auto">
                  {image && (
                    <Image
                      src={imageUrl || "/fallback.png"}
                      alt={`Banner ${index + 1}`}
                      fill
                      className="object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                      priority={index === 0}
                    />
                  )}

                  {/* 👇 Overlay button */}
                  <a
                    href={item?.link || "/shop"}
                    className={`
    absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2
    px-5 py-2 font-normal border shadow-md
    transition-all duration-300 ease-in-out
    ${
      buttonTheme === "light"
        ? "bg-transparent text-white border-white hover:text-gray-100 hover:shadow-[0_0_12px_2px_rgba(255,255,255,0.6)]"
        : "bg-black/40 text-white border-white hover:text-white hover:shadow-[0_0_12px_2px_rgba(0,0,0,0.5)]"
    }
  `}
                  >
                    SHOP NOW
                  </a>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Dots */}
        <div className="flex justify-center mt-3 gap-2">
          {filteredBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={`h-3 w-3 rounded-full transition ${
                selectedIndex === i ? "bg-tech_orange" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default CarouselWithDots;
