"use client";
import { Product } from "@/sanity.types";
import toast from "react-hot-toast";
import PriceFormatter from "./PriceFormatter";
import useCartStore from "@/store";
import QuantityButtons from "./QuantityButtons";
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
  className?: string;
  variant: VariantShape; // 🔹 make required since schema requires variant
  displayMode?: "default" | "overlay";
}

const AddToCartButton = ({
  product,
  className,
  variant,
  displayMode = "default",
}: Props) => {
  const { addItem, getItemCount } = useCartStore();

  // ✅ Always build itemKey with variant
  const itemKey = `${product._id}-${variant._key}`;
  const itemCount = getItemCount(itemKey);

  const stockAvailable = variant.availableStock ?? 0;
  const isOutOfStock = stockAvailable === 0;

  // inside AddToCartButton.tsxy
  const handleAddToCart = () => {
    addItem(product, {
      _key: variant._key,
      color: variant.color,
      images: variant.images,
      availableStock: variant.availableStock,
    });
  };

  const textColor =
    displayMode === "overlay" ? "text-white" : "text-tech_dark/80";
  const amountColor =
    displayMode === "overlay" ? "text-white" : "text-tech_dark";

  return (
    <div className="w-full h-12 flex items-center">
      {itemCount ? (
        <div className={cn("text-sm w-full", textColor)}>
          <div className="flex items-center justify-between">
            <span className="text-xs">Quantity</span>
            <QuantityButtons
              itemKey={itemKey}
              product={product}
              // variant={variant} // ✅ always pass variant
              displayMode={displayMode}
            />
          </div>

          <div className="flex items-center justify-between border-t pt-1">
            <span className="text-xs font-semibold">Subtotal</span>
            <PriceFormatter
              amount={product?.price ? product.price * itemCount : 0}
              className={amountColor}
            />
          </div>
        </div>
      ) : (
        <button
          className={cn(
            "w-full py-2 px-4 bg-tech_orange text-white text-center  hover:bg-tech_orange/90 transition-colors flex items-center justify-center",
            className
          )}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          <ShoppingCart size={16} className="mr-2" />
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
