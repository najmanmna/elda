import { twMerge } from "tailwind-merge";
import PriceFormatter from "./PriceFormatter";
import { cn } from "@/lib/utils";

interface Props {
  price?: number | null;
  discount?: number | null;
  className?: string;
  unitLabel?: string; // ✅ new prop
}

const PriceView = ({ price, discount, className, unitLabel }: Props) => {
  if (!price) return null;

  const hasDiscount = discount && discount > 0;
  const finalPrice = hasDiscount ? price - (discount * price) / 100 : price;

  return (
    <div className="flex flex-col items-center gap-0">
      {/* Original price on top if discounted */}
      {/* {hasDiscount && (
        <PriceFormatter
          amount={price}
          className={twMerge(
            "line-through text-xs text-tech_dark/70",
            className
          )}
        />
      )} */}

      {/* Final price with optional unit label */}
      <div className="flex items-baseline gap-1">
        <PriceFormatter
          amount={finalPrice}
          className={cn("text-tech_orange font-semibold", className)}
        />
        {unitLabel && (
          <span className="text-xs sm:text-sm text-tech_dark/70">
            {unitLabel}
          </span>
        )}
      </div>
    </div>
  );
};

export default PriceView;
