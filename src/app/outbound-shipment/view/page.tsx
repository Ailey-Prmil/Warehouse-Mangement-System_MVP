"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Truck } from "lucide-react"
import { BackButton } from "@/components/back-button"

export default function OutboundShipmentDetailPage() {
  const searchParams = useSearchParams()
  const shipmentId = searchParams.get("id")

  // Mock data for outbound shipment
  const shipment = {
    ShipmentID: shipmentId || "OS001",
    ShipmentDate: "2023-06-20",
    Carrier: "FedEx",
    TrackingNumber: "FDX123456789",
    Status: "Shipped",
    details: [
      {
        DetailID: "OSD001",
        ShipmentID: shipmentId || "OS001",
        ProductID: "P001",
        ProductName: "Wireless Headphones",
        Quantity: 5,
        OrderID: "CO001",
      },
      {
        DetailID: "OSD002",
        ShipmentID: shipmentId || "OS001",
        ProductID: "P003",
        ProductName: "Bluetooth Speaker",
        Quantity: 2,
        OrderID: "CO001",
      },
    ],
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <BackButton href="/outbound-shipment" />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Truck className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Shipment {shipment.ShipmentID}</h1>
            <p className="text-muted-foreground">Shipped on {shipment.ShipmentDate}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Shipment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Carrier</dt>
                <dd className="text-lg">{shipment.Carrier}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Tracking Number</dt>
                <dd className="text-lg">{shipment.TrackingNumber}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd>
                  <Badge
                    className={
                      shipment.Status === "Shipped"
                        ? "bg-green-100 text-green-800"
                        : shipment.Status === "Processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                    }
                  >
                    {shipment.Status}
                  </Badge>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipment Details</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Order ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipment.details.map((detail) => (
                  <TableRow key={detail.DetailID}>
                    <TableCell>
                      {detail.ProductID} - {detail.ProductName}
                    </TableCell>
                    <TableCell>{detail.Quantity}</TableCell>
                    <TableCell>
                      <Link
                        href={`/customer-order-detail?id=${detail.OrderID}`}
                        className="text-blue-600 hover:underline"
                      >
                        {detail.OrderID}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
