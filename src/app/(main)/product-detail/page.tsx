"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"
import { BackButton } from "@/components/back-button"

// Mock data for products
const products = [
  {
    productId: "P001",
    name: "Wireless Headphones",
    sku: "WH-001",
    unitOfMeasure: "Each",
    createdAt: "2023-01-15",
    updatedAt: "2023-06-20",
    description: "High-quality wireless headphones with noise cancellation",
    category: "Electronics",
    price: 129.99,
    locations: [
      { locId: "L001", aisle: "A1", section: "S2", shelf: "SH3", quantity: 15 },
      { locId: "L005", aisle: "A2", section: "S1", shelf: "SH2", quantity: 30 },
    ],
    inspections: [
      { inspectId: "I001", date: "2023-05-10", defectQuantity: 2, reason: "Damaged packaging" },
      { inspectId: "I008", date: "2023-07-01", defectQuantity: 0, reason: "Routine check" },
    ],
  },
  {
    productId: "P002",
    name: "USB-C Cable",
    sku: "USB-C-001",
    unitOfMeasure: "Each",
    createdAt: "2023-02-10",
    updatedAt: "2023-05-15",
    description: "High-speed USB-C charging cable, 6ft length",
    category: "Accessories",
    price: 19.99,
    locations: [
      { locId: "L002", aisle: "A1", section: "S3", shelf: "SH1", quantity: 50 },
      { locId: "L007", aisle: "A3", section: "S2", shelf: "SH4", quantity: 70 },
    ],
    inspections: [{ inspectId: "I003", date: "2023-04-15", defectQuantity: 5, reason: "Quality control" }],
  },
  {
    productId: "P003",
    name: "Power Bank",
    sku: "PB-001",
    unitOfMeasure: "Each",
    createdAt: "2023-03-05",
    updatedAt: "2023-07-01",
    description: "10,000mAh portable power bank with dual USB ports",
    category: "Electronics",
    price: 49.99,
    locations: [
      { locId: "L003", aisle: "A2", section: "S1", shelf: "SH2", quantity: 20 },
      { locId: "L008", aisle: "A4", section: "S1", shelf: "SH1", quantity: 10 },
    ],
    inspections: [{ inspectId: "I005", date: "2023-06-20", defectQuantity: 1, reason: "Battery issue" }],
  },
]

export default function ProductDetailPage() {
  const searchParams = useSearchParams()
  const productId = searchParams.get("id")

  const product = products.find((p) => p.productId === productId)

  if (!product) {
    return (
      <div className="container mx-auto">
        <div className="flex items-center gap-2">
          <BackButton href="/product" />
        </div>
        <div className="mt-8 text-center">
          <h1 className="text-2xl font-bold">Product Not Found</h1>
          <p className="mt-2 text-muted-foreground">The product you are looking for does not exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <BackButton href="/product" />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Package className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">
              {product.sku} • {product.category}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Product ID</dt>
                <dd>{product.productId}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">SKU</dt>
                <dd>{product.sku}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Unit of Measure</dt>
                <dd>{product.unitOfMeasure}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Price</dt>
                <dd>${product.price.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
                <dd>{product.createdAt}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Updated At</dt>
                <dd>{product.updatedAt}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                <dd>{product.description}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Total Stock</div>
                <div className="mt-1 text-2xl font-bold">
                  {product.locations.reduce((sum, loc) => sum + loc.quantity, 0)}
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Locations</div>
                <div className="mt-1 text-2xl font-bold">{product.locations.length}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Inspections</div>
                <div className="mt-1 text-2xl font-bold">{product.inspections.length}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Defect Rate</div>
                <div className="mt-1 text-2xl font-bold">
                  {(
                    (product.inspections.reduce((sum, insp) => sum + insp.defectQuantity, 0) /
                      product.locations.reduce((sum, loc) => sum + loc.quantity, 0)) *
                    100
                  ).toFixed(1)}
                  %
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Location Bins</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location ID</TableHead>
                  <TableHead>Aisle</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Shelf</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.locations.map((location) => (
                  <TableRow key={location.locId}>
                    <TableCell className="font-medium">{location.locId}</TableCell>
                    <TableCell>{location.aisle}</TableCell>
                    <TableCell>{location.section}</TableCell>
                    <TableCell>{location.shelf}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          location.quantity > 30
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : location.quantity > 10
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {location.quantity}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inspection History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Inspection ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Defect Quantity</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.inspections.map((inspection) => (
                  <TableRow key={inspection.inspectId}>
                    <TableCell className="font-medium">{inspection.inspectId}</TableCell>
                    <TableCell>{inspection.date}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          inspection.defectQuantity === 0
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : inspection.defectQuantity < 3
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {inspection.defectQuantity}
                      </Badge>
                    </TableCell>
                    <TableCell>{inspection.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
