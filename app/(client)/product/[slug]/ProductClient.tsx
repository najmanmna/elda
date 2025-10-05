"use client";
import React, { useState, useEffect } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import { Dialog } from "@headlessui/react";
import toast from "react-hot-toast"; // ✅ import toast
import Container from "@/components/Container";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { useRouter } from "next/navigation";
import useCartStore from "@/store";
import Loading from "@/components/Loading";

export default function ProductClient({ product }: { product: any }) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  // ✅ always pick from variants (schema guarantees at least one)

  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);


  const rawVariant = product.variants[selectedVariantIndex];
  const selectedVariant = {
    _key: rawVariant._key,
    color: rawVariant.colorName ?? rawVariant.color ?? rawVariant.name,
    availableStock: rawVariant.availableStock ?? 0,
    images: rawVariant.images ?? [],
  };
  const [availableStock, setAvailableStock] = useState(
  rawVariant.availableStock ?? 0
);
useEffect(() => {
  setAvailableStock(rawVariant.availableStock ?? 0);
}, [rawVariant.availableStock, selectedVariantIndex]);

  // ✅ images for ImageView
  const images =
    selectedVariant.images?.length > 0
      ? selectedVariant.images
      : (product.images ?? []);

  // ✅ unique cart key
  const itemKey = `${product._id}-${selectedVariant._key}`;
  const [buying, setBuying] = useState(false);
  const handleBuyNow = async () => {
    if (buying) return; // ⛔ prevent double-click
    if (availableStock === 0) {
  toast.error("This product is out of stock");
  return;
}

    setBuying(true);

    try {
      // const itemKey = `${product._id}-${selectedVariant._key}`;
      const existsInCart = cartItems.find((item) => item.itemKey === itemKey);

      if (!existsInCart) {
        addItem(product, selectedVariant);
      }

      setTimeout(() => {
        router.push("/cart");
      }, 100);
    } finally {
      // we don't reset buying here, because navigation unmounts the page
    }
  };

  useEffect(() => {
    // publish product info for the global Floating WhatsApp button
    const info = {
      name: product?.name ?? null,
      slug: product?.slug?.current ?? null,
    };

    // store globally
    (window as any).__PRODUCT_INFO = info;

    // notify listeners
    window.dispatchEvent(new Event("productInfo"));

    // cleanup on unmount / when product changes
    return () => {
      delete (window as any).__PRODUCT_INFO;
      window.dispatchEvent(new Event("productInfo"));
    };
  }, [product]);
  return (
    <>
      {buying && <Loading />}
      <div className="bg-tech_white py-10">
        <Container>
          <div className="flex flex-col md:flex-row gap-10">
            {/* Product Images (main gallery) */}
            {images.length > 0 && (
              <ImageView images={images} isStock={selectedVariant.availableStock} />
            )}

            {/* Info */}
            <div className="w-full md:w-3/5 flex flex-col gap-5">
              <div className="space-y-1">
                <p
                  className={`w-24 text-center text-xs py-1 font-semibold rounded-lg ${
                    selectedVariant.availableStock > 0
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {selectedVariant.availableStock > 0 ? "In Stock" : "Out of Stock"}
                </p>
                <p className="text-2xl font-bold">{product?.name}</p>
              </div>

              {/* Price */}
              <PriceView
                price={product?.price}
                discount={product?.discount}
                className="text-lg font-bold"
              />

              {/* Delivery Time */}
              <p className="text-sm text-gray-600">
                Delivery Time: 3-5 Working Days
              </p>

              {/* Colors */}
              
              {product?.variants?.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm font-semibold">Colors:</p>
                    {product.variants.map((v: any, idx: number) => (
                      <button
                        key={v._key ?? idx}
                        className={`px-3 py-1 rounded border ${
                          idx === selectedVariantIndex
                            ? "bg-black text-white"
                            : "bg-white text-black"
                        }`}
                        onClick={() => setSelectedVariantIndex(idx)}
                      >
                        {v.colorName ?? v.color ?? `Option ${idx + 1}`}
                      </button>
                    ))}
                  </div>

                  {/* Variant image previews under colors */}
                  <div className="flex flex-wrap gap-2 mt-2">
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
                            className="object-contain w-full h-full"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add to Cart + Buy Now */}
              <div className="flex items-center gap-3 w-full sm:w-1/2">
                <AddToCartButton
                  key={itemKey}
                  product={product}
                 variant={{ ...selectedVariant, availableStock }}
                />
                <button
                  onClick={handleBuyNow}
                  disabled={buying}
                  className={`w-36 text-white py-2 transition rounded 
    ${buying ? "bg-gray-400 cursor-not-allowed" : "bg-gray-500 hover:bg-gray-600"}`}
                >
                  {buying ? "Processing..." : "BUY NOW"}
                </button>
              </div>
            </div>
          </div>
          <div className="">
            <div className="flex flex-col md:flex-row gap-10 items-start py-20">
              {/* ---------- Left: Real Image + View More ---------- */}
              <div className="w-full md:w-1/2">
                {product?.realImages?.[0] ? (
                  <div className="flex flex-col items-center">
                    <Image
                      src={urlFor(product.realImages[0]).url()}
                      alt="Real product photo"
                      width={500}
                      height={500}
                      className="rounded-lg object-cover"
                    />
                    {product.realImages.length > 1 && (
                      <button
                        onClick={() => setShowGallery(true)}
                        className="mt-4  bg-black text-white px-6 py-3 font-semibold border border-black
    transition-all duration-300 ease-in-out
    hover:bg-white hover:text-black
    hover:shadow-[0_0_12px_2px_rgba(0,0,0,0.3)]
    hover:scale-105"
                      >
                        VIEW MORE
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    
                  </p>
                )}
              </div>

              {/* ---------- Right: Features, Description, Specs ---------- */}
              <div className="w-full md:w-1/2 space-y-8">
                {/* Features */}
                {product?.features?.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
                    {(product.features ?? []).map((f: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center gap-2"
                      >
                        {f.icon && (
                          <Image
                            src={urlFor(f.icon).url()}
                            alt={f.label || "Product feature icon"}
                            width={40}
                            height={40}
                            className="w-[50px] h-[45px] object-cover"
                          />
                        )}
                        <p className="text-sm font-medium">{f.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Description */}
                {product?.description && (
                  <div className="border-y-2 border-black py-4">
                    <h3 className="text-lg font-semibold mb-2 ">DESCRIPTION</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Specifications */}
                {product?.specifications?.length > 0 && (
                  <div className="flex items-center gap-10 flex-wrap">
                    {(product.specifications ?? []).map(
                      (s: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex flex-col items-center text-center"
                        >
                          {s.icon && (
                            <Image
                              src={urlFor(s.icon).url()}
                              alt={s.label || "Product spec icon"}
                              width={30}
                              height={30}
                              className="w-[40px] h-[35px] object-cover"
                            />
                          )}
                          {/* <span className="font-medium">{s.value}</span> */}
                          <span className="text-gray-600 text-sm text-center mt-2">
                            {s.value
                              ? s.value
                                  .split(" ")
                                  .map((word: string, i: number) => (
                                    <React.Fragment key={i}>
                                      {word}
                                      {i === 0 && <br />}
                                    </React.Fragment>
                                  ))
                              : ""}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ---------- Modal for more real images ---------- */}
            <Dialog
              open={showGallery}
              onClose={() => setShowGallery(false)}
              className="relative z-50"
            >
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6">
                <div className="bg-white p-6 rounded-lg max-w-5xl w-full overflow-y-auto">
                  <button
                    onClick={() => setShowGallery(false)}
                    className="mb-4 ml-auto block text-gray-600 hover:text-black"
                  >
                    ✕
                  </button>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {(product.realImages ?? []).map((img: any, idx: number) => (
                      <Image
                        key={idx}
                        src={urlFor(img).url()}
                        alt={`Real photo ${idx + 1}`}
                        width={300}
                        height={300}
                        className="rounded-lg object-cover"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Dialog>
          </div>
          {/* ---------- IN YOUR STORY Section (Videos) ---------- */}
          {product?.realVideos?.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-wide">
                IN YOUR STORY
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {(product.realVideos ?? [])
                  .slice(0, 3)
                  .map((video: any, idx: number) => (
                    <div
                      key={idx}
                      className="relative w-full h-[70vh] aspect-[9/16] bg-black rounded-xl overflow-hidden"
                    >
                      <video
                        src={video?.asset?.url}
                        controls
                        className="w-full h-[70vh] object-cover"
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </Container>
      </div>
    </>
  );
}
