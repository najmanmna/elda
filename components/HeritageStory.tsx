"use client";
import React from "react";
import Container from "./Container";
import Image from "next/image";
import sectionBreak from "../public/sectionBreak.png";

// Images you uploaded
import img1 from "../public/img1.png";
import img2 from "../public/img2.png";
import img3 from "../public/img3.png";

// Tileable motif border
import borderTile from "../public/line-motif.png";

const heritagePoints = [
  {
    title: "Handcrafted in India",
    description:
      "We source from traditional artisan communities where block printing has been passed down for generations.",
    image: img1,
  },
  {
    title: "Curated for Sri Lanka",
    description:
      "Our collections are selected with Sri Lankan lifestyles in mind – lightweight, breathable, and timelessly stylish",
    image: img2,
  },
  {
    title: "Sustainable, Timeless, Artisan-Made",
    description:
      "Each fabric is made to last. When cared for, it carries the soul of slow fashion.",
    image: img3,
  },
];

const HeritageStory = () => {
  return (
    <div className="relative">
      <div className="absolute -top-6  w-full overflow-hidden">
        <img
          src={sectionBreak.src}
          alt="Section divider flipped"
          className="w-full h-auto object-cover rotate-180"
        />
      </div>
      <div className="absolute -bottom-4 w-full overflow-hidden">
        <img
          src={sectionBreak.src}
          alt="Section divider flipped"
          className="w-full h-auto object-cover rotate-180"
        />
      </div>{" "}
      <div className="py-20 px-10">
        {/* Heading */}
        <div className="text-center mb-16 ">
          <h2 className="text-3xl sm:text-4xl font-playfair font-semibold text-tech_primary">
            THE HERITAGE WE BRING
          </h2>
          <p className="text-tech_gold mt-2 text-lg sm:text-xl max-w-2xl mx-auto">
            A celebration of timeless artistry, carefully curated for your home
            in Sri Lanka.
          </p>
        </div>

        {/* Points */}
        <div className="flex flex-col gap-16">
          {heritagePoints.map((point, idx) => (
            <div
              key={idx}
              className={`flex flex-col lg:flex-row items-center lg:justify-between gap-6 ${
                idx % 2 !== 0 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Text */}
              <div className="lg:w-1/2 text-center lg:text-left">
                <h3 className="text-xl sm:text-2xl font-playfair font-semibold mb-2">
                  {idx + 1}. {point.title}
                </h3>
                <p className="text-gray-700 text-base sm:text-lg ml-6">
                  {point.description}
                </p>
              </div>

              {/* Image with motif border */}
              <div
                className="lg:w-1/2 w-full h-60 sm:h-72 lg:h-64 p-[10px] relative"
                style={{
                  backgroundImage: `url(${borderTile.src})`,
                  backgroundRepeat: "repeat",
                  backgroundSize: "cover",
                  
                }}
              >
                <Image
                  src={point.image}
                  alt={point.title}
                  fill
                  className="object-cover w-full h-full relative z-10"
                  placeholder="blur"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeritageStory;
