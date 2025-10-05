"use client";
import React, { useState, useEffect } from "react";
import { urlFor } from "@/sanity/lib/image";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// ✅ new import for magnification
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";

interface Props {
  images?: Array<{
    _key: string;
    asset?: { _ref: string };
  }>;
  isStock?: number;
}

export default function ImageView({ images = [], isStock }: Props) {
  const [active, setActive] = useState(images[0]);
  const [showModal, setShowModal] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (images.length > 0) setActive(images[0]);
  }, [images]);

  const openModal = (i: number) => {
    setInitialSlide(i);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <div className="w-full md:w-2/5 flex flex-col md:flex-row gap-4">
        {/* Thumbnails */}
        <div className="flex md:flex-col gap-2 md:gap-3 items-center md:items-start">
          {images.map((img, idx) => (
            <button
              key={`${img._key}-${idx}`} // ✅ unique key
              onClick={() => setActive(img)}
              className={`border rounded-md overflow-hidden w-16 h-16 md:w-20 md:h-20 ${
                active?._key === img._key ? "ring-2 ring-tech_dark_color" : ""
              }`}
            >
              <img
                src={urlFor(img).url()}
                alt={`thumb-${idx}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>

        {/* Magnified main image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active?._key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 border rounded-md overflow-hidden cursor-zoom-in"
            onClick={() =>
              openModal(images.findIndex((i) => i._key === active?._key))
            }
          >
            {active && (
              <InnerImageZoom
                src={urlFor(active).url()}
                zoomSrc={urlFor(active).url()} // high-res for magnification
                // zoomType="hover" // or "click"
                zoomScale={isMobile ? 1.2 : 1.2}
                zoomType={isMobile ? "click" : "hover"}
                zoomPreload
                // alt="product image"
                className={`object-contain w-full max-h-full ${
                  isStock === 0 ? "opacity-50" : ""
                }`}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modal carousel with zoom */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white  max-w-2xl w-full p-4 relative max-h-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 z-10 bg-white rounded-full p-1 shadow"
              >
                <X className="h-6 w-6" />
              </button>

              <Carousel className="w-full" opts={{ startIndex: initialSlide }}>
                <CarouselContent>
                  {images.map((img, idx) => (
                    <CarouselItem key={`${img._key}-modal-${idx}`}>
                      {" "}
                      <div className="flex items-center justify-center ">
                        <InnerImageZoom
                          src={urlFor(img).url()}
                          zoomSrc={urlFor(img).url()}
                          // zoomType="hover"
                          zoomScale={isMobile ? 1.1 : 1.1}
                          zoomType={isMobile ? "click" : "hover"}
                          zoomPreload
                          className="object-contain max-h-[80vh] w-full"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4" />
                <CarouselNext className="-right-4" />
              </Carousel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
