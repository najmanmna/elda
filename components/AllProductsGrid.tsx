"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { client } from "@/sanity/lib/client";
import { Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";
import NoProductAvailable from "./NoProductAvailable";
import { ALL_PRODUCTS_QUERYResult } from "@/sanity.types";

const AllProductsGrid = () => {
  const [products, setProducts] = useState<ALL_PRODUCTS_QUERYResult>([]);
  const [loading, setLoading] = useState(false);

  const query = `*[_type == "product"] | order(name asc){
    _id,
    name,
    slug,
    price,
    discount,
    isFeatured,
    category-> { _id, name, slug },
    subcategory-> { _id, name, slug },
    variants[]{
      _key,
      variantName,
      openingStock,
      stockOut,
      "availableStock": openingStock - coalesce(stockOut, 0),
      images[]{asset->{url}}
    }
  }`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response: any[] = await client.fetch(query);
        setProducts(response);
      } catch (error) {
        console.error("Error fetching all products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 min-h-[20rem] bg-tech_bg_color space-y-4 text-center rounded-lg w-full mt-10">
        <motion.div className="flex items-center space-x-2 text-tech_primary ">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading all products...</span>
        </motion.div>
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return <NoProductAvailable selectedTab="All Products" className="mt-10" />;
  }

  return (
    <div className="px-2 md:px-4 lg:px-6 mt-6">
      <h2 className="text-2xl md:text-3xl font-semibold text-tech_primary mb-4">
        All Products
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <AnimatePresence key={product._id}>
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard product={product} />
            </motion.div>
          </AnimatePresence>
        ))}
      </div>
    </div>
  );
};

export default AllProductsGrid;
