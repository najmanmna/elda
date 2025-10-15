import React from "react";
import Container from "@/components/Container";
import Title from "@/components/Title";
import AllProductsGrid from "@/components/AllProductsGrid";

const ProductsPage = () => {
  return (
    <Container className="py-10">
     
      <AllProductsGrid />
    </Container>
  );
};

export default ProductsPage;
