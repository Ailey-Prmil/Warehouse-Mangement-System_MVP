"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { BackButton } from "@/components/back-button";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface TransactionData {
  transactionId: number;
  productId: number;
  productName: string;
  productSku: string;
  locId: number;
  aisle: string;
  section: string;
  shelf: string;
  transactionType: string;
  refId: number | null;
  quantity: number;
  transactionTime: string;
}

export default function UpdateStockTransactionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("id");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [formData, setFormData] = useState({
    productId: "",
    locId: "",
    transactionType: "",
    refId: "",
    quantity: "",
  });

  // Fetch transaction data when component mounts
  useEffect(() => {
    if (!transactionId) {
      setError("Transaction ID is required");
      setIsLoading(false);
      return;
    }

    const fetchTransaction = async () => {
      try {
        const response = await fetch(`/api/stock-transaction/${transactionId}`);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch transaction: ${response.statusText}`
          );
        }
        const data = await response.json();
        setTransaction(data);

        // Initialize form data
        setFormData({
          productId: String(data.productId),
          locId: String(data.locId),
          transactionType: data.transactionType,
          refId: data.refId ? String(data.refId) : "",
          quantity: String(data.quantity),
        });

        // Also fetch products and locations for dropdowns
        const [productsResponse, locationsResponse] = await Promise.all([
          fetch("/api/product"),
          fetch("/api/location"),
        ]);

        if (!productsResponse.ok || !locationsResponse.ok) {
          throw new Error("Failed to fetch products or locations");
        }

        const productsData = await productsResponse.json();
        const locationsData = await locationsResponse.json();

        setProducts(productsData);
        setLocations(locationsData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load transaction data"
        );
        toast.error("Failed to load transaction data");
        setIsLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts changing input
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!transactionId) {
      setError("Transaction ID is required");
      setIsSubmitting(false);
      return;
    }

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

      // Convert values to appropriate types
      const payload = {
        productId: parseInt(formData.productId),
        locId: parseInt(formData.locId),
        transactionType: formData.transactionType,
        refId: formData.refId ? parseInt(formData.refId) : null,
        quantity: parseInt(formData.quantity),
      };

      // Send data to API
      const response = await fetch(`/api/stock-transaction/${transactionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update stock transaction"
        );
      }

      toast.success("Stock transaction updated successfully");
      router.push("/stock-transaction");
    } catch (err) {
      console.error("Error updating transaction:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update transaction";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-8">
      <div className="mb-8 w-full max-w-2xl">
        <div className="flex items-center gap-2">
          <BackButton href="/stock-transaction" />
        </div>
        <h1 className="mt-4 text-3xl font-bold">Update Stock Transaction</h1>
        <p className="text-muted-foreground">
          Edit transaction {transactionId}
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 w-full max-w-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <Card className="w-full max-w-2xl">
          <CardContent className="flex items-center justify-center p-6">
            <p>Loading transaction data...</p>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
              <CardDescription>
                Update the details for this stock transaction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {" "}
                <div className="space-y-2">
                  <Label htmlFor="productId">Product</Label>
                  <Select
                    value={formData.productId}
                    onValueChange={(value) => handleChange("productId", value)}
                    required
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="productId" className="bg-background">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      {products.map((product) => (
                        <SelectItem
                          key={product.productId}
                          value={String(product.productId)}
                        >
                          {product.sku} - {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>{" "}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="locId">Location</Label>
                  <Select
                    value={formData.locId}
                    onValueChange={(value) => handleChange("locId", value)}
                    required
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="locId" className="bg-background">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      {locations.map((location) => (
                        <SelectItem
                          key={location.locId}
                          value={String(location.locId)}
                        >
                          {location.aisle}-{location.section}-{location.shelf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {" "}
                <div className="space-y-2">
                  <Label htmlFor="transactionType">Transaction Type</Label>
                  <Select
                    value={formData.transactionType}
                    onValueChange={(value) =>
                      handleChange("transactionType", value)
                    }
                    required
                    disabled={isSubmitting}
                  >
                    <SelectTrigger
                      id="transactionType"
                      className="bg-background"
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      {["Store", "Pick", "Remove"].map((type) => (
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
                    disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                {isSubmitting ? "Updating..." : "Update Transaction"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  );
}
