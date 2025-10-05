"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "motion/react";
import { client } from "@/sanity/lib/client";
import NoProductAvailable from "./NoProductAvailable";
import { Loader2 } from "lucide-react";
import Container from "./Container";
import { ALL_PRODUCTS_QUERYResult } from "@/sanity.types";
import Title from "./Title";
import Link from "next/link";

const ProductGrid = () => {
  const [products, setProducts] = useState<ALL_PRODUCTS_QUERYResult>([]);
  const [loading, setLoading] = useState(false);

const query = `*[_type == "product" && isFeatured == true] | order(name asc)[0...10]{
  _id,
  _type,
  _createdAt,
  _updatedAt,
  _rev,
  name,
  slug,
  images[]{
    asset->{
      _ref,
      url
    },
    hotspot,
    crop,
    _type,
    _key
  },
  description,
  price,
  discount,
  "categories": categories[]->title,
  variants[]{
    _key,
    colorName,
    openingStock,
    stockOut,
    "availableStock": openingStock - coalesce(stockOut, 0),
    images[]{
      asset->{url}
    }
  },
  brand->{_ref},
  status,
  variant,
  isFeatured,
  features[]{
    label,
    icon{asset->{_ref}}
  },
  specifications[]{
    value,
    icon{asset->{_ref}}
  },
  realImages[]{asset->{_ref}},
  realVideos[]{asset->{_ref}}
}`;


  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response: ALL_PRODUCTS_QUERYResult = await client.fetch(query);
        setProducts(response);
      } catch (error) {
        console.log("Product fetching Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Container className="flex flex-col mt-10 lg:px-0">
      <div className="text-center">
        <Title className="text-3xl font-bold mb-8">
          Exclusive Bag Collection
        </Title>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10">
          <motion.div className="flex items-center space-x-2 text-black">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Product is loading...</span>
          </motion.div>
        </div>
      ) : products?.length ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-5">
            {products.map((product) => (
              <AnimatePresence key={product?._id}>
                <motion.div
                  layout
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* ✅ use generated type directly */}
                  <ProductCard key={product?._id} product={product} />
                  
                </motion.div>
              </AnimatePresence>
            ))}
          </div>

          {/* Button below the grid */}
          <div className="flex justify-center mt-8">
            <Link href="/shop">
           <button
  className="
    bg-black text-white px-6 py-3 font-semibold border border-black
    transition-all duration-300 ease-in-out
    hover:bg-white hover:text-black
    hover:shadow-[0_0_12px_2px_rgba(0,0,0,0.3)]
    hover:scale-105
  "
>
  CARRY MORE
</button>


            </Link>
          </div>
        </>
      ) : (
        <NoProductAvailable />
      )}
    </Container>
  );
};

export default ProductGrid;
