import Container from "@/components/Container";
import CategoryProducts from "@/components/CategoryProducts";
import Title from "@/components/Title";
import { getCategories } from "@/sanity/queries";
import React from "react";

const CategoryPage = async ({
  params,
}: {
  params: { slug: string }; // <-- ❌ remove Promise here
}) => {
  const { slug } = params; // <-- no need for await
  const categories = await getCategories();

  return (
    <div>
      <Container className="py-0">
        {/* <Title className="text-xl">
          Products by Category:{" "}
          <span className="font-bold text-green-600 capitalize tracking-wide">
            {slug}
          </span>
        </Title> */}

        <CategoryProducts categories={categories} slug={slug} />
      </Container>
    </div>
  );
};

export default CategoryPage;
