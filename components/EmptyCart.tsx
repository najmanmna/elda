"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

// NOTE: Replace this import with the actual path to your empty cart illustration.
import emptyCartIllustration from "@/public/cartempty.png";

// A more authentic, paisley-inspired block stamp icon
const BlockStampIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M50 2C23.49 2 2 23.49 2 50s21.49 48 48 48 48-21.49 48-48S76.51 2 50 2zm0 8.64c12.15 0 22.4 6.7 27.53 16.35-2.73-3.8-6.1-6.8-9.88-8.7-7.4-3.7-16-3.7-23.4 0-4.32 2.16-8.2 5.5-11.2 9.7C29.43 17.34 39.08 10.64 50 10.64zM22.47 32.65c2.73 3.8 6.1 6.8 9.88 8.7 7.4 3.7 16 3.7 23.4 0 4.32-2.16 8.2-5.5 11.2-9.7C70.57 23.31 60.92 16.61 50 16.61c-12.15 0-22.4 6.7-27.53 16.04zm55.06 34.7c-2.73-3.8-6.1-6.8-9.88-8.7-7.4-3.7-16-3.7-23.4 0-4.32 2.16-8.2 5.5-11.2 9.7C29.43 77.69 39.08 84.39 50 84.39c12.15 0 22.4-6.7 27.53-16.04zM50 89.36c-12.15 0-22.4-6.7-27.53-16.35 2.73 3.8 6.1 6.8 9.88 8.7 7.4 3.7 16 3.7 23.4 0 4.32-2.16 8.2-5.5 11.2-9.7C70.57 82.66 60.92 89.36 50 89.36z"
      opacity="0.8"
    />
  </svg>
);

export default function EmptyCart() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        // ✅ CORRECTED THIS LINE
        ease: "easeOut", 
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)]  text-center p-6 overflow-hidden"
    >
      {/* Background decorative stamps */}
      <BlockStampIcon className="absolute -top-16 -left-20 w-64 h-64 text-[#A67B5B]/5 rotate-12" />
      <BlockStampIcon className="absolute -bottom-24 -right-16 w-80 h-80 text-[#2C3E50]/5 rotate-[25deg]" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div variants={itemVariants} className="relative w-72 h-72 sm:w-80 sm:h-80 mb-6">
          {/* Floating Stamp 1 */}
          <motion.div
            className="absolute top-0 left-0 text-[#A67B5B]/20"
            animate={{
              y: [0, -12, 0],
              rotate: [0, 15, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <BlockStampIcon className="w-16 h-16" />
          </motion.div>

          {/* Floating Stamp 2 */}
          <motion.div
            className="absolute bottom-4 right-0 text-[#2C3E50]/10"
            animate={{
              y: [0, 8, 0],
              x: [0, -12, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8,
            }}
          >
            <BlockStampIcon className="w-12 h-12" />
          </motion.div>
          
          {/* Main Illustration */}
          <motion.div
            className="w-full h-full flex items-center justify-center"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src={emptyCartIllustration}
              alt="An artistic illustration of a shopping cart with a plant"
              width={280}
              height={280}
              className="object-contain drop-shadow-xl"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <motion.h2
          variants={itemVariants}
          className="font-serif text-4xl md:text-5xl font-medium text-[#2C3E50] mb-3"
        >
          Your Cart is Empty
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="max-w-md text-gray-500 mb-8 text-lg"
        >
          It’s waiting for a masterpiece. Discover handcrafted textiles to begin your next creation.
        </motion.p>

        {/* Call to Action Button */}
        <motion.div variants={itemVariants}>
          <Link
            href="/shop"
            className="inline-block bg-tech_primary  text-white font-semibold py-3.5 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Explore the Collection
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}