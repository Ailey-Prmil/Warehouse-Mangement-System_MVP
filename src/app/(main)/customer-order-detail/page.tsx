"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
import { AlertCircle, ShoppingCart } from "lucide-react";
import { BackButton } from "@/components/back-button";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define types based on the database schema
interface OrderDetail {
  productId: number;
  quantity: number;
  productName?: string; // Will fetch separately
  price?: number; // Not in DB, will be mocked for display
}

interface OrderTransaction {
  transactionId: number;
  customerOrderId: number;
  transactionTime: string;
  transactionType: string;
  refId?: number | null;
}

interface CustomerOrder {
  customerOrderId: number;
  orderTime: string;
  status: string;
  address: string;
  details?: OrderDetail[];
  transactions?: OrderTransaction[];
}

export default function CustomerOrderDetailPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [transactions, setTransactions] = useState<OrderTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is required");
      setLoading(false);
      return;
    }

    const fetchOrderData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch main order data
        const orderResponse = await fetch(`/api/customer-order`);
        if (!orderResponse.ok) {
          throw new Error("Failed to fetch orders");
        }

        const orders = await orderResponse.json();
        const currentOrder = orders.find(
          (o: CustomerOrder) => String(o.customerOrderId) === String(orderId)
        );

        if (!currentOrder) {
          throw new Error(`Order with ID ${orderId} not found`);
        }

        setOrder(currentOrder);

        // Fetch order details (products)
        try {
          const detailsResponse = await fetch(`/api/customer-order/${orderId}`);
          if (detailsResponse.ok) {
            const detailsData = await detailsResponse.json();

            // Add mock product names and prices for display purposes
            const enhancedDetails = detailsData.details.map(
              (detail: OrderDetail) => ({
                ...detail,
                productName: `Product ${detail.productId}`,
                price: 49.99, // Mock price
              })
            );

            setOrderDetails(enhancedDetails);
          }
        } catch (detailsError) {
          console.error("Error fetching order details:", detailsError);
          // Don't fail the whole page if just details fail
        }

        // Fetch order transactions
        try {
          const transactionsResponse = await fetch(`/api/order-transaction`);
          if (transactionsResponse.ok) {
            const allTransactions = await transactionsResponse.json();
            const orderTransactions = allTransactions.filter(
              (t: OrderTransaction) =>
                String(t.customerOrderId) === String(orderId)
            );
            setTransactions(orderTransactions);
          }
        } catch (transactionsError) {
          console.error("Error fetching transactions:", transactionsError);
          // Don't fail the whole page if just transactions fail
        }
      } catch (err) {
        console.error("Error fetching order data:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching order data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  // Calculate total if we have order details
  const orderTotal = orderDetails.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-2">
          <BackButton href="/customer-order" />
        </div>
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-2">
          <BackButton href="/customer-order" />
        </div>
        <div className="mt-8 text-center">
          <Alert variant="destructive" className="mx-auto max-w-xl">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || "Order not found"}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <BackButton href="/customer-order" />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <ShoppingCart className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              Order {order.customerOrderId}
            </h1>
            <p className="text-muted-foreground">
              Placed on {order.orderTime} •
              <Badge
                className={
                  order.status === "Delivered"
                    ? "ml-2 bg-green-100 text-green-800 hover:bg-green-100"
                    : order.status === "Shipped"
                    ? "ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100"
                    : order.status === "Pick and Pack"
                    ? "ml-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    : "ml-2 bg-orange-100 text-orange-800 hover:bg-orange-100"
                }
              >
                {order.status}
              </Badge>
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {orderDetails.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderDetails.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-sm text-muted-foreground">
                            ID: {item.productId}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price?.toFixed(2) || "0.00"}</TableCell>
                      <TableCell>
                        ${((item.price || 0) * item.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Total
                    </TableCell>
                    <TableCell className="font-bold">
                      ${orderTotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {transactions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Order Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.transactionId}>
                      <TableCell className="font-medium">
                        {transaction.transactionId}
                      </TableCell>
                      <TableCell>{transaction.transactionTime}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            transaction.transactionType === "Ship"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : transaction.transactionType === "Pick and Pack"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                              : transaction.transactionType === "Receive"
                              ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }
                        >
                          {transaction.transactionType}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="font-medium">Order ID:</span>{" "}
              {order.customerOrderId}
            </div>
            <div>
              <span className="font-medium">Order Date:</span> {order.orderTime}
            </div>
            <div>
              <span className="font-medium">Status:</span> {order.status}
            </div>
            <div>
              <span className="font-medium">Shipping Address:</span>{" "}
              {order.address}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
