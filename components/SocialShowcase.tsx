"use client";

import { motion } from "framer-motion";
import { useEffect, ReactNode } from "react";

// Helper component for SVG Icons
const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TikTokIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.63-1.1-6.16-2.96-1.66-2.04-2.4-4.66-2.13-7.34.27-2.64 1.8-5.04 3.9-6.52 2.01-1.4 4.54-2.02 7.02-1.74v4.32c-1.57.07-3.15.34-4.6.91-.79.3-1.56.67-2.28 1.13-.02.01-.01.02-.02.03-.21.15-.42.3-.63.46-.36.28-.73.55-1.09.84-.08.06-.17.11-.25.17a.12.12 0 0 0-.03.14c.18.5.38 1.01.57 1.51.02.06.07.1.12.11.23.04.46.09.69.12.23.03.47.04.7.06.39.02.78.03 1.17.02v-5.4c-.01-1.19.01-2.39.02-3.58z" />
  </svg>
);

// Generic Social Card Wrapper for consistent styling and animations
const SocialCard = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="bg-white/50 rounded-xl shadow-lg overflow-hidden border border-gray-200/50"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="p-4 bg-white/70 border-b border-gray-200/50">
        <div className="flex items-center space-x-3">
          {icon}
          <h3 className="font-serif text-xl font-medium text-[#2C3E50]">{title}</h3>
        </div>
      </div>
      {/* Wrapper to mitigate Cumulative Layout Shift (CLS) */}
      <div className="w-full min-h-[500px] bg-gray-100 flex items-center justify-center p-2">
        {children}
      </div>
    </motion.div>
  );
};

const InstagramEmbed = ({ permalink }: { permalink: string }) => {
  useEffect(() => {
    // Check if the Instagram script is already loaded
    if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
      return;
    }
    const script = document.createElement("script");
    script.src = "//www.instagram.com/embed.js";
    script.async = true;
    script.onload = () => {
      (window as any).instgrm.Embeds.process();
    };
    document.body.appendChild(script);
  }, [permalink]);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={permalink}
      data-instgrm-version="14"
      style={{
        background: "#FFF",
        border: "0",
        borderRadius: "3px",
        boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
        margin: "1px",
        maxWidth: "540px",
        minWidth: "326px",
        padding: "0",
        width: "calc(100% - 2px)",
      }}
    ></blockquote>
  );
};

const TikTokEmbed = ({ url }: { url: string }) => {
  useEffect(() => {
    // Check if the TikTok script already exists to avoid duplicates
    if (document.querySelector('script[src="https://www.tiktok.com/embed.js"]')) {
      return;
    }
    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <blockquote
      className="tiktok-embed"
      cite={url}
      data-video-id={url.split("/").pop()}
      style={{ maxWidth: "605px", minWidth: "325px", margin: "0 auto" }}
    >
      <section>
        {/* Fallback content, will be replaced by the embed */}
        <a target="_blank" rel="noopener noreferrer" title="@eldalk" href="https://www.tiktok.com/@eldalk?refer=embed">
          @eldalk
        </a>
      </section>
    </blockquote>
  );
};

const SocialShowcase = () => {
  return (
    <section className=" py-24 sm:py-32">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-playfair uppercase font-semibold text-4xl  text-tech_primary mb-4">
            Follow Our Journey
          </h2>
          <p className="max-w-2xl mx-auto text-tech_gold font-lato">
            Step behind the scenes and see the artistry that brings our textiles to life. Join our community for daily inspiration and stories.
          </p>
        </motion.div>

        {/* Updated Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:items-start gap-8 lg:gap-12 mt-16 max-w-6xl mx-auto">
          {/* Instagram Card */}
          <SocialCard title="On Instagram" icon={<InstagramIcon />}>
            <InstagramEmbed permalink="https://www.instagram.com/reel/DPx-BQmE_7Y/" />
            
          </SocialCard>

          {/* TikTok Card */}
          <SocialCard title="On TikTok" icon={<TikTokIcon />}>
            <TikTokEmbed url="https://www.tiktok.com/@eldalk/video/7361153274029919505" />
          </SocialCard>
        </div>
      </div>
    </section>
  );
};

export default SocialShowcase;