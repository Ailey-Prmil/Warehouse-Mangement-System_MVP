"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Truck } from "lucide-react";
import { BackButton } from "@/components/back-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";

// Define types based on the database schema
interface OutboundShipment {
  shipmentId: number;
  shipmentTime: string;
  carrier: string;
  trackingNumber: string;
}

// Mock details type since we don't have a database table for it yet
interface ShipmentDetail {
  detailId: string;
  productId: string;
  productName: string;
  quantity: number;
  orderId: string;
}

export default function OutboundShipmentDetailPage() {
  const searchParams = useSearchParams();
  const shipmentId = searchParams.get("id");
  const [shipment, setShipment] = useState<OutboundShipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for shipment details - in a real implementation, these would be fetched from an API
  const shipmentDetails: ShipmentDetail[] = [
    {
      detailId: "OSD001",
      productId: "P001",
      productName: "Wireless Headphones",
      quantity: 5,
      orderId: "1",
    },
    {
      detailId: "OSD002",
      productId: "P003",
      productName: "Bluetooth Speaker",
      quantity: 2,
      orderId: "1",
    },
  ];

  useEffect(() => {
    if (!shipmentId) {
      setError("Shipment ID is required");
      setLoading(false);
      return;
    }

    const fetchShipmentData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch shipment data
        const response = await fetch(`/api/outbound-shipment/${shipmentId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Shipment with ID ${shipmentId} not found`);
          }
          throw new Error("Failed to fetch shipment data");
        }

        const data = await response.json();
        setShipment(data);
      } catch (err) {
        console.error("Error fetching shipment data:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching shipment data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchShipmentData();
  }, [shipmentId]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-2">
          <BackButton href="/outbound-shipment" />
        </div>
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">Loading shipment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-2">
          <BackButton href="/outbound-shipment" />
        </div>
        <div className="mt-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-2">
          <BackButton href="/outbound-shipment" />
        </div>
        <div className="mt-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Shipment not found</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <BackButton href="/outbound-shipment" />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Truck className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              Shipment {shipment.shipmentId}
            </h1>
            <p className="text-muted-foreground">
              Shipped on {format(new Date(shipment.shipmentTime), "PPP")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Shipment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Carrier</dt>
                <dd className="text-lg">
                  {shipment.carrier || "Not specified"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Tracking Number
                </dt>
                <dd className="text-lg">
                  {shipment.trackingNumber || "Not specified"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd>
                  <Badge className="bg-green-100 text-green-800">Shipped</Badge>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipment Details</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {shipmentDetails.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Order ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipmentDetails.map((detail) => (
                    <TableRow key={detail.detailId}>
                      <TableCell>
                        {detail.productId} - {detail.productName}
                      </TableCell>
                      <TableCell>{detail.quantity}</TableCell>
                      <TableCell>
                        <Link
                          href={`/customer-order-detail?id=${detail.orderId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {detail.orderId}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No shipment details available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
