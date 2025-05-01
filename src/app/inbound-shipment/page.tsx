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

export default function InboundShipmentPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Reduced mock data
  const shipments = [
    {
      ShipID: "SH001",
      ShipmentTime: "2023-06-15 09:30:00",
    },
  ];

  const filteredShipments = shipments.filter((shipment) =>
    shipment.ShipID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 pl-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inbound Shipments</h1>
          <p className="text-muted-foreground">
            Manage incoming shipments from suppliers
          </p>
        </div>
        <Button asChild>
          <Link href="/inbound-shipment/create">Create</Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Search Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by shipment ID..."
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
                <TableHead>Ship ID</TableHead>
                <TableHead>Shipment Time</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShipments.map((shipment) => (
                <TableRow key={shipment.ShipID}>
                  <TableCell className="font-medium">
                    {shipment.ShipID}
                  </TableCell>
                  <TableCell>
                    {shipment.ShipmentTime ? (
                      shipment.ShipmentTime
                    ) : (
                      <span className="text-yellow-600">Pending</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Button asChild size="icon" variant="ghost">
                        <Link
                          href={`/inbound-shipment-detail?id=${shipment.ShipID}`}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
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
  );
}
