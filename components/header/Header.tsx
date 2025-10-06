"use client";
import React, { useEffect, useState } from "react";
import LogoBlack from "../LogoBlack";
import MobileMenu from "./MobileMenu";
import SearchBar from "./SearchBar";
import CartMenu from "../CartMenu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const announcementHeight = 48; // px, adjust to your py value

  return (
    <header className="fixed top-0 z-50 w-full">
      {/* Announcement Bar */}
      <div
        className={`bg-tech_primary text-white text-sm px-6 flex items-center justify-center gap-24 transition-all duration-300`}
        style={{
          height: isScrolled ? 0 : announcementHeight,
          overflow: "hidden",
          transform: isScrolled ? "translateY(-100%)" : "translateY(0)",
        }}
      >
        <span className="uppercase">Island-wide delivery</span>
        <div className="w-px h-5 bg-white"></div>
        <span className="uppercase">Secure Payments</span>
        <div className="w-px h-5 bg-white"></div>
        <span className="uppercase">Cash on Delivery</span>
      </div>

      {/* Main Header */}
      <div
        className={`transition-colors duration-300 ${
          isScrolled ? "bg-tech_bg_color shadow-lg" : "bg-transparent"
        }`}
        style={{
          // margin: !isScrolled ? announcementHeight : 0, // push header down when bar visible
        }}
      >
        <div className="relative flex items-center justify-between py-2 px-2 sm:px-10">
          {/* Left - Menu */}
          <div className="flex items-center text-tech_primary">
            <MobileMenu color="black" />
          </div>

          {/* Center - Logo */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <LogoBlack />
          </div>

          {/* Right - Cart + Search */}
          <div className="flex items-center sm:gap-4">
            <div className="hidden md:block text-black">
              <SearchBar color="black" />
            </div>
            <div className="text-black">
              <CartMenu color="black" />
            </div>
          </div>
        </div>

        {/* Mobile Search below header */}
        <div className="block md:hidden px-4 pb-3">
          <SearchBar color="black" />
        </div>
      </div>
    </header>
  );
};

export default Header;
