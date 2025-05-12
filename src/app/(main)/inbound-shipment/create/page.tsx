"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BackButton } from "@/components/back-button"

export default function CreateInboundShipmentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    purchaseOrder: "",
    shipmentDate: "",
    supplier: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send this data to your API
    console.log("Form submitted:", formData)

    // Redirect back to the inbound shipments list
    router.push("/inbound-shipment")
  }

  // Reduced mock data
  const purchaseOrders = [{ id: "PO001", date: "2023-06-15" }]
  const suppliers = [{ id: "SUP001", name: "Tech Supplies Inc." }]

  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-8">
      <div className="mb-8 w-full max-w-2xl">
        <div className="flex items-center gap-2">
          <BackButton href="/inbound-shipment" />
        </div>
        <h1 className="mt-4 text-3xl font-bold">Create Inbound Shipment</h1>
        <p className="text-muted-foreground">Record a new incoming shipment</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Shipment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseOrder">Purchase Order</Label>
              <Select
                value={formData.purchaseOrder}
                onValueChange={(value) => handleChange("purchaseOrder", value)}
                required
              >
                <SelectTrigger id="purchaseOrder">
                  <SelectValue placeholder="Select purchase order" />
                </SelectTrigger>
                <SelectContent>
                  {purchaseOrders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      {order.id} - {order.date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select value={formData.supplier} onValueChange={(value) => handleChange("supplier", value)} required>
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Button variant="outline" type="button" onClick={() => router.push("/inbound-shipment")}>
              Cancel
            </Button>
            <Button type="submit">Create Shipment</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
