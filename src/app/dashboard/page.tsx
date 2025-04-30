import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  BarChart3,
  Package,
  ShoppingCart,
  Truck,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  // Mock data for low stock alerts
  const lowStockItems = [
    {
      id: "P001",
      name: "Wireless Headphones",
      sku: "WH-001",
      quantity: 5,
      threshold: 10,
    },
    {
      id: "P003",
      name: "Power Bank",
      sku: "PB-001",
      quantity: 3,
      threshold: 15,
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of warehouse operations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">324</div>
            <p className="text-xs text-green-600">+8% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Shipments
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-red-600">+12% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-green-600">+4.3% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Low Stock Alert</AlertTitle>
          <AlertDescription>
            The following items are below their minimum stock threshold.
          </AlertDescription>
        </Alert>

        <div className="mt-4 rounded-md border">
          <div className="grid grid-cols-4 border-b bg-muted/50 p-3 text-sm font-medium">
            <div>Product ID</div>
            <div>Product Name</div>
            <div>SKU</div>
            <div>Quantity</div>
          </div>
          {lowStockItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-4 border-b p-3 text-sm"
            >
              <div>{item.id}</div>
              <div>
                <Link
                  href={`/product-detail?id=${item.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {item.name}
                </Link>
              </div>
              <div>{item.sku}</div>
              <div>
                <Badge variant="destructive">{item.quantity}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center bg-muted/50">
            <p className="text-muted-foreground">
              [Chart Placeholder: Monthly Sales Line Chart]
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center bg-muted/50">
            <p className="text-muted-foreground">
              [Chart Placeholder: Inventory Bar Chart]
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
