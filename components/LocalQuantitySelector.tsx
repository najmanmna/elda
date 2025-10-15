"use client";
import { useState } from "react";

interface Props {
  stockAvailable?: number;
  onChange?: (quantity: number) => void;
}

export default function LocalQuantitySelector({ stockAvailable = 10, onChange }: Props) {
  const [quantity, setQuantity] = useState(1);

  const increase = () => {
    if (quantity < stockAvailable) {
      const newQty = quantity + 1;
      setQuantity(newQty);
      onChange?.(newQty);
    }
  };

  const decrease = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      onChange?.(newQty);
    }
  };

  return (
    <div className="flex items-center justify-between border rounded-lg px-3 py-2 w-fit bg-white border-gray-300">
      <button
        onClick={decrease}
        className="text-lg font-bold text-gray-700 hover:text-tech_primary"
      >
        −
      </button>
      <span className="px-4 text-base font-medium">{quantity}</span>
      <button
        onClick={increase}
        className="text-lg font-bold text-gray-700 hover:text-tech_primary"
      >
        +
      </button>
    </div>
  );
}
