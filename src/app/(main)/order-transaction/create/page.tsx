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
import { BackButton } from "@/components/back-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface CustomerOrder {
  customerOrderId: number;
  orderTime: string;
  status: string;
  address?: string;
}

export default function CreateOrderTransactionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    customerOrderId: "",
    refId: "",
    transactionType: "",
  });

  // Transaction types based on schema
  const transactionTypes = ["Receive", "Pick and Pack", "Ship"];

  // Fetch customer orders for dropdown
  useEffect(() => {
    async function fetchCustomerOrders() {
      try {
        const response = await fetch("/api/customer-order");
        if (!response.ok) {
          throw new Error("Failed to fetch customer orders");
        }
        const data = await response.json();
        setCustomerOrders(data);
      } catch (err) {
        console.error("Error fetching customer orders:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    }

    fetchCustomerOrders();
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
      // Create a payload with the current datetime for transactionTime
      const payload = {
        customerOrderId: parseInt(formData.customerOrderId),
        refId: parseInt(formData.refId),
        transactionType: formData.transactionType,
        // We'll let the server set the timestamp automatically
      };

      const response = await fetch("/api/order-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to create order transaction"
        );
      }

      // Show success toast
      toast({
        title: "Success",
        description: "Order transaction created successfully",
        variant: "default",
      });

      // Redirect back to the order transactions list
      router.push("/order-transaction");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error creating transaction:", err);

      // Show error toast
      toast({
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "An error occurred creating transaction",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-8">
      <div className="mb-8 w-full max-w-2xl">
        <div className="flex items-center gap-2">
          <BackButton href="/order-transaction" />
        </div>
        <h1 className="mt-4 text-3xl font-bold">Create Order Transaction</h1>
        <p className="text-muted-foreground">Record a new order transaction</p>
      </div>

      {error && (
        <div className="mb-6 w-full max-w-2xl rounded-md bg-red-50 p-4 text-red-600">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerOrderId">Customer Order</Label>{" "}
              <Select
                value={formData.customerOrderId}
                onValueChange={(value) =>
                  handleChange("customerOrderId", value)
                }
                required
              >
                {" "}
                <SelectTrigger id="customerOrderId" className="bg-white">
                  <SelectValue placeholder="Select customer order" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {customerOrders.map((order) => (
                    <SelectItem
                      key={order.customerOrderId}
                      value={String(order.customerOrderId)}
                    >
                      Order #{order.customerOrderId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="refId">Reference ID</Label>
              <Input
                id="refId"
                placeholder="Enter reference ID (Shipment ID or Picklist ID)"
                value={formData.refId}
                onChange={(e) => handleChange("refId", e.target.value)}
                type="number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transactionType">Transaction Type</Label>{" "}
              <Select
                value={formData.transactionType}
                onValueChange={(value) =>
                  handleChange("transactionType", value)
                }
                required
              >
                {" "}
                <SelectTrigger id="transactionType" className="bg-white">
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {transactionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>{" "}
            {/* Transaction date will be automatically set to current time */}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/order-transaction")}
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
