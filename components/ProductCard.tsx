// src/components/ProductCard.tsx
import { ALL_PRODUCTS_QUERYResult } from "@/sanity.types";
import React, { useState } from "react";
import PriceView from "./PriceView";
import Link from "next/link";
import Title from "./Title";
import { image } from "@/sanity/image";

// ✅ Import your background image
import cardBg from "../public/texture.png"; // <-- replace with your image path

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
      className="group relative overflow-hidden text-sm shadow-[2px_4px_8px_rgba(0,0,0,0.08),-2px_3px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.12),0_6px_12px_rgba(0,0,0,0.08)] transition-shadow duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundImage: `url(${cardBg.src})`,
       backgroundBlendMode: "multiply",
        backgroundSize: "cover",
      }}
    >
      <div className=" p-4 flex flex-col h-96 ">
        {/* Product Image */}
        <div className="relative w-full border-2 border-tech_gold overflow-hidden ">
          {/* <Link href={`/product/${product?.slug?.current || ""}`}> */}
          <Link href={`/`}>
            {primaryImage && (
              <img
                src={
                  hovered && secondaryImage
                    ? image(secondaryImage).width(700).height(600).url()
                    : image(primaryImage).width(700).height(600).url()
                }
                alt={product?.name || "productImage"}
                loading="lazy"
                className={`w-full h-auto max-h-60 object-contain bg-tech_white transition-all duration-500
                  ${totalStock > 0 ? "group-hover:scale-105" : "opacity-50"}`}
              />
            )}
          </Link>
        </div>

        {/* Product Details */}
        <div className="p-4 flex flex-col items-center gap-2 flex-1">
          <Title className="text-2xl font-cormorant line-clamp-2 text-center">
            {product?.name}
          </Title>

          <PriceView
            price={product?.price}
            discount={product?.discount}
            className="text-lg"
          />

          {totalStock === 0 && (
            <p className="text-sm text-red-600 font-semibold">OUT OF STOCK</p>
          )}

          {/* Shop Now Button */}
          {totalStock > 0 && (
            <Link
              // href={`/product/${product?.slug?.current || ""}`}
                   href={`/`}
              className="mt-3 inline-block px-6 py-2 bg-tech_primary text-white text-sm font-semibold shadow hover:bg-tech_dark transition-colors"
            >
              SHOP NOW
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
