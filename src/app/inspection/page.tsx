"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Edit, Search, Trash } from "lucide-react"

export default function InspectionPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Reduced mock data
  const inspections = [
    {
      InspectID: "I001",
      StockID: "ST001",
      InspectDate: "2023-05-10",
      DefectQuantity: 2,
      Reason: "Damaged packaging",
    },
  ]

  const filteredInspections = inspections.filter(
    (inspection) =>
      inspection.InspectID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.StockID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.Reason.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-6 pl-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inspections</h1>
          <p className="text-muted-foreground">Manage quality control inspections</p>
        </div>
        <Button asChild>
          <Link href="/inspection/create">Create</Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Search Inspections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by inspection ID, stock ID, or reason..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Inspect ID</TableHead>
                <TableHead>Stock ID</TableHead>
                <TableHead>Inspect Date</TableHead>
                <TableHead>Defect Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInspections.map((inspection) => (
                <TableRow key={inspection.InspectID}>
                  <TableCell className="font-medium">{inspection.InspectID}</TableCell>
                  <TableCell>{inspection.StockID}</TableCell>
                  <TableCell>{inspection.InspectDate}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        inspection.DefectQuantity === 0
                          ? "bg-green-100 text-green-800"
                          : inspection.DefectQuantity < 3
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {inspection.DefectQuantity}
                    </Badge>
                  </TableCell>
                  <TableCell>{inspection.Reason}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button asChild size="icon" variant="ghost">
                        <Link href={`/inspection/update?id=${inspection.InspectID}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-700">
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredInspections.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No inspections found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
