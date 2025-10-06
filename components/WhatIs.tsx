"use client";
import Image from "next/image";
import Container from "./Container";

// Import all images
import borderTile from "../public/line-motif.png";
import heroImage from "../public/hero-blockprint.jpg";

const WhatIs = () => {
  return (
    <Container className="py-16">
      {/* Heading & Subheading on top, centered */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-playfair font-semibold text-tech_primary">
          WHAT IS BLOCK PRINTING?
        </h2>
        <p className="text-tech_gold mt-2 text-lg sm:text-xl">
          The Centuries-Old Craft Of Storytelling On Fabric.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-10">
        <div className="relative w-full lg:w-1/2">
  {/* Tiled border using pseudo-elements */}
  <div className="absolute inset-0 pointer-events-none">
    {/* Top Border */}
    <div
      className="absolute top-10 left-0 w-full h-16 bg-repeat-x"
      style={{ backgroundImage: `url(${borderTile.src})` }}
    />
    {/* Bottom Border */}
    <div
      className="absolute bottom-0 left-0 w-full h-16 bg-repeat-x"
      style={{ backgroundImage: `url(${borderTile.src})` }}
    />
    {/* Left Border */}
    <div
      className="absolute top-0 left-0 w-16 h-full bg-repeat-y"
      style={{ backgroundImage: `url(${borderTile.src})` }}
    />
    {/* Right Border */}
    <div
      className="absolute top-0 right-0 w-16 h-full bg-repeat-y"
      style={{ backgroundImage: `url(${borderTile.src})` }}
    />
  </div>

  {/* Main Image */}
  <Image
    src={heroImage}
    alt="Block Printing"
    width={600}
    height={600}
    className="w-full h-auto object-cover relative z-10"
  />
</div>


        {/* Right Content */}
        <div className="flex-1 text-center lg:text-left">
          <p className="mt-4 text-gray-700 text-base sm:text-lg">
            Block printing is an age-old tradition from India, where artisans
            hand-carve wooden blocks and print fabric with natural dyes. At
            ELDA, we carefully source and bring these timeless prints to Sri
            Lanka, so you can experience their beauty in your everyday life.
          </p>

          <div className="mt-6 flex justify-center lg:justify-start gap-4">
            <a
              href="/our-story"
              className="px-6 py-3 bg-tech_primary text-white font-semibold rounded shadow hover:bg-tech_dark transition-colors"
            >
              READ OUR STORY
            </a>
            <a
              href="/how-to-care"
              className="px-6 py-3 border border-tech_primary text-tech_primary font-semibold rounded shadow hover:bg-tech_primary hover:text-white transition-colors"
            >
              HOW TO CARE
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default WhatIs;
