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

// Define the InboundShipment type to match the database schema
interface InboundShipment {
  shipmentId: string | number; // Allow number in case shipId is numeric
  shipmentTime: string | null; // Nullable as it may not be set
}

export default function InboundShipmentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [shipments, setShipments] = useState<InboundShipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch inbound shipments from the API
  useEffect(() => {
    async function fetchInboundShipments() {
      try {
        setLoading(true);
        const response = await fetch("/api/inbound-shipment");
        if (!response.ok) {
          throw new Error("Failed to fetch inbound shipments");
        }
        const data: InboundShipment[] = await response.json();
        console.log("Fetched data:", data); // Log to inspect the response
        setShipments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchInboundShipments();
  }, []);
  const filteredShipments = shipments.filter((shipment) => {
    // Convert fields to strings and handle null/undefined
    const shipId = String(shipment.shipmentId || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    return shipId.includes(search);
  });

  return (
    <div className="container mx-auto py-6 pl-6">
      {" "}
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold">Inbound Shipments</h1>
          <p className="text-muted-foreground">
            Manage incoming shipments from suppliers
          </p>
        </div>
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
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-600">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Ship ID</TableHead>
                  <TableHead>Shipment Time</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShipments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No shipments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredShipments.map((shipment) => (
                    <TableRow key={String(shipment.shipmentId)}>
                      <TableCell className="text-center">
                        {String(shipment.shipmentId)}
                      </TableCell>
                      <TableCell>
                        {shipment.shipmentTime ? (
                          new Date(shipment.shipmentTime).toLocaleString()
                        ) : (
                          <span className="text-yellow-600">Pending</span>
                        )}
                      </TableCell>{" "}
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          {" "}
                          {shipment.shipmentTime ? (
                            <Button asChild size="icon" variant="ghost">
                              <Link
                                href={`/inbound-shipment-detail?id=${shipment.shipmentId}`}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Link>
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={async () => {
                                try {
                                  const response = await fetch(
                                    `/api/inbound-shipment/${shipment.shipmentId}`,
                                    {
                                      method: "PATCH",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                        shipmentTime: new Date().toISOString(),
                                      }),
                                    }
                                  );

                                  if (!response.ok) {
                                    throw new Error(
                                      "Failed to confirm shipment"
                                    );
                                  }

                                  // Update the local state
                                  setShipments((prev) =>
                                    prev.map((s) =>
                                      s.shipmentId === shipment.shipmentId
                                        ? {
                                            ...s,
                                            shipmentTime:
                                              new Date().toISOString(),
                                          }
                                        : s
                                    )
                                  );

                                  // Navigate to create page
                                  window.location.href =
                                    "/inbound-shipment/create";
                                } catch (err) {
                                  alert(
                                    err instanceof Error
                                      ? err.message
                                      : "An error occurred"
                                  );
                                }
                              }}
                            >
                              Confirm
                            </Button>
                          )}
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
