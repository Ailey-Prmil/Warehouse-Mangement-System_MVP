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
import { Edit, Search, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Define the OutboundShipment type to match the database schema
interface OutboundShipment {
  shipmentId: string | number; // Allow number in case shipmentId is numeric
  shipmentTime: string | null; // Field from database schema
  carrier: string | null; // Nullable as it's optional in POST
  trackingNumber: string | null; // Nullable as it's optional in POST
}

export default function OutboundShipmentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [shipments, setShipments] = useState<OutboundShipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch outbound shipments from the API
  useEffect(() => {
    async function fetchOutboundShipments() {
      try {
        setLoading(true);
        const response = await fetch("/api/outbound-shipment");
        if (!response.ok) {
          throw new Error("Failed to fetch outbound shipments");
        }
        const data: OutboundShipment[] = await response.json();
        console.log("Fetched data:", data); // Log to inspect the response
        setShipments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchOutboundShipments();
  }, []);

  const filteredShipments = shipments.filter((shipment) => {
    // Convert fields to strings and handle null/undefined
    const shipmentId = String(shipment.shipmentId || "").toLowerCase();
    const carrier = String(shipment.carrier || "").toLowerCase();
    const trackingNumber = String(shipment.trackingNumber || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    return (
      shipmentId.includes(search) ||
      carrier.includes(search) ||
      trackingNumber.includes(search)
    );
  });
  // Handle delete shipment
  const handleDelete = async (shipmentId: string | number) => {
    try {
      const response = await fetch("/api/outbound-shipment", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shipmentId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete shipment");
      }

      // Update state to remove the deleted shipment
      setShipments((prev) => prev.filter((s) => s.shipmentId !== shipmentId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    }
  };

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
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-600">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Shipment ID</TableHead>
                  <TableHead>Shipment Date</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Tracking Number</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShipments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
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
                        {shipment.shipmentTime
                          ? new Date(shipment.shipmentTime).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>{shipment.carrier || "N/A"}</TableCell>
                      <TableCell>{shipment.trackingNumber || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex justify-center space-x-2">
                          {/* <Button asChild size="icon" variant="ghost">
                            <Link
                              href={`/outbound-shipment/view?id=${shipment.shipmentId}`}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button> */}
                          <Button asChild size="icon" variant="ghost">
                            <Link
                              href={`/outbound-shipment/update?id=${shipment.shipmentId}`}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Confirm Deletion
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this shipment?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDelete(shipment.shipmentId)
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
