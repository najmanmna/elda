
import HomeBanner from "@/components/HomeBanner";
import ProductGrid from "@/components/ProductGrid";

import ProductStatusSelector from "@/components/ProductStatusSelector";
import InstagramElfsight from "@/components/InstagramFeed";
import FooterTop from "@/components/common/FooterTop";
import MissionSection from "@/components/MissionSection";

export default async function Home() {

  return (
    <div className="bg-tech_bg_color pb-16">
      <HomeBanner />

      <div className="py-10">
        <ProductGrid />
      </div>

      <ProductStatusSelector />
      <MissionSection />
      {/* <InstagramElfsight /> */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
        {" "}
        <FooterTop />
      </div>
    </div>
  );
}
