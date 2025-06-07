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
import { Edit, Eye, Search, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { formatDateForDisplay } from "@/lib/date-utils";

// Define the OrderTransaction type to match the database schema
interface OrderTransaction {
  transactionId: string | number; // Allow number in case transactionId is numeric
  customerOrderId: string | number;
  refId: string | null;
  transactionTime: string | null;
  transactionType: string;
}

// Helper function to format date for display
function formatDateTime(dateString: string | null): string {
  if (!dateString) return "N/A";
  return formatDateForDisplay(dateString) || "N/A";
}

export default function OrderTransactionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState<OrderTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

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
    try {
      setIsDeleting(true);

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

      // Show success toast
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
        variant: "default",
      });
    } catch (err) {
      // Show error toast
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to delete transaction",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
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
                        {String(transaction.customerOrderId)}
                      </TableCell>
                      <TableCell>{transaction.refId || "N/A"}</TableCell>
                      <TableCell>
                        {formatDateTime(transaction.transactionTime)}
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
                              <span className="sr-only">Edit</span>{" "}
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Confirm Deletion
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this order
                                  transaction? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDelete(transaction.transactionId)
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                  disabled={isDeleting}
                                >
                                  {isDeleting ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
