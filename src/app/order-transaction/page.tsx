"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Edit, Eye, Search, Trash } from "lucide-react";

// Define the OrderTransaction type to match the database schema
interface OrderTransaction {
  transactionId: string | number; // Allow number in case transactionId is numeric
  customerOrderId: string | number;
  refId: string | null;
  transactionTime: string | null;
  transactionType: string;
}

export default function OrderTransactionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState<OrderTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch order transactions from the API
  useEffect(() => {
    async function fetchOrderTransactions() {
      try {
        setLoading(true);
        const response = await fetch("/api/order-transaction");
        if (!response.ok) {
          throw new Error("Failed to fetch order transactions");
        }
        const data: OrderTransaction[] = await response.json();
        console.log("Fetched data:", data); // Log to inspect the response
        setTransactions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchOrderTransactions();
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    // Convert fields to strings and handle null/undefined
    const transactionId = String(transaction.transactionId || "").toLowerCase();
    const customerOrderId = String(
      transaction.customerOrderId || ""
    ).toLowerCase();
    const refId = String(transaction.refId || "").toLowerCase();
    const transactionType = String(
      transaction.transactionType || ""
    ).toLowerCase();
    const search = searchTerm.toLowerCase();

    return (
      transactionId.includes(search) ||
      customerOrderId.includes(search) ||
      refId.includes(search) ||
      transactionType.includes(search)
    );
  });

  // Handle delete transaction
  const handleDelete = async (transactionId: string | number) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const response = await fetch("/api/order-transaction", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transactionId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete transaction");
      }

      // Update state to remove the deleted transaction
      setTransactions((prev) =>
        prev.filter((t) => t.transactionId !== transactionId)
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div className="container mx-auto py-6 pl-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Transactions</h1>
          <p className="text-muted-foreground">
            Track order status changes and activities
          </p>
        </div>
        <Button asChild>
          <Link href="/order-transaction/create">Create</Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Search Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by transaction ID, order ID, reference, or type..."
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
                  <TableHead className="text-center">Transaction ID</TableHead>
                  <TableHead>Customer Order ID</TableHead>
                  <TableHead>Reference ID</TableHead>
                  <TableHead>Transaction Time</TableHead>
                  <TableHead>Transaction Type</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={String(transaction.transactionId)}>
                      <TableCell className="text-center">
                        {String(transaction.transactionId)}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/customer-order-detail?id=${transaction.customerOrderId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {String(transaction.customerOrderId)}
                        </Link>
                      </TableCell>
                      <TableCell>{transaction.refId || "N/A"}</TableCell>
                      <TableCell>
                        {transaction.transactionTime || "N/A"}
                      </TableCell>
                      <TableCell>{transaction.transactionType}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button asChild size="icon" variant="ghost">
                            <Link
                              href={`/customer-order-detail?id=${transaction.customerOrderId}`}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View Order</span>
                            </Link>
                          </Button>
                          <Button asChild size="icon" variant="ghost">
                            <Link
                              href={`/order-transaction/update?id=${transaction.transactionId}`}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700"
                            onClick={() =>
                              handleDelete(transaction.transactionId)
                            }
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
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
