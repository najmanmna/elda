"use client";
import { BRANDS_QUERYResult, Category, Product } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import React, { useEffect, useState } from "react";
import Container from "../Container";
import Title from "../Title";
import CategoryList from "./CategoryList";
import { Loader2, Filter, X } from "lucide-react";
import ProductCard from "../ProductCard";
import NoProductAvailable from "../NoProductAvailable";
import BrandList from "./BrandList";
import { useSearchParams } from "next/navigation";
import PriceList from "./PriceList";

interface Props {
  categories: Category[];
  brands: BRANDS_QUERYResult;
}

const Shop = ({ categories, brands }: Props) => {
  const searchParams = useSearchParams();
  const brandParams = searchParams?.get("brand");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    brandParams || null
  );
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Extract min and max price from selectedPrice
      let minPrice = 0;
      let maxPrice = 10000; // Default high value

      if (selectedPrice) {
        const [min, max] = selectedPrice.split("-").map(Number);
        minPrice = min;
        maxPrice = max;
      }
      const query = `
      *[_type == 'product' 
        && (!defined($selectedCategory) || references(*[_type == "category" && slug.current == $selectedCategory]._id))
        && (!defined($selectedBrand) || references(*[_type == "brand" && slug.current == $selectedBrand]._id))
        && price >= $minPrice && price <= $maxPrice
      ] 
      | order(name asc) {
        ...,"categories": categories[]->title
      }
    `;
      const data = await client.fetch(
        query,
        {
          selectedCategory,
          selectedBrand,
          minPrice,
          maxPrice,
        },
        { next: { revalidate: 0 } }
      );
      setProducts(data);
    } catch (error) {
      console.log("Shop product fetching Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedBrand, selectedPrice]);

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedPrice(null);
  };

  return (
    <div className="border-t">
      <Container className="mt-5">
        <div className="sticky top-0 z-10 mb-5 bg-tech_bg_color py-2">
          <div className="flex flex-col md:flex-row justify-between gap-1 md:gap-0 items-center">
            <Title className="md:text-lg uppercase tracking-wide">
              Get the products as your needs
            </Title>
            <div className="flex items-center gap-3">
              {(selectedCategory !== null ||
                selectedBrand !== null ||
                selectedPrice !== null) && (
                <button
                  onClick={resetFilters}
                  className="text-tech_orange underline text-sm font-medium hover:text-tech_dark_red hoverEffect"
                >
                  Reset Filters
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-1 bg-tech_orange text-white px-3 py-1.5 rounded-md"
              >
                {showFilters ? <X size={16} /> : <Filter size={16} />}
                <span>{showFilters ? "Hide" : "Filters"}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5 border-t border-t-tech_orange/50">
          {/* Mobile filter overlay */}
          <div
            className={`
            fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden
            ${showFilters ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
            onClick={() => setShowFilters(false)}
          />

          {/* Filter sidebar */}
          <div
            className={`
            md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto 
            md:scrollbar-thin md:scrollbar-thumb-tech_orange md:scrollbar-track-gray-100 md:min-w-64 
            pb-5 border-r border-r-tech_orange/50 bg-white
            fixed z-50 md:z-10 left-0 top-0 h-full w-[280px] overflow-y-auto transition-transform duration-300 ease-in-out
            ${showFilters ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
          >
            <div className="md:hidden flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X size={20} />
              </button>
            </div>
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={(category) => {
                setSelectedCategory(category);
                setShowFilters(false);
              }}
            />
            <BrandList
              brands={brands}
              setSelectedBrand={(brand) => {
                setSelectedBrand(brand);
                setShowFilters(false);
              }}
              selectedBrand={selectedBrand}
            />
            <PriceList
              setSelectedPrice={(price) => {
                setSelectedPrice(price);
                setShowFilters(false);
              }}
              selectedPrice={selectedPrice}
            />
          </div>

          {/* Products section */}
          <div className="flex-1 pt-2">
            <div className="h-auto md:h-[calc(100vh-160px)] overflow-y-auto scrollbar-hide">
              {loading ? (
                <div className="p-10 md:p-20 flex flex-col gap-2 items-center justify-center bg-white rounded-md">
                  <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-tech_orange animate-spin" />
                  <p className="font-semibold tracking-wide text-base">
                    Product is loading . . .
                  </p>
                </div>
              ) : products?.length > 0 ? (
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                  {products?.map((product) => (
                    <ProductCard key={product?._id} product={product} />
                  ))}
                </div>
              ) : (
                <NoProductAvailable className="bg-white mt-0 rounded-md h-full" />
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Shop;
