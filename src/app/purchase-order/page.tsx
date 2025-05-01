"use client";

import { useState } from "react";
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

export default function PurchaseOrderPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Reduced mock data
  const purchaseOrders = [
    {
      PO_ID: "PO001",
      ShipID: "SH001",
      CreateAt: "2023-06-15",
    },
  ];

  const filteredOrders = purchaseOrders.filter(
    (order) =>
      order.PO_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.ShipID.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO ID</TableHead>
                <TableHead>Ship ID</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.PO_ID}>
                  <TableCell className="font-medium">{order.PO_ID}</TableCell>
                  <TableCell>{order.ShipID}</TableCell>
                  <TableCell>{order.CreateAt}</TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Button asChild size="icon" variant="ghost">
                        <Link href={`/purchase-order-detail?id=${order.PO_ID}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No purchase orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
