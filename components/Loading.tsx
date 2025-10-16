"use client";
import { motion } from "framer-motion";

// SVG icon for the wooden block stamp handle.
// This represents the artisan's tool.
const BlockStampHandle = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Handle */}
    <path d="M7.5 12h9" />
    <path d="M6 15h12" />
    {/* Stamp Base */}
    <path d="M12 15v-3" />
    <path d="M9 9a3 3 0 013-3h0a3 3 0 013 3v3H9V9z" />
  </svg>
);

// SVG icon for the floral print pattern.
// This is the beautiful result of the artisan's work.
const FloralPrintIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2c2.8 0 5.3 1.1 7.1 2.9C20.9 6.7 22 9.2 22 12s-1.1 5.3-2.9 7.1C17.3 20.9 14.8 22 12 22s-5.3-1.1-7.1-2.9C3.1 17.3 2 14.8 2 12s1.1-5.3 2.9-7.1C6.7 3.1 9.2 2 12 2zm0 2c-2.2 0-4.2.9-5.7 2.3S4 9.8 4 12s.9 4.2 2.3 5.7S9.8 20 12 20s4.2-.9 5.7-2.3S20 14.2 20 12s-.9-4.2-2.3-5.7S14.2 4 12 4zm0 3c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5zm0 2c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" />
  </svg>
);


const Loading = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FDFBF6]">
      <div className="relative w-24 h-24">
        {/* The Floral Print that is "stamped" */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 1] }}
          transition={{
            repeat: Infinity,
            duration: 1.2, // Faster duration
            ease: "easeInOut",
            times: [0, 0.5, 1],
          }}
          className="absolute inset-0 flex items-center justify-center text-[#2C3E50]/70"
        >
          <FloralPrintIcon className="w-12 h-12" />
        </motion.div>

        {/* The Block Stamp Handle that "presses" */}
        <motion.div
          initial={{ y: -40 }}
          animate={{ y: [-40, 20, -40] }}
          transition={{
            repeat: Infinity,
            duration: 1.2, // Faster duration
            ease: "easeInOut",
            times: [0, 0.5, 1],
          }}
          className="absolute inset-0 flex items-center justify-center text-[#A67B5B]" // A warm, wood-like color
        >
          <BlockStampHandle className="w-10 h-10" />
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{
          repeat: Infinity,
          duration: 1.2, // Faster duration
          ease: "easeInOut",
        }}
        className="mt-4 font-serif text-lg font-medium text-[#2C3E50]"
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default Loading;

