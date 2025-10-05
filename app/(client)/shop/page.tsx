import React from "react";
import Container from "@/components/Container";
import Title from "@/components/Title";
import AllProductsGrid from "@/components/AllProductsGrid";

const ProductsPage = () => {
  return (
    <Container className="py-10">
      <Title className="text-3xl font-bold mb-8 text-center">
        All Products
      </Title>
      <AllProductsGrid />
    </Container>
  );
};

export default ProductsPage;
