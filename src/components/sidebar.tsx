"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Box,
  ClipboardList,
  Home,
  Layers,
  LogOut,
  Package,
  PackageCheck,
  PackageOpen,
  ShoppingCart,
  Truck,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";

export function Sidebar() {
  const pathname = usePathname();
  const { isAuthenticated, username, logout, isLoading } = useAuth();
  const router = useRouter();
  const [redirectInProgress, setRedirectInProgress] = useState(false);

  // Handle authentication redirects
  useEffect(() => {
    // Skip if we're already handling a redirect or page is loading
    if (redirectInProgress || isLoading) {
      return;
    }

    // Only run on client-side
    if (typeof window === "undefined") {
      return;
    }

    // Only redirect if not on login or forgot-password page and not authenticated
    if (
      !isAuthenticated &&
      pathname !== "/login" &&
      pathname !== "/forgot-password"
    ) {
      setRedirectInProgress(true);
      router.push("/login");
    }
  }, [isAuthenticated, pathname, router, isLoading, redirectInProgress]);

  // Reset redirect flag when path changes
  useEffect(() => {
    setRedirectInProgress(false);
  }, [pathname]);

  // Don't show sidebar on login page or when redirect is in progress
  if (
    pathname === "/login" ||
    pathname === "/forgot-password" ||
    redirectInProgress
  ) {
    return null;
  }

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
  ];

  return (
    <div className="w-64 h-screen border-r bg-white overflow-auto flex flex-col">
      <div className="flex h-16 items-center justify-between border-b px-4">
        <h1 className="text-xl font-bold text-primary">WMS</h1>
        {isAuthenticated && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary cursor-pointer hover:bg-primary/20 transition-colors">
                <User className="h-4 w-4" />
              </div>
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
            </div>
            <div className="text-sm font-medium hidden md:block">
              {username}
            </div>
          </div>
        )}
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
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <route.icon className="h-5 w-5" />
            <span>{route.name}</span>
          </Link>
        ))}
      </nav>
      {isAuthenticated && (
        <div className="border-t p-4">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      )}
    </div>
  );
}
