"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BackButton } from "@/components/back-button"

export default function UpdateStockTransactionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const transactionId = searchParams.get("id") || "ST001"

  const [formData, setFormData] = useState({
    productId: "P001",
    productName: "Wireless Headphones",
    locId: "L001",
    transactionType: "Inbound",
    refId: "PO001",
    quantity: "20",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send this data to your API
    console.log("Form submitted:", { transactionId, ...formData })

    // Redirect back to the stock transactions list
    router.push("/stock-transaction")
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-8">
      <div className="mb-8 w-full max-w-2xl">
        <div className="flex items-center gap-2">
          <BackButton href="/stock-transaction" />
        </div>
        <h1 className="mt-4 text-3xl font-bold">Update Stock Transaction</h1>
        <p className="text-muted-foreground">Edit transaction {transactionId}</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
            <CardDescription>Update the details for this stock transaction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productId">Product</Label>
                <Input
                  id="productId"
                  value={`${formData.productId} - ${formData.productName}`}
                  onChange={(e) => handleChange("productId", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="locId">Location</Label>
                <Input
                  id="locId"
                  value={formData.locId}
                  onChange={(e) => handleChange("locId", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transactionType">Transaction Type</Label>
                <Input
                  id="transactionType"
                  value={formData.transactionType}
                  onChange={(e) => handleChange("transactionType", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="refId">Reference ID</Label>
                <Input
                  id="refId"
                  placeholder="e.g., PO001, CO002"
                  value={formData.refId}
                  onChange={(e) => handleChange("refId", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/stock-transaction")}>
              Cancel
            </Button>
            <Button type="submit">Update Transaction</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
