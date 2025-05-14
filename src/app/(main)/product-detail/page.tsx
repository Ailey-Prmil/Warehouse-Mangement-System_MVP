"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { BackButton } from "@/components/back-button";

// Define interfaces based on the provided specifications
interface Product {
  productId: string;
  name: string;
  sku: string;
  unitOfMeasure: string;
  createdAt: string;
  updatedAt: string;
}

interface LocationBin {
  locId: string;
  aisle: string;
  section: string;
  shelf: string;
  capacity: number;
}

interface Stock {
  stockId: string;
  productId: string;
  locId: string;
  quantity: number;
  lastUpdated: string;
}

interface Inspection {
  inspectId: string;
  stockId: string;
  inspectDate: string | null;
  defectQuantity: number;
  reason: string | null;
}

// Combined structure for inspections with stock information
interface InspectionWithStock {
  inspection: Inspection;
  stock: {
    stockId: string;
    productId: string;
    quantity: number;
    locId?: string;
  };
}

// Define combined data structure for locations with stock
interface StockWithLocation {
  stock: Stock;
  location: LocationBin;
}

export default function ProductDetailPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const [product, setProduct] = useState<Product | null>(null);
  const [stockLocations, setStockLocations] = useState<StockWithLocation[]>([]);
  const [inspections, setInspections] = useState<InspectionWithStock[]>([]);
  const [totalStock, setTotalStock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductDetails() {
      if (!productId) {
        setError("No product ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch product details
        const productResponse = await fetch(`/api/product/${productId}`);
        if (!productResponse.ok) {
          throw new Error("Failed to fetch product details");
        }
        const productData: Product = await productResponse.json();
        setProduct(productData);

        // Fetch stock data for this product, including location details
        const stockResponse = await fetch(`/api/stock/${productId}`);
        if (!stockResponse.ok) {
          throw new Error("Failed to fetch stock data");
        }
        const stockData: StockWithLocation[] = await stockResponse.json();
        setStockLocations(stockData);

        // Calculate total stock from all locations
        const total = stockData.reduce(
          (sum, item) => sum + item.stock.quantity,
          0
        );
        setTotalStock(total);

        // Fetch inspections directly by product ID
        // const inspectionsResponse = await fetch(`/api/inspection/${productId}`);

        // if (!inspectionsResponse.ok) {
        //   throw new Error("Failed to fetch inspections");
        // }

        // const inspectionsData: InspectionWithStock[] =
        //   await inspectionsResponse.json();
        // setInspections(inspectionsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return (
      <div className="container mx-auto">
        <div className="mt-8 text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto">
        <div className="flex items-center gap-2">
          <BackButton href="/product" />
        </div>
        <div className="mt-8 text-center">
          <h1 className="text-2xl font-bold">Product Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            {error || "The product you are looking for does not exist."}
          </p>
        </div>
      </div>
    );
  }

  // Calculate defect rate
  const totalDefects = inspections.reduce(
    (sum, item) => sum + item.inspection.defectQuantity,
    0
  );
  const defectRate = totalStock > 0 ? (totalDefects / totalStock) * 100 : 0;

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <BackButton href="/product" />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Package className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">
              {product.sku} • {product.unitOfMeasure}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Product ID
                </dt>
                <dd>{product.productId}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  SKU
                </dt>
                <dd>{product.sku}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Unit of Measure
                </dt>
                <dd>{product.unitOfMeasure}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Created At
                </dt>
                <dd>{new Date(product.createdAt).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Updated At
                </dt>
                <dd>{new Date(product.updatedAt).toLocaleString()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">
                  Total Stock
                </div>
                <div className="mt-1 text-2xl font-bold">{totalStock}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">
                  Locations
                </div>
                <div className="mt-1 text-2xl font-bold">
                  {stockLocations.length}
                </div>
              </div>
              {/* <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">
                  Inspections
                </div>
                <div className="mt-1 text-2xl font-bold">
                  {inspections.length}
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">
                  Defect Rate
                </div>
                <div className="mt-1 text-2xl font-bold">
                  {totalStock > 0 ? defectRate.toFixed(1) : "N/A"}%
                </div>
              </div> */}
            </div>
          </CardContent>
        </Card>
      </div>

      {stockLocations.length > 0 && (
        <div className="mt-6 grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Location Bins</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stock ID</TableHead>
                    <TableHead>Location ID</TableHead>
                    <TableHead>Aisle</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Shelf</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Utilization</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockLocations.map((item) => (
                    <TableRow key={item.stock.stockId}>
                      <TableCell className="font-medium">
                        {item.stock.stockId}
                      </TableCell>
                      <TableCell>{item.location.locId}</TableCell>
                      <TableCell>{item.location.aisle}</TableCell>
                      <TableCell>{item.location.section}</TableCell>
                      <TableCell>{item.location.shelf}</TableCell>
                      <TableCell>{item.stock.quantity}</TableCell>
                      <TableCell>
                        {new Date(item.stock.lastUpdated).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className={`h-full ${
                                (item.stock.quantity / item.location.capacity) *
                                  100 <
                                50
                                  ? "bg-green-500"
                                  : (item.stock.quantity /
                                      item.location.capacity) *
                                      100 <
                                    80
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{
                                width: `${
                                  (item.stock.quantity /
                                    item.location.capacity) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                          <Badge
                            className={
                              (item.stock.quantity / item.location.capacity) *
                                100 <
                              50
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : (item.stock.quantity /
                                    item.location.capacity) *
                                    100 <
                                  80
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                            }
                          >
                            {Math.round(
                              (item.stock.quantity / item.location.capacity) *
                                100
                            )}
                            %
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {inspections.length > 0 && (
        <div className="mt-6 grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Inspection History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Inspection ID</TableHead>
                    <TableHead>Stock ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Defect Quantity</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inspections.map((item) => (
                    <TableRow key={String(item.inspection.inspectId)}>
                      <TableCell className="font-medium">
                        {String(item.inspection.inspectId)}
                      </TableCell>
                      <TableCell>{String(item.inspection.stockId)}</TableCell>
                      <TableCell>
                        {item.inspection.inspectDate
                          ? new Date(
                              item.inspection.inspectDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            item.inspection.defectQuantity === 0
                              ? "bg-green-100 text-green-800"
                              : item.inspection.defectQuantity < 3
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {item.inspection.defectQuantity}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.inspection.reason || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
