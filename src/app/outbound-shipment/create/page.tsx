"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BackButton } from "@/components/back-button"

export default function CreateOutboundShipmentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    customerOrder: "CO001",
    carrier: "FedEx",
    trackingNumber: "FDX123456789",
    shipmentDate: "2023-06-20",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send this data to your API
    console.log("Form submitted:", formData)

    // Redirect back to the outbound shipments list
    router.push("/outbound-shipment")
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-8">
      <div className="mb-8 w-full max-w-2xl">
        <div className="flex items-center gap-2">
          <BackButton href="/outbound-shipment" />
        </div>
        <h1 className="mt-4 text-3xl font-bold">Create Outbound Shipment</h1>
        <p className="text-muted-foreground">Record a new outgoing shipment</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Shipment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerOrder">Customer Order</Label>
              <Input
                id="customerOrder"
                value={formData.customerOrder}
                onChange={(e) => handleChange("customerOrder", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carrier">Carrier</Label>
              <Input
                id="carrier"
                value={formData.carrier}
                onChange={(e) => handleChange("carrier", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trackingNumber">Tracking Number</Label>
              <Input
                id="trackingNumber"
                placeholder="Enter tracking number"
                value={formData.trackingNumber}
                onChange={(e) => handleChange("trackingNumber", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shipmentDate">Shipment Date</Label>
              <Input
                id="shipmentDate"
                type="date"
                value={formData.shipmentDate}
                onChange={(e) => handleChange("shipmentDate", e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/outbound-shipment")}>
              Cancel
            </Button>
            <Button type="submit">Create Shipment</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
