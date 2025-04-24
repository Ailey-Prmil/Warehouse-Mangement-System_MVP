"use client";

import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { isAuthenticated, username } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {isAuthenticated ? (
        <div>
          <p className="text-lg mb-4">
            Welcome, <span className="font-semibold">{username}</span>!
          </p>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Warehouse Management System
            </h2>
            <p className="text-gray-600 mb-4">
              Use the sidebar to navigate to different sections of the
              application.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <h3 className="font-medium text-blue-800">Products</h3>
                <p className="text-sm text-blue-600 mt-1">
                  Manage your inventory items
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-md border border-green-100">
                <h3 className="font-medium text-green-800">Orders</h3>
                <p className="text-sm text-green-600 mt-1">
                  Track customer and purchase orders
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-md border border-purple-100">
                <h3 className="font-medium text-purple-800">Shipments</h3>
                <p className="text-sm text-purple-600 mt-1">
                  Monitor inbound and outbound shipments
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100 text-yellow-800">
          Please log in to access the dashboard.
        </div>
      )}
    </div>
  );
}
