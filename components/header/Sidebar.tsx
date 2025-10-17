"use client";

import { X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useOutsideClick } from "@/hooks";
import { quickLinksDataMenu } from "@/constants";
import { ExpandedCategory } from "./MobileMenu";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: ExpandedCategory[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, categories }) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const mainCategories = categories?.filter((cat) => !cat.parent?._id);
  const getSubcategories = (parentId: string) =>
    categories?.filter((cat) => cat.parent?._id === parentId);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory((prevId) => (prevId === categoryId ? null : categoryId));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/40 z-40"
        >
          <motion.div
            ref={sidebarRef}
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeOut" }}
            className="fixed top-0 left-0 sm:w-full max-w-sm bg-[#FDFBF6] z-50 h-screen p-6 shadow-2xl flex flex-col gap-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-medium text-[#2C3E50]">
                Menu
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-[#2C3E50] p-1 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Category List */}
            <div className="flex-grow overflow-y-auto pr-2">
              {mainCategories?.length ? (
                mainCategories.map((mainCat) => {
                  const subcategories = getSubcategories(mainCat._id!);
                  const isActive = activeCategory === mainCat._id;

                  return (
                    <div key={mainCat._id} className="mb-4">
                      <div
                        onClick={() => handleCategoryClick(mainCat._id!)}
                        className="flex items-center justify-between cursor-pointer font-serif text-xl text-[#2C3E50] hover:text-[#A67B5B] transition-colors duration-200"
                      >
                        <span>{mainCat.name}</span>
                        <ChevronDown
                          className={`transform transition-transform duration-300 ${
                            isActive ? "rotate-180 text-[#A67B5B]" : "rotate-0"
                          }`}
                          size={20}
                        />
                      </div>

                      {/* Dropdown with All + Subcategories */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="flex flex-col gap-3 pl-4 mt-3 border-l-2 border-gray-200 overflow-hidden"
                          >
                            <Link
                              onClick={onClose}
                              href={`/category/${mainCat.slug?.current}`}
                              className={`hover:text-tech_primary transition text-gray-700 font-medium text-base ${
                                pathname ===
                                  `/category/${mainCat.slug?.current}` &&
                                "text-tech_gold font-semibold"
                              }`}
                            >
                              All {mainCat.name}
                            </Link>

                            {subcategories?.length ? (
                              subcategories.map((sub) => (
                                <Link
                                  onClick={onClose}
                                  key={sub._id}
                                  href={`/category/${sub.slug?.current}`}
                                  className={`hover:text-tech_primary transition text-gray-500 text-base ${
                                    pathname ===
                                      `/category/${sub.slug?.current}` &&
                                    "text-tech_gold font-semibold"
                                  }`}
                                >
                                  {sub.name}
                                </Link>
                              ))
                            ) : (
                              <span className="text-gray-400 text-sm">
                                (No subcategories)
                              </span>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-400">Loading categories...</div>
              )}
            </div>

            {/* Footer Links */}
            <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
            

              {/* Store Locator */}
              <Link
                href="/#studio"
                onClick={onClose}
                className="block text-gray-600 hover:text-[#2C3E50] text-sm font-normal transition-colors"
              >
                Store Locator
              </Link>

              {/* Care Guide */}
              <Link
                href="/care-guide"
                onClick={onClose}
                className="block text-gray-600 hover:text-[#2C3E50] text-sm font-normal transition-colors"
              >
                Care Guide
              </Link>

                {quickLinksDataMenu?.map((item) => (
                <Link
                  key={item?.title}
                  href={item?.href}
                  onClick={onClose}
                  className="block text-gray-600 hover:text-[#2C3E50] text-sm font-normal transition-colors"
                >
                  {item?.title}
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
