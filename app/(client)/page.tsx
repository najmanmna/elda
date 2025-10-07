import HomeBanner from "@/components/HomeBanner";
import ProductGrid from "@/components/ProductGrid";
import ProductStatusSelector from "@/components/ProductStatusSelector";
import FooterTop from "@/components/common/FooterTop";
import MissionSection from "@/components/MissionSection";
import WhatIs from "@/components/WhatIs";
import sectionBreak from "../../public/sectionBreak.png";

export default async function Home() {
  return (
    <div className="relative pb-16">
      <div className="relative">
        <HomeBanner />
        <WhatIs />

        {/* Section Break Image */}
        {/* <div className="absolute w-full overflow-hidden">
          <img
            src={sectionBreak.src}
            alt="Section divider"
            className="w-full h-auto object-cover"
          />
        </div> */}

        <div className="">
          <ProductGrid />
        </div>

        {/* Optional flipped divider */}
        {/* <div className="relative w-full overflow-hidden">
          <img
            src={sectionBreak.src}
            alt="Section divider flipped"
            className="w-full h-auto object-cover rotate-180"
          />
        </div> */}

        <ProductStatusSelector />
        {/* <MissionSection /> */}

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
          {/* <FooterTop /> */}
        </div>
      </div>
    </div>
  );
}
