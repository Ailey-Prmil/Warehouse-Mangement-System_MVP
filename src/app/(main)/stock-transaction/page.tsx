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
import { Edit, Search, Trash2 } from "lucide-react";
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

// Define the StockTransaction type to match the database schema
interface StockTransaction {
  transactionId: string | number;
  productId: string;
  productName: string;
  locId: string;
  transactionType: string;
  refId: string | null;
  quantity: number;
  transactionDate: string;
}

export default function StockTransactionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stockTransactions, setStockTransactions] = useState<
    StockTransaction[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  // Fetch stock transactions from the API
  useEffect(() => {
    fetchStockTransactions();
  }, []);

  async function fetchStockTransactions() {
    try {
      setLoading(true);
      const response = await fetch("/api/stock-transaction");
      if (!response.ok) {
        throw new Error("Failed to fetch stock transactions");
      }
      const data: StockTransaction[] = await response.json();
      setStockTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  // Delete a stock transaction
  async function handleDelete(id: string | number) {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/stock-transaction/${id}`, {
        method: "DELETE",
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to delete transaction");
      }

      // Show success toast
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
        variant: "default",
      });

      // Refresh the data
      fetchStockTransactions();
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
      setTransactionToDelete(null);
    }
  }

  const filteredTransactions = stockTransactions.filter((transaction) => {
    // Convert fields to strings and handle null/undefined
    const transactionId = String(transaction.transactionId || "").toLowerCase();
    const productId = String(transaction.productId || "").toLowerCase();
    const productName = String(transaction.productName || "").toLowerCase();
    const locId = String(transaction.locId || "").toLowerCase();
    const refId = String(transaction.refId || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    return (
      transactionId.includes(search) ||
      productId.includes(search) ||
      productName.includes(search) ||
      locId.includes(search) ||
      refId.includes(search)
    );
  });

  return (
    <div className="container mx-auto py-6 pl-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stock Transactions</h1>
          <p className="text-muted-foreground">
            Manage stock movements in the warehouse
          </p>
        </div>
        <Button asChild>
          <Link href="/stock-transaction/create">Create</Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Transaction Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by transaction ID, product, location, or reference..."
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
                  <TableHead>Product</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No stock transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={String(transaction.transactionId)}>
                      <TableCell className="text-center">
                        {String(transaction.transactionId)}
                      </TableCell>
                      <TableCell>{transaction.productId}</TableCell>
                      <TableCell>{transaction.locId}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            transaction.transactionType === "Inbound"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {transaction.transactionType}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.refId || "N/A"}</TableCell>
                      <TableCell>{transaction.quantity}</TableCell>
                      <TableCell>{transaction.transactionDate}</TableCell>{" "}
                      <TableCell>
                        <div className="flex justify-center space-x-1">
                          <Button asChild size="icon" variant="ghost">
                            <Link
                              href={`/stock-transaction/update?id=${transaction.transactionId}`}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-red-600 hover:text-red-800"
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
                                  Are you sure you want to delete this
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
                                >
                                  Delete
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
