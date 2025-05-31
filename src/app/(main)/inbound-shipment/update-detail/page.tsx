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
import { BackButton } from "@/components/back-button";

export default function UpdateInboundShipmentDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const detailId = searchParams.get("id");

  const [formData, setFormData] = useState({
    detailId: "",
    shipId: "",
    productId: "",
    productName: "",
    receivedQuantity: "",
    poId: "",
    orderedQuantity: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  // Fetch data from API
  useEffect(() => {
    async function fetchDetailData() {
      if (!detailId) return;

      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/inbound-shipment-detail/${detailId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch detail data");
        }

        const data = await response.json();

        setFormData({
          detailId: data.detailId?.toString() || "",
          shipId: data.shipmentId?.toString() || "",
          productId: data.productId?.toString() || "",
          productName: data.productName || "",
          receivedQuantity: data.receivedQuantity?.toString() || "0",
          poId: data.poId?.toString() || "",
          orderedQuantity: data.orderedQuantity?.toString() || "0",
        });
      } catch (err) {
        console.error("Error fetching detail data:", err);
        alert(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDetailData();
  }, [detailId]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Update the detail via API
      const response = await fetch(`/api/inbound-shipment/${formData.shipId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shipmentId: Number(formData.shipId),
          productId: Number(formData.productId),
          receivedQuantity: Number(formData.receivedQuantity),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update shipment detail");
      }

      // Redirect back to the inbound shipment detail page
      router.push(`/inbound-shipment-detail?id=${formData.shipId}`);
    } catch (error) {
      console.error("Error updating shipment detail:", error);
      alert(error instanceof Error ? error.message : "An error occurred");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-8">
      <div className="mb-8 w-full max-w-2xl">
        <div className="flex items-center gap-2">
          <BackButton href={`/inbound-shipment-detail?id=${formData.shipId}`} />
        </div>
        <h1 className="mt-4 text-3xl font-bold">Update Shipment Detail</h1>
        <p className="text-muted-foreground">Edit detail {formData.detailId}</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Detail Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="detailId">Detail ID</Label>
                <Input
                  id="detailId"
                  value={formData.detailId}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipId">Shipment ID</Label>
                <Input
                  id="shipId"
                  value={formData.shipId}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productId">Product ID</Label>
                <Input
                  id="productId"
                  value={formData.productId}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={formData.productName}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="poId">Purchase Order ID</Label>
                <Input
                  id="poId"
                  value={formData.poId}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderedQuantity">Ordered Quantity</Label>
                <Input
                  id="orderedQuantity"
                  value={formData.orderedQuantity}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="receivedQuantity">Received Quantity</Label>
              <Input
                id="receivedQuantity"
                type="number"
                min="0"
                placeholder="Enter received quantity"
                value={formData.receivedQuantity}
                onChange={(e) =>
                  handleChange("receivedQuantity", e.target.value)
                }
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() =>
                router.push(`/inbound-shipment-detail?id=${formData.shipId}`)
              }
            >
              Cancel
            </Button>
            <Button type="submit">Update Detail</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
