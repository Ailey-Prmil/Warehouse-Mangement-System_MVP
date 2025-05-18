"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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
import { Truck } from "lucide-react";
import { BackButton } from "@/components/back-button";

interface ShipmentDetail {
  detailId: number;
  shipmentId: number;
  productId: number;
  productName: string;
  receivedQuantity: number | null;
  poId?: number | null;
  orderedQuantity?: number | null;
}

interface Shipment {
  shipmentId: number;
  shipmentTime: string | null;
  inboundShipmentDetails: ShipmentDetail[];
  purchaseOrderIds: number[];
}

export default function InboundShipmentDetailPage() {
  const searchParams = useSearchParams();
  const shipmentId = searchParams.get("id");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shipment, setShipment] = useState<Shipment | null>(null);

  // Fetch shipment data
  useEffect(() => {
    async function fetchShipmentData() {
      if (!shipmentId) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/inbound-shipment/${shipmentId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch shipment data");
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        // Get shipment info including time
        const shipmentResponse = await fetch(
          `/api/inbound-shipment/${shipmentId}/info`
        );
        let shipmentTime = null;

        if (shipmentResponse.ok) {
          const shipmentData = await shipmentResponse.json();
          shipmentTime = shipmentData.shipmentTime;
        }
        // Transform the data to show both inbound shipment details and PO details
        const detailsWithProducts = await Promise.all(
          data.inboundShipmentDetails.map(
            async (detail: {
              detailId?: number;
              productId: number;
              receivedQuantity: number | null;
              orderedQuantity?: number | null;
            }) => {
              // Get product name from product API
              let productName = `Product ${detail.productId}`;
              try {
                const productResponse = await fetch(
                  `/api/product/${detail.productId}`
                );
                if (productResponse.ok) {
                  const productData = await productResponse.json();
                  productName = productData.name;
                }
              } catch (err) {
                console.error("Error fetching product details:", err);
              }
              return {
                detailId:
                  detail.detailId || Math.floor(Math.random() * 100) + 1,
                shipmentId: Number(shipmentId),
                productId: detail.productId,
                productName,
                receivedQuantity: detail.receivedQuantity,
                poId: data.purchaseOrderIds[0], // Simplification, assuming one PO per shipment
                orderedQuantity: detail.orderedQuantity,
              };
            }
          )
        );

        setShipment({
          shipmentId: Number(shipmentId),
          shipmentTime,
          inboundShipmentDetails: detailsWithProducts,
          purchaseOrderIds: data.purchaseOrderIds || [],
        });
      } catch (err) {
        console.error("Error fetching shipment data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchShipmentData();
  }, [shipmentId]);

  // const handleDeleteDetail = async (detailId: number) => {
  //   if (!shipmentId || !detailId) return;

  //   if (!confirm("Are you sure you want to delete this detail?")) return;

  //   try {
  //     const response = await fetch(`/api/inbound-shipment-detail/${detailId}`, {
  //       method: "DELETE",
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to delete shipment detail");
  //     }

  //     // Update the UI by filtering out the deleted detail
  //     setShipment((prev) => {
  //       if (!prev) return prev;
  //       return {
  //         ...prev,
  //         inboundShipmentDetails: prev.inboundShipmentDetails.filter(
  //           (detail) => detail.detailId !== detailId
  //         ),
  //       };
  //     });
  //   } catch (err) {
  //     console.error("Error deleting shipment detail:", err);
  //     alert(err instanceof Error ? err.message : "An error occurred");
  //   }
  // };

  // const handleDeleteShipment = async () => {
  //   if (!shipmentId) return;

  //   if (
  //     !confirm(
  //       "Are you sure you want to delete this entire shipment? This action cannot be undone."
  //     )
  //   )
  //     return;

  //   try {
  //     const response = await fetch("/api/inbound-shipment", {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ shipmentId }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to delete shipment");
  //     }

  //     router.push("/inbound-shipment");
  //   } catch (err) {
  //     console.error("Error deleting shipment:", err);
  //     alert(err instanceof Error ? err.message : "An error occurred");
  //   }
  // };
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <BackButton href="/inbound-shipment" />
        </div>
        {isLoading ? (
          <div className="mt-4 text-center">Loading...</div>
        ) : error ? (
          <div className="mt-4 text-center text-red-600">{error}</div>
        ) : shipment ? (
          <>
            {/* First card: Basic Shipment Information */}
            <div className="mt-4 flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <Truck className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  Shipment {shipment.shipmentId}
                </h1>
                <p className="text-muted-foreground">
                  {shipment.shipmentTime
                    ? `Received on ${new Date(
                        shipment.shipmentTime
                      ).toLocaleString()}`
                    : "Pending confirmation"}
                </p>
              </div>
            </div>{" "}
            {/* Card 1: Inbound Shipment Details with edit/delete functions */}
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Inbound Shipment Details</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table className="min-w-[800px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Detail ID</TableHead>
                      <TableHead className="w-[100px]">Product ID</TableHead>
                      <TableHead className="w-[200px]">Product Name</TableHead>
                      <TableHead className="w-[150px]">
                        Received Quantity
                      </TableHead>
                      {/* <TableHead className="text-center">Actions</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shipment.inboundShipmentDetails.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No details found for this shipment.
                        </TableCell>
                      </TableRow>
                    ) : (
                      shipment.inboundShipmentDetails.map((detail, index) => (
                        <TableRow key={`detail-${detail.productId}-${index}`}>
                          <TableCell className="font-medium">
                            {detail.detailId}
                          </TableCell>
                          <TableCell>{detail.productId}</TableCell>
                          <TableCell>{detail.productName}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                detail.receivedQuantity ===
                                detail.orderedQuantity
                                  ? "bg-green-100 text-green-800"
                                  : detail.receivedQuantity &&
                                    detail.orderedQuantity &&
                                    detail.receivedQuantity <
                                      detail.orderedQuantity
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                              }
                            >
                              {detail.receivedQuantity ?? 0}
                            </Badge>
                          </TableCell>
                          {/* <TableCell>
                            <div className="flex justify-center space-x-2">
                              <Button asChild size="icon" variant="ghost">
                                <Link
                                  href={`/inbound-shipment/update-detail?id=${detail.detailId}`}
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Link>
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-red-500 hover:text-red-700"
                                onClick={() =>
                                  handleDeleteDetail(detail.detailId)
                                }
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell> */}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            {/* Card 2: Purchase Order Details for comparison (read-only) */}
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Purchase Order Details</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table className="min-w-[800px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">PO ID</TableHead>
                      <TableHead className="w-[100px]">Product ID</TableHead>
                      <TableHead className="w-[200px]">Product Name</TableHead>
                      <TableHead className="w-[150px]">
                        Ordered Quantity
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shipment.inboundShipmentDetails.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No purchase order details found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      shipment.inboundShipmentDetails.map((detail, index) => (
                        <TableRow key={`po-${detail.productId}-${index}`}>
                          <TableCell>
                            {detail.poId && (
                              <Link
                                href={`/purchase-order-detail?id=${detail.poId}`}
                                className="text-blue-600 hover:underline"
                              >
                                {detail.poId}
                              </Link>
                            )}
                          </TableCell>
                          <TableCell>{detail.productId}</TableCell>
                          <TableCell>{detail.productName}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                detail.orderedQuantity ===
                                detail.receivedQuantity
                                  ? "bg-green-100 text-green-800"
                                  : detail.orderedQuantity &&
                                    detail.receivedQuantity &&
                                    detail.orderedQuantity >
                                      detail.receivedQuantity
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                              }
                            >
                              {detail.orderedQuantity ?? 0}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </div>
  );
}
