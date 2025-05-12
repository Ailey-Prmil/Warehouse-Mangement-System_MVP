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

// Define interfaces based on the existing APIs
interface Product {
  productId: string;
  name: string;
  sku: string;
  unitOfMeasure: string;
  createdAt: string;
  updatedAt: string;
  category?: string;
  description?: string;
  price?: number;
  stock: number;
}

interface LocationBin {
  locId: string;
  aisle: string;
  section: string;
  shelf: string;
  capacity: number;
  used: number;
  productId?: string; // optional to match existing schema
}

interface Inspection {
  inspectId: string | number;
  stockId: string | number;
  inspectDate: string | null;
  defectQuantity: number;
  reason: string | null;
}

export default function ProductDetailPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const [product, setProduct] = useState<Product | null>(null);
  const [locations, setLocations] = useState<LocationBin[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
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

        // Fetch locations
        const locationsResponse = await fetch("/api/location");
        if (!locationsResponse.ok) {
          throw new Error("Failed to fetch locations");
        }
        const locationsData: LocationBin[] = await locationsResponse.json();

        // Filter locations for this specific product
        const productLocations = locationsData.filter(
          (loc) => loc.productId === productId
        );
        setLocations(productLocations);

        // Fetch inspections
        const inspectionsResponse = await fetch("/api/inspection");
        if (!inspectionsResponse.ok) {
          throw new Error("Failed to fetch inspections");
        }
        const inspectionsData: Inspection[] = await inspectionsResponse.json();

        // Filter inspections for this specific product
        const productInspections = inspectionsData.filter(
          (insp) => insp.stockId === productId
        );
        setInspections(productInspections);
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
              {product.sku} • {product.category || "Uncategorized"}
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
                  Price
                </dt>
                <dd>${product.price?.toFixed(2) || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Created At
                </dt>
                <dd>{product.createdAt}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Updated At
                </dt>
                <dd>{product.updatedAt}</dd>
              </div>
              {product.description && (
                <div className="col-span-2">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Description
                  </dt>
                  <dd>{product.description}</dd>
                </div>
              )}
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
                <div className="mt-1 text-2xl font-bold">{product.stock}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">
                  Locations
                </div>
                <div className="mt-1 text-2xl font-bold">
                  {locations.length}
                </div>
              </div>
              <div className="rounded-lg border p-3">
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
                  {inspections.length > 0
                    ? (
                        (inspections.reduce(
                          (sum, insp) => sum + insp.defectQuantity,
                          0
                        ) /
                          product.stock) *
                        100
                      ).toFixed(1)
                    : "N/A"}
                  %
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {locations.length > 0 && (
        <div className="mt-6 grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Location Bins</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location ID</TableHead>
                    <TableHead>Aisle</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Shelf</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Utilization</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locations.map((location) => (
                    <TableRow key={location.locId}>
                      <TableCell className="font-medium">
                        {location.locId}
                      </TableCell>
                      <TableCell>{location.aisle}</TableCell>
                      <TableCell>{location.section}</TableCell>
                      <TableCell>{location.shelf}</TableCell>
                      <TableCell>{location.capacity}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className={`h-full ${
                                (location.used / location.capacity) * 100 < 50
                                  ? "bg-green-500"
                                  : (location.used / location.capacity) * 100 <
                                    80
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{
                                width: `${
                                  (location.used / location.capacity) * 100
                                }%`,
                              }}
                            />
                          </div>
                          <Badge
                            className={
                              (location.used / location.capacity) * 100 < 50
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : (location.used / location.capacity) * 100 < 80
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                            }
                          >
                            {Math.round(
                              (location.used / location.capacity) * 100
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
                    <TableHead>Date</TableHead>
                    <TableHead>Defect Quantity</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inspections.map((inspection) => (
                    <TableRow key={String(inspection.inspectId)}>
                      <TableCell className="font-medium">
                        {String(inspection.inspectId)}
                      </TableCell>
                      <TableCell>{inspection.inspectDate || "N/A"}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            inspection.defectQuantity === 0
                              ? "bg-green-100 text-green-800"
                              : inspection.defectQuantity < 3
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {inspection.defectQuantity}
                        </Badge>
                      </TableCell>
                      <TableCell>{inspection.reason || "N/A"}</TableCell>
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
