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
import { BackButton } from "@/components/back-button";
import { useToast } from "@/hooks/use-toast";

interface CustomerOrder {
  customerOrderId: number;
  orderTime: string;
  status: string;
  address?: string;
}

interface OrderTransaction {
  transactionId: number;
  customerOrderId: number;
  refId: number | null;
  transactionTime: string;
  transactionType: string;
}

export default function UpdateOrderTransactionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("id");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  // Fetch transaction data and customer orders when component mounts
  useEffect(() => {
    if (!transactionId) {
      setError("Transaction ID is required");
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setIsLoading(true);

        // Fetch customer orders for dropdown
        const customerOrdersResponse = await fetch("/api/customer-order");
        if (!customerOrdersResponse.ok) {
          throw new Error("Failed to fetch customer orders");
        }
        const customerOrdersData = await customerOrdersResponse.json();
        setCustomerOrders(customerOrdersData);

        // Fetch all transactions and find the one we need
        const transactionsResponse = await fetch("/api/order-transaction");
        if (!transactionsResponse.ok) {
          throw new Error(
            `Failed to fetch transactions: ${transactionsResponse.statusText}`
          );
        }

        const transactions = await transactionsResponse.json();
        const transaction = transactions.find(
          (t: OrderTransaction) => t.transactionId === parseInt(transactionId)
        );

        if (!transaction) {
          throw new Error(`Transaction with ID ${transactionId} not found`);
        } // Initialize form data with found transaction
        setFormData({
          customerOrderId: String(transaction.customerOrderId) || "",
          refId: transaction.refId ? String(transaction.refId) : "",
          transactionType: transaction.transactionType || "",
        });

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
        setIsLoading(false);
      }
    }

    fetchData();
  }, [transactionId]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      const payload = {
        transactionId: Number(transactionId),
        customerOrderId: parseInt(formData.customerOrderId),
        refId: formData.refId ? parseInt(formData.refId) : null,
        transactionType: formData.transactionType,
        // We'll let the server update the timestamp automatically
      };

      const response = await fetch("/api/order-transaction", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update transaction");
      }

      // Show success toast
      toast({
        title: "Success",
        description: "Order transaction updated successfully",
        variant: "default",
      });

      // Redirect back to the transactions list on success
      router.push("/order-transaction");
    } catch (err) {
      console.error("Error updating transaction:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update transaction"
      );

      // Show error toast
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to update transaction",
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
        <h1 className="mt-4 text-3xl font-bold">Update Order Transaction</h1>
        <p className="text-muted-foreground">
          {isLoading
            ? "Loading transaction details..."
            : `Edit transaction ${transactionId}`}
        </p>
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
              <Label htmlFor="customerOrderId">Customer Order</Label>
              <Select
                value={formData.customerOrderId}
                onValueChange={(value) =>
                  handleChange("customerOrderId", value)
                }
                disabled={isLoading}
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
                placeholder="Enter reference ID (numeric)"
                value={formData.refId}
                onChange={(e) => handleChange("refId", e.target.value)}
                disabled={isLoading}
                type="number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transactionType">Transaction Type</Label>
              <Select
                value={formData.transactionType}
                onValueChange={(value) =>
                  handleChange("transactionType", value)
                }
                disabled={isLoading}
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
            {/* Transaction time will be updated automatically */}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/order-transaction")}
              disabled={isSubmitting || isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting ? "Updating..." : "Update Transaction"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
