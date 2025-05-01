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
import { Edit, Eye, Search } from "lucide-react";

export default function OutboundShipmentPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Reduced mock data
  const shipments = [
    {
      ShipmentID: "OS001",
      ShipmentDate: "2023-06-20",
      Carrier: "FedEx",
      TrackingNumber: "FDX123456789",
    },
  ];

  const filteredShipments = shipments.filter(
    (shipment) =>
      shipment.ShipmentID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.Carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.TrackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 pl-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Outbound Shipments</h1>
          <p className="text-muted-foreground">
            Manage outgoing shipments to customers
          </p>
        </div>
        <Button asChild>
          <Link href="/outbound-shipment/create">Create</Link>
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
              placeholder="Search by shipment ID, carrier, or tracking number..."
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
                <TableHead>Shipment ID</TableHead>
                <TableHead>Shipment Date</TableHead>
                <TableHead>Carrier</TableHead>
                <TableHead>Tracking Number</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShipments.map((shipment) => (
                <TableRow key={shipment.ShipmentID}>
                  <TableCell className="font-medium">
                    {shipment.ShipmentID}
                  </TableCell>
                  <TableCell>{shipment.ShipmentDate}</TableCell>
                  <TableCell>{shipment.Carrier}</TableCell>
                  <TableCell>{shipment.TrackingNumber}</TableCell>
                  <TableCell>
                    <div className="flex justify-center space-x-2">
                      <Button asChild size="icon" variant="ghost">
                        <Link
                          href={`/outbound-shipment/view?id=${shipment.ShipmentID}`}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button asChild size="icon" variant="ghost">
                        <Link
                          href={`/outbound-shipment/update?id=${shipment.ShipmentID}`}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
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
