"use client";
import { useState, useEffect } from "react";

interface Props {
  stockAvailable?: number;
  onChange?: (quantity: number) => void;
  isFabric?: boolean; // New prop
}

export default function LocalQuantitySelector({
  stockAvailable = 10,
  onChange,
  isFabric = false,
}: Props) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    onChange?.(quantity);
  }, [quantity, onChange]);

  const increase = () => {
    let newQty = isFabric ? quantity + 0.25 : quantity + 1;
    if (newQty > stockAvailable) newQty = stockAvailable;
    setQuantity(parseFloat(newQty.toFixed(2)));
  };

  const decrease = () => {
    let newQty = isFabric ? quantity - 0.25 : quantity - 1;
    if (newQty < 1) newQty = 1;
    setQuantity(parseFloat(newQty.toFixed(2)));
  };

  return (
    <div className="flex items-center justify-between border rounded-lg px-3 py-2 w-fit bg-white border-gray-300">
      <button
        onClick={decrease}
        className="text-lg font-bold text-gray-700 hover:text-tech_primary"
      >
        −
      </button>
      <span className="px-4 text-base font-medium w-14 text-center">
        {quantity}
      </span>

      <button
        onClick={increase}
        className="text-lg font-bold text-gray-700 hover:text-tech_primary"
      >
        +
      </button>
    </div>
  );
}
