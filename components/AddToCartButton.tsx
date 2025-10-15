"use client";
import { useState } from "react";
import { Product } from "@/sanity.types";
import toast from "react-hot-toast";
import PriceFormatter from "./PriceFormatter";
import useCartStore from "@/store";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import type { SanityImage } from "@/types/sanity-helpers";

interface VariantShape {
  _key: string;
  color?: string;
  availableStock?: number;
  images?: SanityImage[];
}

interface Props {
  product: Product;
  variant: VariantShape;
  className?: string;
  selectedQuantity?: number; // ✅ now received from LocalQuantitySelector
  displayMode?: "default" | "overlay";
}

export default function AddToCartButton({
  product,
  variant,
  className,
  selectedQuantity = 1,
  displayMode = "default",
}: Props) {
  const { addItem, getItemCount } = useCartStore();

  const itemKey = `${product._id}-${variant._key}`;
  const stockAvailable = variant.availableStock ?? 0;
  const isOutOfStock = stockAvailable === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("This product is out of stock");
      return;
    }

    // Remove existing variant if present (to replace quantity)
    

    // Add with the selected quantity
  addItem(
    product,
    {
      _key: variant._key,
      color: variant.color,
      images: variant.images,
      availableStock: variant.availableStock,
    },
    selectedQuantity // ✅ pass quantity
  );

    toast.success("Added to cart!");
  };

  const buttonStyle = cn(
    "w-1/2 py-2 px-4 rounded-lg flex items-center justify-center font-semibold transition-colors",
    displayMode === "overlay"
      ? "bg-tech_primary text-white hover:bg-white/90"
      : "bg-tech_primary text-white hover:bg-tech_orange/90",
    isOutOfStock && "bg-gray-400 cursor-not-allowed",
    className
  );

  return (
    <button

      className={buttonStyle}
      onClick={handleAddToCart}
      disabled={isOutOfStock}
    >
      <ShoppingCart size={16} className="mr-2" />
      Add to Cart
    </button>
  );
}
