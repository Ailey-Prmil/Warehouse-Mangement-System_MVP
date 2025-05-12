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
import { Layers } from "lucide-react";
import { BackButton } from "@/components/back-button";

// Define interfaces based on the database schema and API responses
interface LocationBin {
  locId: string;
  aisle: string;
  section: string;
  shelf: string;
  capacity: number;
  used: number;
}

interface Stock {
  stockId: number;
  productId: number;
  locId: number;
  quantity: number;
  lastUpdated: string;
  productName?: string; // Optional, included via API join with Product table
}

export default function LocationBinDetailPage() {
  const searchParams = useSearchParams();
  const locationId = searchParams.get("id");

  const [location, setLocation] = useState<LocationBin | null>(null);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLocationDetails() {
      if (!locationId) {
        setError("No location ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch location details
        const locationResponse = await fetch(`/api/location/${locationId}`);
        if (!locationResponse.ok) {
          throw new Error("Failed to fetch location details");
        }
        const locationData: LocationBin = await locationResponse.json();
        setLocation(locationData);

        // Fetch stock data
        const stockResponse = await fetch("/api/stock");
        if (!stockResponse.ok) {
          throw new Error("Failed to fetch stock data");
        }
        const stockData: Stock[] = await stockResponse.json();

        // Filter stocks for this specific location
        const locationStocks = stockData.filter(
          (stock) => stock.locId === parseInt(locationId)
        );
        setStocks(locationStocks);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchLocationDetails();
  }, [locationId]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="mt-8 text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-2">
          <BackButton href="/location-bin" />
        </div>
        <div className="mt-8 text-center">
          <h1 className="text-2xl font-bold">Location Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            {error || "The location bin you are looking for does not exist."}
          </p>
        </div>
      </div>
    );
  }

  const utilizationPercentage = Math.round(
    (location.used / location.capacity) * 100
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <BackButton href="/location-bin" />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Layers className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Location {location.locId}</h1>
            <p className="text-muted-foreground">
              Aisle {location.aisle} • Section {location.section} • Shelf{" "}
              {location.shelf}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Location Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Location ID
                </dt>
                <dd>{location.locId}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Aisle
                </dt>
                <dd>{location.aisle}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Section
                </dt>
                <dd>{location.section}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Shelf
                </dt>
                <dd>{location.shelf}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Capacity
                </dt>
                <dd>{location.capacity} units</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Used
                </dt>
                <dd>{location.used} units</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-gray-100">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(${
                      utilizationPercentage < 50
                        ? "#22c55e"
                        : utilizationPercentage < 80
                        ? "#eab308"
                        : "#ef4444"
                    } ${utilizationPercentage}%, transparent 0)`,
                    clipPath: "circle(50% at center)",
                  }}
                />
                <div className="relative z-10 flex h-32 w-32 items-center justify-center rounded-full bg-white">
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {utilizationPercentage}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Utilized
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid w-full grid-cols-3 gap-2 text-center">
                <div className="rounded-lg border p-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Capacity
                  </div>
                  <div className="text-xl font-bold">{location.capacity}</div>
                </div>
                <div className="rounded-lg border p-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Used
                  </div>
                  <div className="text-xl font-bold">{location.used}</div>
                </div>
                <div className="rounded-lg border p-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Available
                  </div>
                  <div className="text-xl font-bold">
                    {location.capacity - location.used}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Stored Products</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stock ID</TableHead>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stocks.map((stock) => (
                  <TableRow key={stock.stockId}>
                    <TableCell className="font-medium">
                      {stock.stockId}
                    </TableCell>
                    <TableCell>{stock.productId}</TableCell>
                    <TableCell>
                      {stock.productName || "Unknown Product"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          stock.quantity > 30
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : stock.quantity > 10
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {stock.quantity}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {stocks.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-4 text-muted-foreground"
                    >
                      No products stored in this location
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
