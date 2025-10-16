"use client";
import { Category, Product, ALL_PRODUCTS_QUERYResult } from "@/sanity.types";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";
import NoProductAvailable from "./NoProductAvailable";
import { useRouter } from "next/navigation";

interface CategoryWithSubs extends Category {
  subcategories?: {
    _id: string;
    name: string;
    slug: { current: string };
  }[];
}

interface Props {
  categories: CategoryWithSubs[];
  slug: string;
}

const mapProductToCardType = (
  product: any
): ALL_PRODUCTS_QUERYResult[number] => {
  const categoryObj = product.category as
    | { _id: string; name: string; slug: any }
    | undefined;
  const subcategoryObj = product.subcategory as
    | { _id: string; name: string; slug: any }
    | undefined;

  return {
    _id: product._id,
    name: product.name ?? null,
    slug: product.slug ?? null,
    price: product.price ?? null,
    discount: product.discount ?? null,
    isFeatured: product.isFeatured ?? null,
    category: categoryObj
      ? {
          _id: categoryObj._id,
          name: categoryObj.name ?? null,
          slug: categoryObj.slug ?? null,
        }
      : null,
    subcategory: subcategoryObj
      ? {
          _id: subcategoryObj._id,
          name: subcategoryObj.name ?? null,
          slug: subcategoryObj.slug ?? null,
        }
      : null,
    variants:
      product.variants?.map((v: any) => ({
        _key: v._key,
        variantName: v.variantName ?? null,
        openingStock: v.openingStock ?? null,
        stockOut: v.stockOut ?? null,
        availableStock:
          v.availableStock ?? (v.openingStock ?? 0) - (v.stockOut ?? 0),
        images:
          v.images?.map((img: any) => ({
            asset: { url: img.asset?.url ?? null },
          })) ?? null,
      })) ?? null,
  };
};

const CategoryProducts = ({ categories, slug }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState(slug);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );
  const [products, setProducts] = useState<ALL_PRODUCTS_QUERYResult>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchProducts = async (
    categorySlug: string,
    subcategorySlug?: string | null
  ) => {
    try {
      setLoading(true);
      const query = `
        *[_type == 'product' 
          && references(*[_type == "category" && slug.current == $categorySlug]._id)
          ${subcategorySlug ? `&& references(*[_type=="category" && slug.current == $subcategorySlug]._id)` : ""}
        ] | order(name asc){
          _id,
          name,
          slug,
          price,
          discount,
          isFeatured,
          category-> { _id, name, slug },
          subcategory-> { _id, name, slug },
          variants[]{ _key, variantName, openingStock, stockOut, "availableStock": openingStock - coalesce(stockOut, 0), images[]{ asset->{ url } } }
        }
      `;
      const data: any[] = await client.fetch(query, {
        categorySlug,
        subcategorySlug,
      });
      setProducts(data.map(mapProductToCardType));
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(selectedCategory, selectedSubcategory);
  }, [selectedCategory, selectedSubcategory]);

  const currentCategoryObj = categories.find(
    (cat) => cat.slug?.current === selectedCategory
  );
  const subcategories = currentCategoryObj?.subcategories || [];

  return (
    <div className="py-5">
      {/* Categories Horizontal Scroll */}
      {/* Main Categories - Horizontal Scroll */}
      {/* Categories Tab Bar */}
      <div className="flex overflow-scroll sm:overflow-auto sm:justify-end items-start gap-6">
        <div className="flex flex-col sm:items-end gap-2 mb-4">
          {/* Main Categories */}
          <div className="flex gap-3 border-b border-gray-300">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => {
                  setSelectedCategory(cat.slug?.current || "");
                  setSelectedSubcategory(null);
                  router.push(`/category/${cat.slug?.current}`, {
                    scroll: false,
                  });
                }}
                className={`relative px-4 py-2 font-semibold whitespace-nowrap transition-all duration-200
            ${
              cat.slug?.current === selectedCategory
                ? "text-white bg-tech_primary rounded-t-lg shadow-md"
                : "text-gray-700 hover:text-tech_primary"
            }`}
              >
                {cat.name}
                {cat.slug?.current === selectedCategory && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-tech_gold rounded-t-full"></span>
                )}
              </button>
            ))}
          </div>

          {/* Subcategories */}
          {subcategories.length > 0 && (
            <div className="flex gap-3 border-b border-gray-200">
              {subcategories.map((sub) => (
                <button
                  key={sub._id}
                  onClick={() => setSelectedSubcategory(sub.slug.current)}
                  className={`relative px-3 py-1 text-sm font-medium transition-all duration-200
              ${
                sub.slug.current === selectedSubcategory
                  ? "text-white bg-tech_gold rounded-t-lg shadow-md"
                  : "text-gray-700 hover:text-tech_gold"
              }`}
                >
                  {sub.name}
                  {sub.slug.current === selectedSubcategory && (
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-tech_primary rounded-t-full"></span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full">
          <motion.div className="flex items-center space-x-2 text-tech_blue">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading products...</span>
          </motion.div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <AnimatePresence key={product._id}>
              <motion.div
                layout
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hover:scale-105 transition-transform duration-200"
              >
                <ProductCard product={product} />
              </motion.div>
            </AnimatePresence>
          ))}
        </div>
      ) : (
        <NoProductAvailable
          selectedTab={selectedSubcategory || selectedCategory}
          className="mt-0 w-full"
        />
      )}
    </div>
  );
};

export default CategoryProducts;
