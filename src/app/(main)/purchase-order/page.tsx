"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Eye, Search } from "lucide-react";

// Define the PurchaseOrder type to match the database schema
interface PurchaseOrder {
  poId: number; // poId is numeric (auto-generated)
  shipmentId: number | null; // Nullable as per schema
  createdAt: string; // Use camelCase to match API naming convention
}

export default function PurchaseOrderPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch purchase orders from the API
  useEffect(() => {
    async function fetchPurchaseOrders() {
      try {
        setLoading(true);
        const response = await fetch("/api/purchase-order");
        if (!response.ok) {
          throw new Error("Failed to fetch purchase orders");
        }
        const data: PurchaseOrder[] = await response.json();
        console.log("Fetched purchase orders:", data); // Log to inspect the response
        setPurchaseOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchPurchaseOrders();
  }, []);
  const filteredOrders = purchaseOrders.filter((order) => {
    // Convert fields to strings and handle null/undefined
    const poId = String(order.poId || "").toLowerCase();
    const shipmentId = String(order.shipmentId || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    return poId.includes(search) || shipmentId.includes(search);
  });

  return (
    <div className="container mx-auto py-6 pl-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Purchase Orders</h1>
        <p className="text-muted-foreground">
          Manage purchase orders from suppliers
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Search Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by PO ID or Shipment ID..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-600">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">PO ID</TableHead>
                  <TableHead>Shipment ID</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No purchase orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={String(order.poId)}>
                      <TableCell className="text-center">
                        {String(order.poId)}
                      </TableCell>
                      <TableCell>{order.shipmentId || "N/A"}</TableCell>
                      <TableCell>{order.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Button asChild size="icon" variant="ghost">
                            <Link
                              href={`/purchase-order-detail?id=${order.poId}`}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
