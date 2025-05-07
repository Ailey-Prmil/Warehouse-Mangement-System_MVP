"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, ClipboardList } from "lucide-react"

export default function PurchaseOrderDetailPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id")

  // Mock data for purchase order
  const purchaseOrder = {
    PO_ID: orderId || "PO001",
    ShipID: "SH001",
    CreateAt: "2023-06-15",
    details: [
      {
        PODetailID: "POD001",
        PO_ID: orderId || "PO001",
        ProductID: "P001",
        ProductName: "Wireless Headphones",
        OrderedQuantity: 20,
      },
      {
        PODetailID: "POD002",
        PO_ID: orderId || "PO001",
        ProductID: "P002",
        ProductName: "USB-C Cable",
        OrderedQuantity: 50,
      },
    ],
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/purchase-order">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Purchase Orders
            </Link>
          </Button>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <ClipboardList className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Purchase Order {purchaseOrder.PO_ID}</h1>
            <p className="text-muted-foreground">
              Created on {purchaseOrder.CreateAt} • Ship ID: {purchaseOrder.ShipID}
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Order Details</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Detail ID</TableHead>
                <TableHead>PO ID</TableHead>
                <TableHead>Product ID</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Ordered Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrder.details.map((detail) => (
                <TableRow key={detail.PODetailID}>
                  <TableCell className="font-medium">{detail.PODetailID}</TableCell>
                  <TableCell>{detail.PO_ID}</TableCell>
                  <TableCell>{detail.ProductID}</TableCell>
                  <TableCell>{detail.ProductName}</TableCell>
                  <TableCell>{detail.OrderedQuantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
