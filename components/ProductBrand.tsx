"use client";
import React, { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { Loader2 } from "lucide-react";

const ProductBrand = ({ slug }: { slug: string | undefined }) => {
  const [brandName, setBrandName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrand = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        const query = `*[_type == "product" && slug.current == $slug]{
"brandName": brand->title
}`;

        const result = await client.fetch(query, { slug });

        if (result[0]?.brandName) {
          setBrandName(result[0]?.brandName);
        }
      } catch (error) {
        console.error("Error fetching brand:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [slug]);

  if (loading) {
    return (
      <span className="flex items-center">
        <Loader2 size={14} className="animate-spin mr-2 text-tech_orange" />
        Loading...
      </span>
    );
  }

  if (!brandName) {
    return <span className="text-gray-400">-</span>;
  }

  return <span className="font-semibold tracking-wide">{brandName}</span>;
};

export default ProductBrand;
