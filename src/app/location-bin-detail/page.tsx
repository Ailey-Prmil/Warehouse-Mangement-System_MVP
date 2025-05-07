"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Layers } from "lucide-react"
import { BackButton } from "@/components/back-button"

// Mock data for location bins
const locationBins = [
  {
    locId: "L001",
    aisle: "A1",
    section: "S2",
    shelf: "SH3",
    capacity: 50,
    used: 15,
    stocks: [{ stockId: "ST001", productId: "P001", productName: "Wireless Headphones", quantity: 15 }],
  },
  {
    locId: "L002",
    aisle: "A1",
    section: "S3",
    shelf: "SH1",
    capacity: 100,
    used: 50,
    stocks: [{ stockId: "ST002", productId: "P002", productName: "USB-C Cable", quantity: 50 }],
  },
  {
    locId: "L003",
    aisle: "A2",
    section: "S1",
    shelf: "SH2",
    capacity: 75,
    used: 20,
    stocks: [{ stockId: "ST003", productId: "P003", productName: "Power Bank", quantity: 20 }],
  },
  {
    locId: "L004",
    aisle: "A2",
    section: "S2",
    shelf: "SH1",
    capacity: 60,
    used: 60,
    stocks: [
      { stockId: "ST004", productId: "P004", productName: "Bluetooth Speaker", quantity: 25 },
      { stockId: "ST005", productId: "P005", productName: "Laptop Stand", quantity: 35 },
    ],
  },
  {
    locId: "L005",
    aisle: "A2",
    section: "S1",
    shelf: "SH2",
    capacity: 80,
    used: 30,
    stocks: [{ stockId: "ST006", productId: "P001", productName: "Wireless Headphones", quantity: 30 }],
  },
  {
    locId: "L006",
    aisle: "A3",
    section: "S1",
    shelf: "SH3",
    capacity: 120,
    used: 90,
    stocks: [
      { stockId: "ST007", productId: "P006", productName: "Wireless Mouse", quantity: 45 },
      { stockId: "ST008", productId: "P007", productName: "HDMI Cable", quantity: 45 },
    ],
  },
  {
    locId: "L007",
    aisle: "A3",
    section: "S2",
    shelf: "SH4",
    capacity: 200,
    used: 70,
    stocks: [{ stockId: "ST009", productId: "P002", productName: "USB-C Cable", quantity: 70 }],
  },
  {
    locId: "L008",
    aisle: "A4",
    section: "S1",
    shelf: "SH1",
    capacity: 50,
    used: 10,
    stocks: [{ stockId: "ST010", productId: "P003", productName: "Power Bank", quantity: 10 }],
  },
]

export default function LocationBinDetailPage() {
  const searchParams = useSearchParams()
  const locationId = searchParams.get("id")

  const location = locationBins.find((loc) => loc.locId === locationId)

  if (!location) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-2">
          <BackButton href="/location-bin" />
        </div>
        <div className="mt-8 text-center">
          <h1 className="text-2xl font-bold">Location Not Found</h1>
          <p className="mt-2 text-muted-foreground">The location bin you are looking for does not exist.</p>
        </div>
      </div>
    )
  }

  const utilizationPercentage = Math.round((location.used / location.capacity) * 100)

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <BackButton href="/location-bin" />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Layers className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Location {location.locId}</h1>
            <p className="text-muted-foreground">
              Aisle {location.aisle} • Section {location.section} • Shelf {location.shelf}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Location Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Location ID</dt>
                <dd>{location.locId}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Aisle</dt>
                <dd>{location.aisle}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Section</dt>
                <dd>{location.section}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Shelf</dt>
                <dd>{location.shelf}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Capacity</dt>
                <dd>{location.capacity} units</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Used</dt>
                <dd>{location.used} units</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-gray-100">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(${
                      utilizationPercentage < 50 ? "#22c55e" : utilizationPercentage < 80 ? "#eab308" : "#ef4444"
                    } ${utilizationPercentage}%, transparent 0)`,
                    clipPath: "circle(50% at center)",
                  }}
                />
                <div className="relative z-10 flex h-32 w-32 items-center justify-center rounded-full bg-white">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{utilizationPercentage}%</div>
                    <div className="text-xs text-muted-foreground">Utilized</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid w-full grid-cols-3 gap-2 text-center">
                <div className="rounded-lg border p-2">
                  <div className="text-sm font-medium text-muted-foreground">Capacity</div>
                  <div className="text-xl font-bold">{location.capacity}</div>
                </div>
                <div className="rounded-lg border p-2">
                  <div className="text-sm font-medium text-muted-foreground">Used</div>
                  <div className="text-xl font-bold">{location.used}</div>
                </div>
                <div className="rounded-lg border p-2">
                  <div className="text-sm font-medium text-muted-foreground">Available</div>
                  <div className="text-xl font-bold">{location.capacity - location.used}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Stored Products</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stock ID</TableHead>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {location.stocks.map((stock) => (
                  <TableRow key={stock.stockId}>
                    <TableCell className="font-medium">{stock.stockId}</TableCell>
                    <TableCell>{stock.productId}</TableCell>
                    <TableCell>{stock.productName}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          stock.quantity > 30
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : stock.quantity > 10
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {stock.quantity}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {location.stocks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No products stored in this location
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
