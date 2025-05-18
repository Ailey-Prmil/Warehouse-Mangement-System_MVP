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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function UpdateOutboundShipmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shipmentId = searchParams.get("id");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    carrier: "",
    trackingNumber: "",
    shipmentTime: "",
  });

  // Fetch shipment data when component mounts
  useEffect(() => {
    if (!shipmentId) {
      setError("Shipment ID is required");
      setIsLoading(false);
      return;
    }

    const fetchShipment = async () => {
      try {
        setIsLoading(true);

        // Fetch all shipments and find the one we need
        const response = await fetch("/api/outbound-shipment");
        if (!response.ok) {
          throw new Error(`Failed to fetch shipments: ${response.statusText}`);
        }

        const shipments = await response.json();
        const matchingShipment = shipments.find(
          (s: { shipmentId: string | number }) =>
            String(s.shipmentId) === String(shipmentId)
        );

        if (!matchingShipment) {
          throw new Error(`Shipment with ID ${shipmentId} not found`);
        }

        // Initialize form data with found shipment
        setFormData({
          carrier: matchingShipment.carrier || "",
          trackingNumber: matchingShipment.trackingNumber || "",
          shipmentTime: matchingShipment.shipmentTime
            ? new Date(matchingShipment.shipmentTime)
                .toISOString()
                .split("T")[0]
            : "",
        });

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching shipment:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load shipment data"
        );
        setIsLoading(false);
      }
    };

    fetchShipment();
  }, [shipmentId]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts changing input
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!shipmentId) {
      setError("Shipment ID is required");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        shipmentId,
        shipmentTime: formData.shipmentTime,
        carrier: formData.carrier,
        trackingNumber: formData.trackingNumber,
      };

      const response = await fetch("/api/outbound-shipment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update shipment");
      }

      // Redirect back to the shipments list on success
      router.push("/outbound-shipment");
    } catch (err) {
      console.error("Error updating shipment:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update shipment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-8">
      <div className="mb-8 w-full max-w-2xl">
        <div className="flex items-center gap-2">
          <BackButton href="/outbound-shipment" />
        </div>
        <h1 className="mt-4 text-3xl font-bold">Update Outbound Shipment</h1>
        <p className="text-muted-foreground">
          {isLoading
            ? "Loading shipment details..."
            : `Edit shipment ${shipmentId}`}
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
            <CardTitle>Shipment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="carrier">Carrier</Label>
              <Input
                id="carrier"
                value={formData.carrier}
                onChange={(e) => handleChange("carrier", e.target.value)}
                placeholder="Enter carrier name"
                required
                disabled={isSubmitting || isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trackingNumber">Tracking Number</Label>
              <Input
                id="trackingNumber"
                placeholder="Enter tracking number"
                value={formData.trackingNumber}
                onChange={(e) => handleChange("trackingNumber", e.target.value)}
                required
                disabled={isSubmitting || isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shipmentTime">Shipment Date</Label>
              <Input
                id="shipmentTime"
                type="date"
                value={formData.shipmentTime}
                onChange={(e) => handleChange("shipmentTime", e.target.value)}
                required
                disabled={isSubmitting || isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/outbound-shipment")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting ? "Updating..." : "Update Shipment"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
