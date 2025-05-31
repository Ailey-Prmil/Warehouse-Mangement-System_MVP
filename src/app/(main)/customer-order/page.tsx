"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Search, Edit } from "lucide-react";

// Define the CustomerOrder type to match the database schema
interface CustomerOrder {
  customerOrderId: string | number; // Allow number in case customerOrderId is numeric
  orderTime: string; // Changed from orderDate to match the actual field name in schema
  address: string;
  status: string;
}

export default function CustomerOrderPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch customer orders from the API
  useEffect(() => {
    async function fetchCustomerOrders() {
      try {
        setLoading(true);
        const response = await fetch("/api/customer-order");
        if (!response.ok) {
          throw new Error("Failed to fetch customer orders");
        }
        const data: CustomerOrder[] = await response.json();
        console.log("Fetched data:", data); // Log to inspect the response
        setCustomerOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchCustomerOrders();
  }, []);

  const filteredOrders = customerOrders.filter((order) => {
    // Convert fields to strings and handle null/undefined
    const customerOrderId = String(order.customerOrderId || "").toLowerCase();
    const address = String(order.address || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    return customerOrderId.includes(search) || address.includes(search);
  });

  return (
    <div className="container mx-auto py-6 pl-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Orders</h1>
          <p className="text-muted-foreground">
            View and manage customer orders
          </p>
        </div>
        <Button asChild>
          <Link href="/customer-order/create">Create</Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Order Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by order ID or address..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-600">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Order ID</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  {/* <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead> */}
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No customer orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={String(order.customerOrderId)}>
                      <TableCell className="text-center">
                        {String(order.customerOrderId)}
                      </TableCell>
                      <TableCell>{order.orderTime}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {order.address}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                              : order.status === "Processing"
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              : "bg-orange-100 text-orange-800 hover:bg-orange-100"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      {/* <TableCell>{order.items}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell> */}
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button asChild size="icon" variant="ghost">
                            <Link
                              href={`/customer-order-detail?id=${order.customerOrderId}`}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                          <Button asChild size="icon" variant="ghost">
                            <Link
                              href={`/customer-order/update?id=${order.customerOrderId}`}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
