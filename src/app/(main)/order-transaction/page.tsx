"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Edit, Eye, Search, Trash } from "lucide-react"

export default function OrderTransactionPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Reduced mock data
  const transactions = [
    {
      TransactionID: "OT001",
      CustomerOrderID: "CO001",
      RefID: "REF001",
      TransactionTime: "2023-06-20 10:15:30",
      TransactionType: "Order Placed",
    },
  ]

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.TransactionID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.CustomerOrderID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.RefID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.TransactionType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-6 pl-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Transactions</h1>
          <p className="text-muted-foreground">Track order status changes and activities</p>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Customer Order ID</TableHead>
                <TableHead>Reference ID</TableHead>
                <TableHead>Transaction Time</TableHead>
                <TableHead>Transaction Type</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.TransactionID}>
                  <TableCell className="font-medium">{transaction.TransactionID}</TableCell>
                  <TableCell>
                    <Link
                      href={`/customer-order-detail?id=${transaction.CustomerOrderID}`}
                      className="text-blue-600 hover:underline"
                    >
                      {transaction.CustomerOrderID}
                    </Link>
                  </TableCell>
                  <TableCell>{transaction.RefID}</TableCell>
                  <TableCell>{transaction.TransactionTime}</TableCell>
                  <TableCell>{transaction.TransactionType}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button asChild size="icon" variant="ghost">
                        <Link href={`/customer-order-detail?id=${transaction.CustomerOrderID}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Order</span>
                        </Link>
                      </Button>
                      <Button asChild size="icon" variant="ghost">
                        <Link href={`/order-transaction/update?id=${transaction.TransactionID}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-700">
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
