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

export default function CreatePurchaseOrderPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    supplier: "",
    shipmentDate: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send this data to your API
    console.log("Form submitted:", formData)

    // Redirect back to the purchase orders list
    router.push("/purchase-order")
  }

  // Reduced mock data
  const suppliers = [{ id: "SUP001", name: "Tech Supplies Inc." }]

  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-8">
      <div className="mb-8 w-full max-w-2xl">
        <div className="flex items-center gap-2">
          <BackButton href="/purchase-order" />
        </div>
        <h1 className="mt-4 text-3xl font-bold">Create Purchase Order</h1>
        <p className="text-muted-foreground">Create a new purchase order</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Purchase Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Label htmlFor="shipmentDate">Expected Shipment Date</Label>
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
            <Button variant="outline" type="button" onClick={() => router.push("/purchase-order")}>
              Cancel
            </Button>
            <Button type="submit">Create Purchase Order</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
