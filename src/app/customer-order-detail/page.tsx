"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { BackButton } from "@/components/back-button"

// Mock data for customer orders
const customerOrders = [
  {
    customerOrderId: "CO001",
    orderDate: "2023-06-20",
    address: "123 Main St, Anytown, CA 12345",
    status: "Delivered",
    items: [
      { productId: "P001", productName: "Wireless Headphones", quantity: 1, price: 129.99 },
      { productId: "P002", productName: "USB-C Cable", quantity: 1, price: 19.99 },
    ],
    transactions: [
      { transactionId: "OT001", transactionTime: "2023-06-20 10:15:30", transactionType: "Order Placed" },
      { transactionId: "OT002", transactionTime: "2023-06-21 09:30:45", transactionType: "Payment Confirmed" },
      { transactionId: "OT003", transactionTime: "2023-06-22 14:20:10", transactionType: "Order Shipped" },
      { transactionId: "OT004", transactionTime: "2023-06-24 11:45:22", transactionType: "Order Delivered" },
    ],
    customer: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
    },
  },
  {
    customerOrderId: "CO002",
    orderDate: "2023-06-25",
    address: "456 Oak Ave, Somewhere, NY 54321",
    status: "Shipped",
    items: [
      { productId: "P003", productName: "Power Bank", quantity: 1, price: 49.99 },
      { productId: "P004", productName: "Bluetooth Speaker", quantity: 1, price: 29.99 },
    ],
    transactions: [
      { transactionId: "OT005", transactionTime: "2023-06-25 15:10:20", transactionType: "Order Placed" },
      { transactionId: "OT006", transactionTime: "2023-06-26 08:45:30", transactionType: "Payment Confirmed" },
      { transactionId: "OT007", transactionTime: "2023-06-28 11:30:15", transactionType: "Order Shipped" },
    ],
    customer: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "(555) 987-6543",
    },
  },
]

export default function CustomerOrderDetailPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id")

  const order = customerOrders.find((o) => o.customerOrderId === orderId)

  if (!order) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-2">
          <BackButton href="/customer-order" />
        </div>
        <div className="mt-8 text-center">
          <h1 className="text-2xl font-bold">Order Not Found</h1>
          <p className="mt-2 text-muted-foreground">The order you are looking for does not exist.</p>
        </div>
      </div>
    )
  }

  const orderTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

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
            <h1 className="text-3xl font-bold">Order {order.customerOrderId}</h1>
            <p className="text-muted-foreground">
              Placed on {order.orderDate} •
              <Badge
                className={
                  order.status === "Delivered"
                    ? "ml-2 bg-green-100 text-green-800 hover:bg-green-100"
                    : order.status === "Shipped"
                      ? "ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100"
                      : order.status === "Processing"
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

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
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
                  {order.items.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-sm text-muted-foreground">{item.productId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Total
                    </TableCell>
                    <TableCell className="font-bold">${orderTotal.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="mt-6">
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
                  {order.transactions.map((transaction) => (
                    <TableRow key={transaction.transactionId}>
                      <TableCell className="font-medium">{transaction.transactionId}</TableCell>
                      <TableCell>{transaction.transactionTime}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            transaction.transactionType === "Order Delivered"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : transaction.transactionType === "Order Shipped"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                : transaction.transactionType === "Payment Confirmed"
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
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                  <dd>{order.customer.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                  <dd>{order.customer.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                  <dd>{order.customer.phone}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{order.address}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
