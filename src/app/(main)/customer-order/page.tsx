"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, Search } from "lucide-react"

// Reduced mock data
const customerOrders = [
  {
    customerOrderId: "CO001",
    orderDate: "2023-06-20",
    address: "123 Main St, Anytown, CA 12345",
    status: "Delivered",
    items: 3,
    total: 149.97,
  },
]

export default function CustomerOrderPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOrders = customerOrders.filter(
    (order) =>
      order.customerOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-6 pl-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Customer Orders</h1>
        <p className="text-muted-foreground">View and manage customer orders</p>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.customerOrderId}>
                  <TableCell className="font-medium">{order.customerOrderId}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell className="max-w-xs truncate">{order.address}</TableCell>
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
                  <TableCell>{order.items}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Button asChild size="icon" variant="ghost">
                        <Link href={`/customer-order-detail?id=${order.customerOrderId}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
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
  )
}
