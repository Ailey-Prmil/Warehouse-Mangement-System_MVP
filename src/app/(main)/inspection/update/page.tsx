"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Textarea } from "@/components/ui/textarea";
import { BackButton } from "@/components/back-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Stock {
  stockId: number;
  productId: number;
  locId: number;
  quantity: number;
  lastUpdated?: string;
  product?: {
    name: string;
  };
}

export default function UpdateInspectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inspectId = searchParams.get("id");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [formData, setFormData] = useState({
    stockId: "",
    defectQuantity: "",
    reason: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  // Fetch inspection data and available stocks when component mounts
  useEffect(() => {
    if (!inspectId) {
      setError("Inspection ID is required");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch stocks for the dropdown
        const stocksResponse = await fetch("/api/stock");
        if (!stocksResponse.ok) {
          throw new Error("Failed to fetch stocks");
        }
        const stocksData = await stocksResponse.json();
        setStocks(stocksData);

        // Fetch all inspections and find the one we need
        const inspectionsResponse = await fetch("/api/inspection");
        if (!inspectionsResponse.ok) {
          throw new Error(
            `Failed to fetch inspections: ${inspectionsResponse.statusText}`
          );
        }

        const inspections = await inspectionsResponse.json();
        const matchingInspection = inspections.find(
          (i: { inspectId: string | number }) =>
            String(i.inspectId) === String(inspectId)
        );

        if (!matchingInspection) {
          throw new Error(`Inspection with ID ${inspectId} not found`);
        }

        // Initialize form data with found inspection
        setFormData({
          stockId: String(matchingInspection.stockId || ""),
          defectQuantity: String(matchingInspection.defectQuantity || "0"),
          reason: matchingInspection.reason || "",
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [inspectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!inspectId) {
      setError("Inspection ID is required");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        inspectId,
        stockId: parseInt(formData.stockId),
        defectQuantity: parseInt(formData.defectQuantity),
        reason: formData.reason.trim() || null,
      };

      const response = await fetch("/api/inspection", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update inspection");
      }

      // Redirect back to the inspections list on success
      router.push("/inspection");
    } catch (err) {
      console.error("Error updating inspection:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update inspection"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-8">
      {" "}
      <div className="mb-8 w-full max-w-2xl">
        <div className="flex items-center gap-2">
          <BackButton href="/inspection" />
        </div>
        <h1 className="mt-4 text-3xl font-bold">Update Inspection</h1>
        <p className="text-muted-foreground">
          {isLoading
            ? "Loading inspection details..."
            : `Edit inspection #${inspectId}`}
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
            <CardTitle>Inspection Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stockId">Stock</Label>{" "}
              <Select
                value={formData.stockId}
                onValueChange={(value) => handleChange("stockId", value)}
                required
                disabled={isLoading || isSubmitting}
              >
                <SelectTrigger id="stockId" className="bg-white">
                  <SelectValue placeholder="Select stock" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {stocks.map((stock) => (
                    <SelectItem
                      key={stock.stockId}
                      value={stock.stockId.toString()}
                    >
                      Stock #{stock.stockId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defectQuantity">Defect Quantity</Label>
              <Input
                id="defectQuantity"
                type="number"
                min="0"
                placeholder="Enter defect quantity"
                value={formData.defectQuantity}
                onChange={(e) => handleChange("defectQuantity", e.target.value)}
                required
                disabled={isLoading || isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for defects"
                value={formData.reason}
                onChange={(e) => handleChange("reason", e.target.value)}
                rows={4}
                disabled={isLoading || isSubmitting}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/inspection")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>{" "}
            <Button type="submit" disabled={isLoading || isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Inspection"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
