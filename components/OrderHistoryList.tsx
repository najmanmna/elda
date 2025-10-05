"use client";
import React, { useState } from "react";
import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import { format } from "date-fns";
import PriceFormatter from "./PriceFormatter";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const OrderHistoryList = ({ orders }: { orders: MY_ORDERS_QUERYResult }) => {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const toggleOrderExpand = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order._id} className="border rounded-md overflow-hidden">
          {/* Order Header */}
          <div
            className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer"
            onClick={() => toggleOrderExpand(order._id)}
          >
            <div className="space-y-1 mb-2 sm:mb-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Order ID:</span>
                <span className="text-gray-700">
                  {order.orderNumber?.slice(-10)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Date:</span>
                <span className="text-gray-700">
                  {order.orderDate &&
                    format(new Date(order.orderDate), "dd MMM yyyy")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex sm:flex-col gap-1 sm:gap-0 md:items-end">
                <span className="font-semibold">Total:</span>
                <PriceFormatter
                  amount={order.totalPrice}
                  className="font-bold"
                />
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order?.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order?.status &&
                    order?.status?.charAt(0).toUpperCase() +
                      order?.status?.slice(1)}
                </span>
                {expandedOrder === order._id ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </div>
            </div>
          </div>

          {/* Order Details (Expanded) */}
          {expandedOrder === order._id && (
            <div className="p-4 bg-white">
              <h3 className="font-medium mb-3">Products</h3>
              <div className="space-y-4">
                {order.products?.map((product, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4"
                  >
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                      {product?.product?.images && (
                        <Image
                          src={urlFor(product.product.images[0]).url()}
                          alt={product?.product?.name || "Product"}
                          width={60}
                          height={60}
                          className="border rounded-md object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{product?.product?.name}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {product?.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <PriceFormatter
                        amount={product?.product?.price}
                        className="font-semibold"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {order?.invoice?.hosted_invoice_url && (
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="text-sm"
                  >
                    <Link
                      href={order.invoice.hosted_invoice_url}
                      target="_blank"
                    >
                      Download Invoice
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderHistoryList;
