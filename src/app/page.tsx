import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Box,
  Layers,
  Package,
  ShoppingCart,
  Truck,
} from "lucide-react";

export default function HomePage() {
  const quickLinks = [
    {
      title: "Dashboard",
      description: "View warehouse analytics",
      icon: BarChart3,
      href: "/dashboard",
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Products",
      description: "Manage products",
      icon: Package,
      href: "/products",
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Stock Transactions",
      description: "Track stock movements",
      icon: Box,
      href: "/stock-transactions",
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Location Bins",
      description: "Manage locations",
      icon: Layers,
      href: "/location-bins",
      color: "bg-orange-100 text-orange-700",
    },
    {
      title: "Customer Orders",
      description: "View orders",
      icon: ShoppingCart,
      href: "/customer-orders",
      color: "bg-red-100 text-red-700",
    },
    {
      title: "Shipments",
      description: "Manage shipments",
      icon: Truck,
      href: "/inbound-shipment",
      color: "bg-yellow-100 text-yellow-700",
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Warehouse Management System</h1>
        <p className="text-gray-500">
          Manage your warehouse operations efficiently
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <Card key={link.title}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className={`rounded-md p-2 ${link.color}`}>
                  <link.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">{link.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{link.description}</p>
              <Link
                href={link.href}
                className="flex items-center gap-1 text-blue-600"
              >
                Go to {link.title} <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
