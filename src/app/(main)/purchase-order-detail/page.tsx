"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
import { ArrowLeft, ClipboardList } from "lucide-react";

// Define interfaces for the purchase order data
interface PurchaseOrderDetail {
  productId: number;
  quantity: number;
}

interface PurchaseOrderData {
  poId: number;
  shipId: number | null;
  details: PurchaseOrderDetail[];
}

// Interface for combined product and order detail
interface OrderDetailWithProduct {
  productId: number;
  quantity: number;
  productName?: string;
  sku?: string;
}

export default function PurchaseOrderDetailPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrderData | null>(
    null
  );
  const [orderWithProducts, setOrderWithProducts] = useState<
    OrderDetailWithProduct[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPurchaseOrderDetails() {
      if (!orderId) {
        setError("No order ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch purchase order details
        const response = await fetch(`/api/purchase-order/${orderId}`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch purchase order details: ${response.statusText}`
          );
        }

        const orderData = await response.json();
        console.log("Fetched order data:", orderData);
        setPurchaseOrder(orderData);
        // Fetch product details for each product in the order
        const detailsWithProducts = await Promise.all(
          orderData.details.map(
            async (detail: { productId: number; quantity: number }) => {
              try {
                const productResponse = await fetch(
                  `/api/product/${detail.productId}`
                );
                if (productResponse.ok) {
                  const productData = await productResponse.json();
                  return {
                    ...detail,
                    productName: productData.name,
                    sku: productData.sku,
                  };
                }
                return detail;
              } catch (err) {
                console.error(
                  `Error fetching product ${detail.productId}:`,
                  err
                );
                return detail;
              }
            }
          )
        );

        setOrderWithProducts(detailsWithProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchPurchaseOrderDetails();
  }, [orderId]);
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading purchase order details...</div>
      </div>
    );
  }

  if (error || !purchaseOrder) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/purchase-order">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Purchase Orders
            </Link>
          </Button>
        </div>
        <div className="mt-8 text-center">
          <h1 className="text-2xl font-bold">Purchase Order Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            {error || "The purchase order you are looking for does not exist."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/purchase-order">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Purchase Orders
            </Link>
          </Button>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <ClipboardList className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              Purchase Order {purchaseOrder.poId}
            </h1>
            <p className="text-muted-foreground">
              Ship ID: {purchaseOrder.shipId ? purchaseOrder.shipId : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Order Details</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Ordered Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderWithProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No purchase order details found.
                  </TableCell>
                </TableRow>
              ) : (
                orderWithProducts.map((detail, index) => (
                  <TableRow key={`${detail.productId}-${index}`}>
                    <TableCell>{detail.productId}</TableCell>
                    <TableCell>
                      {detail.productName || "Unknown Product"}
                    </TableCell>
                    <TableCell>{detail.sku || "N/A"}</TableCell>
                    <TableCell>{detail.quantity}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
