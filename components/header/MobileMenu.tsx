// components/MobileMenu.tsx

"use client";

import { AlignLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import { client } from "@/sanity/lib/client";
import type { Category as BaseCategory } from "@/sanity.types";

// ✅ DEFINE A MORE ACCURATE TYPE for our fetched data
export interface ExpandedCategory extends Omit<BaseCategory, "parent"> {
  parent?: {
    _id: string;
    name: string | null;
    slug: { current: string | null } | null;
  } | null;
}

const ALLCATEGORIES_QUERY = `
  *[_type == "category"] | order(_createdAt asc){
    ...,
    parent->{
      _id,
      name,
      slug
    }
  }
`;

interface MobileMenuProps {
  color?: "black" | "white";
}

const MobileMenu: React.FC<MobileMenuProps> = ({ color = "black" }) => {
  // ✅ USE THE NEW TYPE HERE
  const [categories, setCategories] = useState<ExpandedCategory[] | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        // Use a generic to tell the fetch client what type to expect
        const data = await client.fetch<ExpandedCategory[]>(ALLCATEGORIES_QUERY);
        setCategories(data || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((s) => !s);

  return (
    <>
      <motion.button
        onClick={toggleSidebar}
        whileHover={{
          scale: 1.15,
          transition: { type: "spring", stiffness: 300, damping: 15 },
        }}
        whileTap={{ scale: 0.95 }}
        className={`p-2 rounded-full focus:outline-none bg-transparent transition-colors duration-300 ${
          color === "white" ? "text-tech_primary" : "text-tech_primary"
        }`}
      >
        <AlignLeft className="w-8 h-8 sm:w-10 sm:h-10 text-tech_primary" />
      </motion.button>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        // The prop now correctly matches the state type
        categories={categories ?? undefined}
      />
    </>
  );
};

export default MobileMenu;