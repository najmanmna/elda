"use client";
import React, { useState, useEffect } from "react";
import { urlFor } from "@/sanity/lib/image";
import AddToCartButton from "@/components/AddToCartButton";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import Container from "@/components/Container";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useCartStore from "@/store";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import { PortableText } from "@portabletext/react";
import LocalQuantitySelector from "@/components/LocalQuantitySelector";

export default function ProductClient({ product }: { product: any }) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [accordionOpen, setAccordionOpen] = useState<{
    [key: string]: boolean;
  }>({});
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const [buying, setBuying] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const rawVariant = product.variants[selectedVariantIndex];
  const selectedVariant = {
    _key: rawVariant._key,
    name:
      rawVariant.variantName ??
      rawVariant.colorName ??
      rawVariant.color ??
      `Option ${selectedVariantIndex + 1}`,
    availableStock: rawVariant.availableStock ?? 0,
    images: rawVariant.images ?? [],
  };

  const [availableStock, setAvailableStock] = useState(
    selectedVariant.availableStock
  );
  useEffect(() => {
    setAvailableStock(rawVariant.availableStock ?? 0);
  }, [rawVariant.availableStock, selectedVariantIndex]);

  const images =
    selectedVariant.images.length > 0
      ? selectedVariant.images
      : (product.images ?? []);
  const itemKey = `${product._id}-${selectedVariant._key}`;
  console.log("Available Stock:", availableStock); // Debugging line
  const handleBuyNow = async () => {
    if (buying) return;

    if (availableStock === 0) {
      toast.error("This product is out of stock");
      return;
    }

    setBuying(true);

    try {
      // Add/update the cart with selected quantity
      addItem(product, selectedVariant, quantity);

      // Navigate to cart page immediately
      router.push("/checkout");
    } finally {
      setBuying(false);
    }
  };

  useEffect(() => {
    const info = {
      name: product?.name ?? null,
      slug: product?.slug?.current ?? null,
    };
    (window as any).__PRODUCT_INFO = info;
    window.dispatchEvent(new Event("productInfo"));
    return () => {
      delete (window as any).__PRODUCT_INFO;
      window.dispatchEvent(new Event("productInfo"));
    };
  }, [product]);

  const toggleAccordion = (key: string) => {
    setAccordionOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      {buying && <Loading />}
      <Container className="py-10">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Product Images */}
          {images.length > 0 && (
            <ImageView images={images} isStock={availableStock} />
          )}

          {/* Info */}
          <div className="w-full md:w-3/5 flex flex-col gap-5">
            <div className="space-y-2">
              <p
                className={`w-24 text-center text-xs py-1 font-semibold rounded-lg ${
                  availableStock > 0
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {availableStock > 0 ? "In Stock" : "Out of Stock"}
              </p>

              {/* Title */}
              <p className="text-3xl sm:text-4xl font-playfair font-bold">
                {product.name}
              </p>

              {/* Category / Subcategory */}
              <div className="flex gap-2 text-sm mt-1 flex-wrap">
                {product.category && (
                  <span className="bg-tech_primary text-white px-2 py-0.5 rounded">
                    {product.category.name}
                  </span>
                )}
                {product.subcategory && (
                  <span className="bg-tech_gold text-white px-2 py-0.5 rounded">
                    {product.subcategory.name}
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <PriceView
              price={product.price}
              discount={product.discount}
              className="text-lg font-bold"
              unitLabel={
                product.category?.name?.toLowerCase() === "fabrics"
                  ? "/meter"
                  : undefined
              }
            />

            {/* Select Variant Label */}
            {product.variants.length > 1 && (
              <p className="text-sm font-semibold mt-3">Select Variant:</p>
            )}

            {/* Variant Image Previews */}
            {product.variants.length > 1 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {product.variants.map((v: any, idx: number) => {
                  const preview = v.images?.[0];
                  if (!preview) return null;
                  return (
                    <button
                      key={v._key ?? idx}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`w-16 h-16 border rounded overflow-hidden ${
                        idx === selectedVariantIndex
                          ? "ring-2 ring-tech_orange"
                          : ""
                      }`}
                    >
                      <Image
                        src={urlFor(preview).url()}
                        alt={v.colorName ?? v.color ?? `Variant ${idx + 1}`}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Quantity Selector Label & Stock Info */}
          {/* Quantity Selector with Label and Available Stock */}
<div className="flex flex-col gap-1 mt-4">
  {/* Label */}
  <p className="text-sm font-semibold">
    {product.category?.name?.toLowerCase() === "fabrics"
      ? "Select quantity (in meters)"
      : "Select quantity"}
  </p>

  {/* Quantity selector and stock info */}
  <div className="flex items-center gap-3">
    <LocalQuantitySelector
      stockAvailable={selectedVariant?.availableStock}
      onChange={(q) => setQuantity(q)}
    />
    <p className="text-sm text-gray-500">
      {product.category?.name?.toLowerCase() === "fabrics"
        ? `Available: ${availableStock}m`
        : `Available: ${availableStock}`}
    </p>
  </div>
</div>


            {/* Quantity Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4">
              {/* Add to Cart Button */}
              <AddToCartButton
                product={product}
                variant={selectedVariant}
                selectedQuantity={quantity}
              />
              <button
                onClick={handleBuyNow}
                disabled={buying}
                className={`w-36 text-white py-2 rounded-md transition-all ${
                  buying
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-tech_primary hover:bg-tech_dark_color"
                }`}
              >
                {buying ? "Processing..." : "BUY NOW"}
              </button>
            </div>

            {/* Accordion moved below buttons */}
            <div className="mt-6 w-full md:w-full">
              <div className="border rounded-lg">
                <button
                  onClick={() => toggleAccordion("details")}
                  className="w-full text-left px-4 py-2 font-semibold flex justify-between items-center"
                >
                  PRODUCT DETAILS
                  <span>{accordionOpen["details"] ? "−" : "+"}</span>
                </button>
                {accordionOpen["details"] && (
                  <div className="px-4 py-3 text-gray-700 text-sm space-y-2">
                    {product.material && (
                      <p>
                        <span className="font-semibold">Material:</span>{" "}
                        {product.material}
                      </p>
                    )}
                    {product.width && (
                      <p>
                        <span className="font-semibold">Width:</span>{" "}
                        {product.width}
                      </p>
                    )}
                    {product.useCases && (
                      <p>
                        <span className="font-semibold">Use Cases:</span>{" "}
                        {product.useCases}
                      </p>
                    )}
                    {product.description && (
                      <div>
                        <span className="font-semibold">Description:</span>
                        <PortableText value={product.description} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
