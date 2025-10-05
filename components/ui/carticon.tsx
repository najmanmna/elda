import { cart_icon } from "@/images";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
interface Props {
  className?: string;
}

const CartLogo = ({ className }: Props) => {
  return (
    
      <Image src={cart_icon} alt="logo" className={cn("w-15 sm:w-15", className)} />
 
  );
};

export default CartLogo;
