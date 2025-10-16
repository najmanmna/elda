"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// A custom SVG animation of a simple weaving loom
const WeavingLoomIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 60"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Warp threads (vertical) */}
      {[...Array(8)].map((_, i) => (
        <line
          key={`warp-${i}`}
          x1={15 + i * 10}
          y1="5"
          x2={15 + i * 10}
          y2="55"
          stroke="#2C3E50"
          strokeOpacity="0.3"
          strokeWidth="2"
        />
      ))}

      {/* Shuttle (the moving part) */}
      <motion.rect
        x="5"
        y="25"
        width="15"
        height="10"
        rx="3"
        fill="#A67B5B"
        animate={{ x: [5, 80, 5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
};

const NoProductAvailable = ({
  selectedTab,
  className,
}: {
  selectedTab?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-6 text-center rounded-lg w-full py-16 bg-[#FDFBF6]/50",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <WeavingLoomIcon className="w-24 h-auto text-gray-400" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="font-serif text-3xl font-medium text-[#2C3E50]"
      >
        Our Artisans Are Weaving
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-md text-gray-500"
      >
        It seems every piece from the{" "}
        {selectedTab && (
          <span className="font-semibold text-[#A67B5B]">{selectedTab}</span>
        )}{" "}
        collection has found a home. New creations are on the loom.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-sm text-gray-400"
      >
        Please check back soon or explore our other timeless collections.
      </motion.p>
    </div>
  );
};

export default NoProductAvailable;
