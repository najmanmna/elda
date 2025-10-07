"use client";

import React from "react";
import Link from "next/link";
import useCartStore from "@/store";
import { motion } from "framer-motion";
import CartLogo from "./ui/carticon";
interface CartMenuProps {
  color?: "black" | "white"; // dynamic icon color
}

const CartMenu: React.FC<CartMenuProps> = ({ color = "black" }) => {
  const { items } = useCartStore();
  const cartCount = items.length;

  const iconColor = color === "white" ? "text-white" : "text-black";
 
  return (
    <motion.div
      className="relative z-50"
      whileHover={{
        scale: 1.15,
      
      }}
    >
      <Link href="/">
        <div className={`p-3 hoverEffect relative ${iconColor}`}>
          <CartLogo />
          {cartCount > 0 && (
  <span
    className={`absolute top-2 right-1 w-5 h-5 flex items-center justify-center rounded-full text-xs
      ${color === "white" ? "bg-white text-tech_primary" : "bg-tech_dark text-white"}`}
  >
    {cartCount}
  </span>
)}

        </div>
      </Link>
    </motion.div>
  );
};

export default CartMenu;
