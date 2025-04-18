"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Box,
  ClipboardList,
  Home,
  Layers,
  Package,
  PackageCheck,
  PackageOpen,
  ShoppingCart,
  Truck,
  User,
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const routes = [
    {
      name: "Home",
      path: "/home",
      icon: Home,
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: BarChart3,
    },
    {
      name: "Product",
      path: "/product",
      icon: Package,
    },
    {
      name: "Location Bin",
      path: "/location-bin",
      icon: Layers,
    },
    {
      name: "Stock Transaction",
      path: "/stock-transaction",
      icon: Box,
    },
    {
      name: "Customer Order",
      path: "/customer-order",
      icon: ShoppingCart,
    },
    {
      name: "Purchase Order",
      path: "/purchase-order",
      icon: ClipboardList,
    },
    {
      name: "Order Transaction",
      path: "/order-transaction",
      icon: ShoppingCart,
    },
    {
      name: "Inspection",
      path: "/inspection",
      icon: PackageCheck,
    },
    {
      name: "Inbound Shipment",
      path: "/inbound-shipment",
      icon: Truck,
    },
    {
      name: "Outbound Shipment",
      path: "/outbound-shipment",
      icon: Truck,
    },
    {
      name: "Picking List",
      path: "/picking-list",
      icon: PackageOpen,
    },
  ]

  return (
    <div className="w-64 h-screen border-r bg-white overflow-auto flex flex-col">
      <div className="flex h-16 items-center justify-between border-b px-4">
        <h1 className="text-xl font-bold text-primary">WMS</h1>
        <div className="flex items-center">
          <div className="relative">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary cursor-pointer hover:bg-primary/20 transition-colors">
              <User className="h-4 w-4" />
            </div>
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
          </div>
        </div>
      </div>
      <nav className="flex flex-col gap-1 p-2 flex-1">
        {routes.map((route) => (
          <Link
            key={route.path}
            href={route.path}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === route.path
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <route.icon className="h-5 w-5" />
            <span>{route.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
