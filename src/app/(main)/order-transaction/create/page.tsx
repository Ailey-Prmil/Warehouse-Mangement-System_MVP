"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BackButton } from "@/components/back-button"

export default function CreateOrderTransactionPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    CustomerOrderID: "CO001",
    RefID: "REF001",
    TransactionType: "Order Placed",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send this data to your API
    console.log("Form submitted:", formData)

    // Redirect back to the order transactions list
    router.push("/order-transaction")
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-8">
      <div className="mb-8 w-full max-w-2xl">
        <div className="flex items-center gap-2">
          <BackButton href="/order-transaction" />
        </div>
        <h1 className="mt-4 text-3xl font-bold">Create Order Transaction</h1>
        <p className="text-muted-foreground">Record a new order transaction</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="CustomerOrderID">Customer Order</Label>
              <Input
                id="CustomerOrderID"
                value={formData.CustomerOrderID}
                onChange={(e) => handleChange("CustomerOrderID", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="RefID">Reference ID</Label>
              <Input
                id="RefID"
                placeholder="Enter reference ID"
                value={formData.RefID}
                onChange={(e) => handleChange("RefID", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="TransactionType">Transaction Type</Label>
              <Input
                id="TransactionType"
                value={formData.TransactionType}
                onChange={(e) => handleChange("TransactionType", e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/order-transaction")}>
              Cancel
            </Button>
            <Button type="submit">Create Transaction</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
