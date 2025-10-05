import { search_icon } from "@/images";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
interface Props {
  className?: string;
}

const SearchLogo = ({ className }: Props) => {
  return (
    
      <Image src={search_icon} alt="logo" className={cn("w-15 sm:w-15", className)} />
 
  );
};

export default SearchLogo;
