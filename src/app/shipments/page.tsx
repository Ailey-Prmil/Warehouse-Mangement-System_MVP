import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Plus } from "lucide-react"

export default function ShipmentsPage() {
  // Minimal mock data
  const shipments = [
    {
      shipmentId: "SH001",
      type: "Inbound",
      shipmentDate: "2023-06-15",
      status: "Received",
      items: 3,
    },
    {
      shipmentId: "SH002",
      type: "Outbound",
      shipmentDate: "2023-06-18",
      status: "Shipped",
      items: 2,
    },
    {
      shipmentId: "SH003",
      type: "Inbound",
      shipmentDate: "2023-06-22",
      status: "Pending",
      items: 5,
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shipments</h1>
          <p className="text-gray-500">Manage inbound and outbound shipments</p>
        </div>
        <Link href="/shipments/create" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          <Plus className="mr-2 inline-block h-4 w-4" />
          Create Shipment
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shipment List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-6 border-b bg-gray-100 p-3 text-sm font-medium">
              <div>Shipment ID</div>
              <div>Type</div>
              <div>Date</div>
              <div>Status</div>
              <div>Items</div>
              <div>Actions</div>
            </div>
            {shipments.map((shipment) => (
              <div key={shipment.shipmentId} className="grid grid-cols-6 border-b p-3 text-sm">
                <div>{shipment.shipmentId}</div>
                <div>
                  <Badge
                    className={
                      shipment.type === "Inbound" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    }
                  >
                    {shipment.type}
                  </Badge>
                </div>
                <div>{shipment.shipmentDate}</div>
                <div>
                  <Badge
                    className={
                      shipment.status === "Received"
                        ? "bg-green-100 text-green-800"
                        : shipment.status === "Shipped"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {shipment.status}
                  </Badge>
                </div>
                <div>{shipment.items}</div>
                <div>
                  <Link href={`/shipments/${shipment.shipmentId}`} className="flex items-center text-blue-600">
                    <Eye className="mr-1 h-4 w-4" />
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
