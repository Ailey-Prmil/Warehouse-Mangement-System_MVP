import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, BarChart3, Box, Layers, Package, ShoppingCart, Truck } from "lucide-react"

export default function HomePage() {
  const quickLinks = [
    {
      title: "Dashboard",
      description: "View warehouse analytics and metrics",
      icon: BarChart3,
      href: "/dashboard",
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Product",
      description: "Manage your product inventory",
      icon: Package,
      href: "/product",
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Stock Transaction",
      description: "Track stock movements",
      icon: Box,
      href: "/stock-transaction",
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Location Bin",
      description: "Manage warehouse locations",
      icon: Layers,
      href: "/location-bin",
      color: "bg-orange-100 text-orange-700",
    },
    {
      title: "Customer Order",
      description: "View and manage customer orders",
      icon: ShoppingCart,
      href: "/customer-order",
      color: "bg-red-100 text-red-700",
    },
    {
      title: "Inbound Shipment",
      description: "Manage inbound shipments",
      icon: Truck,
      href: "/inbound-shipment",
      color: "bg-yellow-100 text-yellow-700",
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Welcome to Warehouse Management System</h1>
        <p className="text-muted-foreground">
          Manage your warehouse operations efficiently with our comprehensive system
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <Card key={link.title} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className={`rounded-md p-2 ${link.color}`}>
                  <link.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">{link.title}</CardTitle>
              </div>
              <CardDescription>{link.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="px-0 text-primary">
                <Link href={link.href} className="flex items-center gap-1">
                  Go to {link.title} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
