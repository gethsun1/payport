import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/state";
import { formatUsd } from "@/lib/format/money";
import type { Product } from "@/types/api";

export function ProductTable({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <EmptyState title="No products yet" message="Add a product to create checkout invoices faster." />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-muted-foreground">
            <tr>
              <th className="py-2 font-medium">Name</th>
              <th className="py-2 font-medium">Price</th>
              <th className="py-2 font-medium">Unlock</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="py-3 font-medium">{product.name}</td>
                <td className="py-3">{formatUsd(product.priceUsd)}</td>
                <td className="py-3">{product.unlockType}</td>
                <td className="py-3">{product.active ? "Active" : "Inactive"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
