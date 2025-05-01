"use client";

import { useState } from "react";
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
import { Edit, Search } from "lucide-react";

// Reduced mock data
const stockTransactions = [
  {
    transactionId: "ST001",
    productId: "P001",
    productName: "Wireless Headphones",
    locId: "L001",
    transactionType: "Inbound",
    refId: "PO001",
    quantity: 20,
    transactionDate: "2023-06-15",
  },
];

export default function StockTransactionPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = stockTransactions.filter(
    (transaction) =>
      transaction.transactionId
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.productName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.locId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.refId.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
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
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.transactionId}>
                  <TableCell className="font-medium">
                    {transaction.transactionId}
                  </TableCell>
                  <TableCell>
                    {transaction.productId} - {transaction.productName}
                  </TableCell>
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
                  <TableCell>{transaction.refId}</TableCell>
                  <TableCell>{transaction.quantity}</TableCell>
                  <TableCell>{transaction.transactionDate}</TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Button asChild size="icon" variant="ghost">
                        <Link
                          href={`/stock-transaction/update?id=${transaction.transactionId}`}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
