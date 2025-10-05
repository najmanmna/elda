"use client";
import useCartStore from "@/store";
import { Check, Home, ShoppingBag, Copy } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderNumber = searchParams.get("orderNumber");
  const paymentMethod = searchParams.get("payment") || "Cash on Delivery";
  const total = searchParams.get("total"); // ✅ fetch total from query

  const resetCart = useCartStore((state) => state.resetCart);
  const [validAccess, setValidAccess] = useState(false);

  useEffect(() => {
    // ✅ Check both session + query params
    const placed = sessionStorage.getItem("orderPlaced");
    if (!orderNumber || !paymentMethod || !placed) {
      router.replace("/"); // 🚫 Kick user out if bypassing
      return;
    }

    setValidAccess(true);
    resetCart();

    // one-time use flag
    const handleUnload = () => {
      sessionStorage.removeItem("orderPlaced");
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [orderNumber, paymentMethod, router, resetCart]);

  if (!validAccess) return null; // don't render until verified

  // ✅ Bank details text
  const bankDetails = `M.J.M IFHAM
0110290723001
Amana Bank Dehiwala`;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <Check className="text-white w-10 h-10" />
          </motion.div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Thank you for your purchase. We’re processing your order and will
            ship it soon.
          </p>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-6 mt-8 border border-gray-100 text-left">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            <div className="space-y-4 text-sm sm:text-base">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-2 border-b border-gray-200">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-medium break-all">{orderNumber}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">Rs. {total || "N/A"}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <span className="text-gray-600">Estimated Delivery:</span>
                <span className="font-medium">3–5 working days</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">{paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* ✅ Show bank details only if Bank Transfer chosen */}
          {paymentMethod.toLowerCase().includes("bank") && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-6 text-left">
              <h3 className="font-semibold text-lg mb-3 text-yellow-800">
                Bank Transfer Instructions
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Please transfer <span className="font-medium">Rs. {total}</span>{" "}
                using your{" "}
                <span className="font-medium">Order Number {orderNumber}</span>{" "}
                as the payment reference. Your order will be processed once we
                confirm the payment.
              </p>

              <p className="font-medium mb-2">Bank Transfer Details:</p>
              <div className="bg-white border rounded px-3 py-2 text-sm flex justify-between items-start">
                <div className="flex-1 whitespace-pre-wrap font-mono">
                  {bankDetails}
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(bankDetails);
                    toast.success("Bank details copied!");
                  }}
                  className="ml-3 px-2 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <Link
              href="/"
              className="flex items-center justify-center px-4 py-3 font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
            <Link
              href="/shop"
              className="flex items-center justify-center px-4 py-3 font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessPage;
