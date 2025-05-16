"use client";

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
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { BackButton } from "@/components/back-button";

export default function UpdateCustomerOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    status: "",
  });

  // Valid order statuses based on schema
  const orderStatuses = ["Pending", "Pick and Pack", "Shipped"];

  // Fetch order data when component mounts
  useEffect(() => {
    if (!orderId) {
      setError("Order ID is required");
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setIsLoading(true);

        // First try to fetch from the specific order API endpoint
        const response = await fetch(`/api/customer-order/${orderId}`);

        // If that fails, try fetching from the list and find the specific order
        if (!response.ok) {
          const ordersResponse = await fetch("/api/customer-order");
          if (!ordersResponse.ok) {
            throw new Error(
              `Failed to fetch orders: ${ordersResponse.statusText}`
            );
          }
          const orders = await ordersResponse.json();
          const matchingOrder = orders.find(
            (o: { customerOrderId: string | number }) =>
              String(o.customerOrderId) === String(orderId)
          );

          if (!matchingOrder) {
            throw new Error(`Order with ID ${orderId} not found`);
          }

          // Initialize form data with found order
          setFormData({
            status: matchingOrder.status,
          });

          setIsLoading(false);
          return;
        }

        // If the specific endpoint worked, use that data
        const data = await response.json();

        // Initialize form data with fetched order details
        setFormData({
          status: data.status,
        });

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load order data"
        );
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts changing input
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!orderId) {
      setError("Order ID is required");
      setIsSubmitting(false);
      return;
    }

    try {
      // Validate form data
      if (!formData.status) {
        throw new Error("Please select an order status");
      }

      // As per the API comment: only update the status of the order, not the orderId or address
      const payload = {
        orderId: orderId,
        newStatus: formData.status,
      };

      // Send data to API
      const response = await fetch(`/api/customer-order`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update order status");
      }

      // Redirect back to the orders list on success
      router.push("/customer-order");
    } catch (err) {
      console.error("Error updating order:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update order";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-8">
      <div className="mb-8 w-full max-w-2xl">
        <div className="flex items-center gap-2">
          <BackButton href="/customer-order" />
        </div>
        <h1 className="mt-4 text-3xl font-bold">Update Order Status</h1>
        <p className="text-muted-foreground">
          Update status for order {orderId}
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
            <p>Loading order data...</p>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orderId">Order ID</Label>
                <div className="rounded-md border border-input bg-muted px-3 py-2 text-sm shadow-sm">
                  {orderId}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={isSubmitting}
                >
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/customer-order")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Status"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  );
}
