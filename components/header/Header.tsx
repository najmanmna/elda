"use client";
import React, { useEffect, useState } from "react";
import Container from "../Container";
import LogoBlack from "../LogoBlack";
import LogoWhite from "../LogoWhite"; // 👈 import a white version of your logo
import MobileMenu from "./MobileMenu";
import SearchBar from "./SearchBar";
import CartMenu from "../CartMenu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        isScrolled
          ? "bg-tech_bg_color text-white shadow-lg"
          : "bg-tech_bg_color text-tech_black"
      }`}
    >
      <div className="relative flex items-center justify-between py-2 px-2 sm:px-10 ">
        {/* Left - Menu */}
        <div className={`flex items-center ${isScrolled ? "text-tech_primary" : "text-tech_primary"}`}>
          <MobileMenu color={isScrolled ? "white" : "black"} /> 
          {/* 👆 pass prop if you want to change menu icon color */}
        </div>

        {/* Center - Logo */}
        <div className="absolute left-1/2 top-13.5 transform -translate-x-1/2 -translate-y-1/2">
          {isScrolled ? <LogoBlack /> : <LogoBlack />}
        </div>

        {/* Right - Cart + Search */}
        <div className="flex items-center sm:gap-4">
          <div className={`hidden md:block ${isScrolled ? "text-white" : "text-black"}`}>
            <SearchBar color={isScrolled ? "white" : "black"} />
          </div>
          <div className={isScrolled ? "text-white" : "text-black"}>
            <CartMenu color={isScrolled ? "white" : "black"} />
          </div>
        </div>
      </div>

      {/* Mobile Search below header */}
      <div className="block md:hidden px-4 pb-3">
        <SearchBar color={isScrolled ? "white" : "black"} />
      </div>
    </header>
  );
};

export default Header;
