
import HomeBanner from "@/components/HomeBanner";
import ProductGrid from "@/components/ProductGrid";

import ProductStatusSelector from "@/components/ProductStatusSelector";
import FooterTop from "@/components/common/FooterTop";
import MissionSection from "@/components/MissionSection";
import WhatIs from "@/components/WhatIs";

export default async function Home() {
  return (
    <div className="relative  pb-16">
      {/* Background layer */}
      

      {/* Content layer */}
      <div className="relative">
        <HomeBanner />
        <WhatIs />

        <div className="py-10">
          <ProductGrid />
        </div>

        <ProductStatusSelector />
        <MissionSection />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
          <FooterTop />
        </div>
      </div>
    </div>
  );
}
