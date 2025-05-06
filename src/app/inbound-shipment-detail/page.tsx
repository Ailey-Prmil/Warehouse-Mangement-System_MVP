"use client"

import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash, Truck } from "lucide-react"
import { BackButton } from "@/components/back-button"

export default function InboundShipmentDetailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const shipmentId = searchParams.get("id")

  // Mock data for inbound shipment
  const shipment = {
    ShipID: shipmentId || "SH001",
    ShipmentTime: "2023-06-15 09:30:00",
    details: [
      {
        DetailID: "ISD001",
        ShipID: shipmentId || "SH001",
        ProductID: "P001",
        ProductName: "Wireless Headphones",
        ReceivedQuantity: 20,
        PO_ID: "PO001",
        OrderedQuantity: 20,
      },
      {
        DetailID: "ISD002",
        ShipID: shipmentId || "SH001",
        ProductID: "P002",
        ProductName: "USB-C Cable",
        ReceivedQuantity: 48,
        PO_ID: "PO001",
        OrderedQuantity: 50,
      },
    ],
  }

  const handleDeleteDetail = (detailId: string) => {
    // In a real application, this would call an API to delete the specific detail
    console.log("Delete detail:", detailId)
    // Then refresh the page or update the state
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <BackButton href="/inbound-shipment" />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Truck className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Shipment {shipment.ShipID}</h1>
            <p className="text-muted-foreground">Received on {shipment.ShipmentTime}</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Shipment Details</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Detail ID</TableHead>
                <TableHead>Ship ID</TableHead>
                <TableHead>Product ID</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Received Quantity</TableHead>
                <TableHead>PO ID</TableHead>
                <TableHead>Ordered Quantity</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipment.details.map((detail) => (
                <TableRow key={detail.DetailID}>
                  <TableCell className="font-medium">{detail.DetailID}</TableCell>
                  <TableCell>{detail.ShipID}</TableCell>
                  <TableCell>{detail.ProductID}</TableCell>
                  <TableCell>{detail.ProductName}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        detail.ReceivedQuantity === detail.OrderedQuantity
                          ? "bg-green-100 text-green-800"
                          : detail.ReceivedQuantity < detail.OrderedQuantity
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                      }
                    >
                      {detail.ReceivedQuantity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/purchase-order-detail?id=${detail.PO_ID}`} className="text-blue-600 hover:underline">
                      {detail.PO_ID}
                    </Link>
                  </TableCell>
                  <TableCell>{detail.OrderedQuantity}</TableCell>
                  <TableCell>
                    <div className="flex justify-center space-x-2">
                      <Button asChild size="icon" variant="ghost">
                        <Link href={`/inbound-shipment/update-detail?id=${detail.DetailID}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteDetail(detail.DetailID)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
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
