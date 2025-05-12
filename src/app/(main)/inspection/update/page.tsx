"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { BackButton } from "@/components/back-button"

export default function UpdateInspectionPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    StockID: "ST001",
    DefectQuantity: "2",
    Reason: "Damaged packaging",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send this data to your API
    console.log("Form submitted:", formData)

    // Redirect back to the inspections list
    router.push("/inspection")
  }

  // Reduced mock data
  const stocks = [{ id: "ST001", product: "Wireless Headphones" }]

  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-8">
      <div className="mb-8 w-full max-w-2xl">
        <div className="flex items-center gap-2">
          <BackButton href="/inspection" />
        </div>
        <h1 className="mt-4 text-3xl font-bold">Update Inspection</h1>
        <p className="text-muted-foreground">Edit inspection I001</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Inspection Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="StockID">Stock</Label>
              <Select value={formData.StockID} onValueChange={(value) => handleChange("StockID", value)} required>
                <SelectTrigger id="StockID">
                  <SelectValue placeholder="Select stock" />
                </SelectTrigger>
                <SelectContent>
                  {stocks.map((stock) => (
                    <SelectItem key={stock.id} value={stock.id}>
                      {stock.id} - {stock.product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="DefectQuantity">Defect Quantity</Label>
              <Input
                id="DefectQuantity"
                type="number"
                min="0"
                placeholder="Enter defect quantity"
                value={formData.DefectQuantity}
                onChange={(e) => handleChange("DefectQuantity", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="Reason">Reason</Label>
              <Textarea
                id="Reason"
                placeholder="Enter reason for defects"
                value={formData.Reason}
                onChange={(e) => handleChange("Reason", e.target.value)}
                rows={4}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/inspection")}>
              Cancel
            </Button>
            <Button type="submit">Update Inspection</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
