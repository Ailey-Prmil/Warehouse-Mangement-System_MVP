"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { BackButton } from "@/components/back-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function CreateInspectionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [formData, setFormData] = useState({
    stockId: "",
    defectQuantity: "0",
    reason: "",
  });

  // Fetch available stocks for the dropdown
  useEffect(() => {
    async function fetchStocks() {
      try {
        const response = await fetch("/api/stock");
        if (!response.ok) {
          throw new Error("Failed to fetch stocks");
        }
        const data = await response.json();
        setStocks(data);
      } catch (err) {
        console.error("Error fetching stocks:", err);
        setError(err instanceof Error ? err.message : "Failed to load stocks");
      }
    }

    fetchStocks();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        stockId: parseInt(formData.stockId),
        defectQuantity: parseInt(formData.defectQuantity),
        reason: formData.reason.trim() || null,
      };

      const response = await fetch("/api/inspection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create inspection");
      }

      // Redirect back to the inspections list
      router.push("/inspection");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-8">
      <div className="mb-8 w-full max-w-2xl">
        <div className="flex items-center gap-2">
          <BackButton href="/inspection" />
        </div>
        <h1 className="mt-4 text-3xl font-bold">Create Inspection</h1>
        <p className="text-muted-foreground">
          Record a new quality control inspection
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
              >
                <SelectTrigger id="stockId" className="bg-white">
                  <SelectValue placeholder="Select a stock" />
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Inspection"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
