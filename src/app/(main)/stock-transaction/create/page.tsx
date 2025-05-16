"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BackButton } from "@/components/back-button";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Define transaction types based on schema
const transactionTypes = ["Store", "Pick", "Remove"];

interface Product {
  productId: number;
  name: string;
  sku: string;
}

interface Location {
  locId: number;
  aisle: string;
  section: string;
  shelf: string;
}

export default function CreateStockTransactionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingState, setLoadingState] = useState({
    products: true,
    locations: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [formData, setFormData] = useState({
    productId: "",
    locId: "",
    transactionType: "",
    refId: "",
    quantity: "",
  });

  // Fetch products and locations when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setError(null);

      try {
        // Fetch products
        const productsResponse = await fetch("/api/product");
        if (!productsResponse.ok) throw new Error("Failed to fetch products");
        const productsData = await productsResponse.json();
        setProducts(productsData);
        setLoadingState((prev) => ({ ...prev, products: false }));

        // Fetch locations
        const locationsResponse = await fetch("/api/location");
        if (!locationsResponse.ok) throw new Error("Failed to fetch locations");
        const locationsData = await locationsResponse.json();
        setLocations(locationsData);
        setLoadingState((prev) => ({ ...prev, locations: false }));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load form data"
        );
        toast.error("Failed to load form data");
      }
    };

    fetchData();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts changing input
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form data
      if (
        !formData.productId ||
        !formData.locId ||
        !formData.transactionType ||
        !formData.quantity
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Convert quantity to number
      const payload = {
        ...formData,
        productId: parseInt(formData.productId),
        locId: parseInt(formData.locId),
        quantity: parseInt(formData.quantity),
        refId: formData.refId ? parseInt(formData.refId) : null,
      };

      // Send data to the API
      const response = await fetch("/api/stock-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to create stock transaction"
        );
      }

      toast.success("Stock transaction created successfully");
      router.push("/stock-transaction");
    } catch (error) {
      console.error("Error creating transaction:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create stock transaction";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = loadingState.products || loadingState.locations;

  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-8">
      <div className="mb-8 w-full max-w-2xl">
        <div className="flex items-center gap-2">
          <BackButton href="/stock-transaction" />
        </div>
        <h1 className="mt-4 text-3xl font-bold">Create Stock Transaction</h1>
        <p className="text-muted-foreground">
          Record a new stock movement in the warehouse
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 w-full max-w-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
            <CardDescription>
              Enter the details for the new stock transaction
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                {" "}
                <Label htmlFor="productId">Product</Label>
                <Select
                  value={formData.productId}
                  onValueChange={(value) => handleChange("productId", value)}
                  required
                  disabled={isLoading || isSubmitting}
                >
                  <SelectTrigger id="productId" className="bg-background">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {products.length > 0 ? (
                      products.map((product) => (
                        <SelectItem
                          key={product.productId}
                          value={String(product.productId)}
                        >
                          {product.sku} - {product.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="loading">
                        Loading products...
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                {" "}
                <Label htmlFor="locId">Location</Label>
                <Select
                  value={formData.locId}
                  onValueChange={(value) => handleChange("locId", value)}
                  required
                  disabled={isLoading || isSubmitting}
                >
                  <SelectTrigger id="locId" className="bg-background">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {locations.length > 0 ? (
                      locations.map((location) => (
                        <SelectItem
                          key={location.locId}
                          value={String(location.locId)}
                        >
                          {location.aisle}-{location.section}-{location.shelf}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="loading">
                        Loading locations...
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                {" "}
                <Label htmlFor="transactionType">Transaction Type</Label>
                <Select
                  value={formData.transactionType}
                  onValueChange={(value) =>
                    handleChange("transactionType", value)
                  }
                  required
                  disabled={isLoading || isSubmitting}
                >
                  <SelectTrigger id="transactionType" className="bg-background">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {transactionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="refId">Reference ID (Optional)</Label>
                <Input
                  id="refId"
                  placeholder="e.g., PO ID or Order ID"
                  value={formData.refId}
                  onChange={(e) => handleChange("refId", e.target.value)}
                  disabled={isLoading || isSubmitting}
                  type="number"
                  min="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                step="1"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
                required
                disabled={isLoading || isSubmitting}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/stock-transaction")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Transaction"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
