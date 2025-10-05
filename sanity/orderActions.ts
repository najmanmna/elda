// src/sanity/actions/useOrderActions.ts
import { DocumentActionComponent, DocumentActionProps } from "sanity";
import { useClient } from "sanity";

interface OrderItem {
  product?: { _ref: string };
  variant?: { variantKey: string; color?: string };
  quantity?: number;
}

interface OrderDocument {
  _id: string;
  _type: string;
  status?: string;
  items?: OrderItem[];
}

export function useOrderActions(
  originalActions: DocumentActionComponent[]
): DocumentActionComponent[] {
  return originalActions.map((Action) => {
    if (Action && Action.action === "publish") {
      const CustomPublishAction: DocumentActionComponent = (
        props: DocumentActionProps
      ) => {
        const client = useClient({ apiVersion: "2025-01-01" });

        const defaultAction = Action(props);
        if (!defaultAction) return null;

        return {
          ...defaultAction,
          onHandle: async () => {
            const { draft, published } = props;
            const order: OrderDocument = (draft || published) as OrderDocument;

            if (order._type === "order") {
              const oldStatus = published?.status;
              const newStatus = draft?.status;

              // Restore stock only on cancellation
              if (oldStatus !== "cancelled" && newStatus === "cancelled") {
                const tx = client.transaction();

                for (const item of order.items || []) {
                  const productRef = item.product?._ref;
                  const variantKey = item.variant?.variantKey;
                  const quantity = item.quantity;

                  if (!productRef || !variantKey || typeof quantity !== "number") {
                    continue;
                  }

                  // Fetch current stockOut for this variant to prevent negative values
                  const variantStock = await client.fetch<number>(
                    `*[_type=="product" && _id==$id][0].variants[_key==$key].stockOut`,
                    { id: productRef, key: variantKey }
                  );

                  const adjustment = Math.min(quantity, variantStock || 0);

                  if (adjustment > 0) {
                    tx.patch(productRef, (p) =>
                      p.inc({
                        [`variants[_key=="${variantKey}"].stockOut`]: -adjustment,
                      })
                    );
                  }
                }

                await tx.commit();
                console.log("✅ Stock restored safely for cancelled order:", order._id);
              }

              // Prevent reopening cancelled order
              if (oldStatus === "cancelled" && newStatus !== "cancelled") {
                window.alert(
                  "This order has been cancelled and cannot be reopened."
                );
                return; // Stop publish
              }
            }

            // Continue with default publish
            defaultAction.onHandle?.();
          },
        };
      };

      return CustomPublishAction;
    }

    return Action;
  });
}
