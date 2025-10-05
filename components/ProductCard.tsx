// src/components/ProductCard.tsx
import { ALL_PRODUCTS_QUERYResult } from "@/sanity.types";
import React, { useState } from "react";
import PriceView from "./PriceView";
import Link from "next/link";
import Title from "./Title";
import { image } from "@/sanity/image";

type ProductWithVariants = ALL_PRODUCTS_QUERYResult[number];

const ProductCard = ({ product }: { product: ProductWithVariants }) => {
  // ✅ Collect first image from each variant safely
  const variantImages =
    product?.variants
      ?.map((v) => v?.images?.[0])
      .filter((img): img is NonNullable<typeof img> => Boolean(img)) || [];

  // ✅ Always calculate stock robustly
  const totalStock =
    product?.variants?.reduce((acc, v) => {
      if (!v) return acc;
      // Use availableStock if present, otherwise fallback to openingStock - stockOut
      const stock =
        typeof v.availableStock === "number"
          ? v.availableStock
          : (v.openingStock || 0) - (v.stockOut || 0);
      return acc + Math.max(stock, 0); // never negative
    }, 0) || 0;

  // ✅ Track hover state
  const [hovered, setHovered] = useState(false);

  const primaryImage = variantImages[0];
  const secondaryImage = variantImages[1];

  return (
    <div
      className="bg-tech_white rounded-md group overflow-hidden text-sm relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Product Image */}
      <div className="relative w-full">
        <Link href={`/product/${product?.slug?.current || ""}`}>
          {primaryImage && (
            <img
              src={
                hovered && secondaryImage
                  ? image(secondaryImage).width(800).height(900).url()
                  : image(primaryImage).width(800).height(900).url()
              }
              alt={product?.name || "productImage"}
              loading="lazy"
              className={`w-full h-auto max-h-80 object-contain bg-tech_white transition-all duration-500
                ${totalStock > 0 ? "group-hover:scale-105" : "opacity-50"}`}
            />
          )}
        </Link>
      </div>

      {/* Product Details */}
      <div className="p-3 flex flex-col items-center text-center gap-1">
        <Title className="text-base font-normal line-clamp-2">
          {product?.name}
        </Title>

        <PriceView
          price={product?.price}
          discount={product?.discount}
          className="text-sm"
        />

        {totalStock === 0 && (
          <p className="text-sm text-red-600 font-semibold">OUT OF STOCK</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
