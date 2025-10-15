import { twMerge } from "tailwind-merge";
import PriceFormatter from "./PriceFormatter";
import { cn } from "@/lib/utils";

interface Props {
  price?: number | null;
  discount?: number | null;
  className?: string;
  unitLabel?: string;
}

const PriceView = ({ price, discount, className, unitLabel }: Props) => {
  if (!price) return null;

  const hasDiscount = discount && discount > 0;
  const finalPrice = hasDiscount ? price - (discount * price) / 100 : price;

  return (
    <div className="inline-flex items-baseline gap-2 text-sm">
      {/* Original price if discounted */}
      {hasDiscount && (
        <PriceFormatter
          amount={price}
          className={twMerge(
            "line-through text-gray-500",
            className
          )}
        />
      )}

      {/* Final price */}
      <PriceFormatter
        amount={finalPrice}
        className={twMerge("text-tech_orange font-semibold", className)}
      />

      {/* Optional unit label */}
      {unitLabel && (
        <span className="text-xs text-gray-600">{unitLabel}</span>
      )}
    </div>
  );
};

export default PriceView;
