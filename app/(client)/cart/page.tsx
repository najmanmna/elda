"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

import { urlFor } from "@/sanity/lib/image";
import useCartStore from "@/store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import EmptyCart from "@/components/EmptyCart";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButtons from "@/components/QuantityButtons";
import { ArrowLeft, ShoppingBag, Trash } from "lucide-react";

const CartPage = () => {
  const items = useCartStore((s) => s.items);
  const deleteCartProduct = useCartStore((s) => s.deleteCartProduct);
  const resetCart = useCartStore((s) => s.resetCart);
  const updateItemVariant = useCartStore((s) => s.updateItemVariant);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleResetCart = () => {
    if (confirm("Are you sure to reset your Cart?")) {
      resetCart();
      toast.success("Cart reset successfully!");
    }
  };

  const handleDelete = (itemKey: string) => {
    deleteCartProduct(itemKey);
    toast.success("Product removed!");
  };

  const handleProceedToCheckout = async () => {
    if (!items.length) return;
    setLoading(true);

    try {
      // Here you would fetch live stock from your backend if needed
      // For now we just proceed to checkout
      router.push("/checkout");
    } finally {
      setLoading(false);
    }
  };

  // Original total before discounts
  const subtotal = items.reduce(
    (acc, it) => acc + (it.product.price ?? 0) * it.quantity,
    0
  );

  // Final total after discounts
  const total = items.reduce((acc, it) => {
    const price = it.product.price ?? 0;
    const discount = ((it.product.discount ?? 0) * price) / 100;

    return acc + (price - discount) * it.quantity;
  }, 0);

  return (
    <>
      {loading && <Loading />}
      <Container className="py-10">
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* LEFT: Cart Items */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="h-5 w-5 text-tech_primary" />
                <h1 className="text-2xl font-semibold">Shopping Cart</h1>
              </div>

              {/* Cart Items List */}
              {items.map(({ product, variant, itemKey, quantity }) => {
                // Handle images safely
                const productImages: any[] =
                  (Array.isArray((product as any)?.images)
                    ? (product as any)?.images
                    : []) ?? [];
                const thumbnail = variant?.images?.[0] ?? productImages?.[0];

                const colorLabel = variant?.color ?? "-";

                // Safe numeric values
                const basePrice =
                  typeof product?.price === "number" ? product.price : 0;
                const discountPercent =
                  typeof product?.discount === "number" ? product.discount : 0;
                const discountedPrice =
                  basePrice - (discountPercent * basePrice) / 100;

                return (
                  <Card
                    key={itemKey}
                    className="flex flex-col md:flex-row items-center md:items-start gap-4 p-4"
                  >
                    {/* Product Image */}
                    {thumbnail && (
                      <Link href={`/product/${product?.slug?.current || ""}`}>
                        <Image
                          src={urlFor(thumbnail).url()}
                          alt={product?.name || "Product image"}
                          width={120}
                          height={120}
                          className="rounded-md object-cover border"
                        />
                      </Link>
                    )}

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col md:flex-row md:justify-between gap-4 w-full">
                      <div className="space-y-1">
                        <Link
                          href={`/product/${product?.slug?.current || ""}`}
                          className="font-semibold hover:text-tech_primary transition-colors"
                        >
                          {product?.name ?? "Unnamed Product"}
                        </Link>
                        <p className="text-sm text-gray-500 capitalize">
                          Color: {colorLabel}
                        </p>

                        {/* Price (discounted + original) */}
                        <div className="text-sm text-gray-500">
                          {discountPercent > 0 ? (
                            <>
                              <span className="text-gray-400 line-through mr-2">
                                <PriceFormatter amount={basePrice} />
                              </span>
                              <PriceFormatter amount={discountedPrice} />
                            </>
                          ) : (
                            <PriceFormatter amount={basePrice} />
                          )}
                        </div>
                      </div>

                      {/* Quantity & Total */}
                      <div className="flex flex-col items-start md:items-end gap-2">
                        <QuantityButtons product={product} itemKey={itemKey} />
                        <p className="font-semibold">
                          Total:{" "}
                          <PriceFormatter amount={discountedPrice * quantity} />
                        </p>
                        <button
                          onClick={() => handleDelete(itemKey)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}

              {/* Cart Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Link href="/shop" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" /> Continue Shopping
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  onClick={handleResetCart}
                  className="flex-1 w-full"
                >
                  Empty Cart
                </Button>
              </div>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="w-full md:w-96">
              <Card className="bg-white shadow-md">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <PriceFormatter amount={subtotal} />
                  </div>
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <PriceFormatter amount={subtotal - total} />
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <PriceFormatter
                      amount={total}
                      className="text-lg text-black"
                    />
                  </div>
                  <Button
                    onClick={handleProceedToCheckout}
                    disabled={loading}
                    className="w-full rounded-md font-semibold tracking-wide mt-4"
                    size="lg"
                  >
                    {loading ? "Processing..." : "Proceed to Checkout"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

export default CartPage;
