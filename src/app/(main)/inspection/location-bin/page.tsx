"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, Search } from "lucide-react"

// Reduced mock data
const locationBins = [
  {
    locId: "L001",
    aisle: "A1",
    section: "S2",
    shelf: "SH3",
    capacity: 50,
    used: 15,
  },
]

export default function LocationBinPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredLocations = locationBins.filter(
    (location) =>
      location.locId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.aisle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.shelf.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-6 pl-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Location Bins</h1>
        <p className="text-muted-foreground">Manage warehouse storage locations</p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Location Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by location ID, aisle, section, or shelf..."
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
                <TableHead>Location ID</TableHead>
                <TableHead>Aisle</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Shelf</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLocations.map((location) => (
                <TableRow key={location.locId}>
                  <TableCell className="font-medium">{location.locId}</TableCell>
                  <TableCell>{location.aisle}</TableCell>
                  <TableCell>{location.section}</TableCell>
                  <TableCell>{location.shelf}</TableCell>
                  <TableCell>{location.capacity}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full ${
                            (location.used / location.capacity) * 100 < 50
                              ? "bg-green-500"
                              : (location.used / location.capacity) * 100 < 80
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${(location.used / location.capacity) * 100}%` }}
                        />
                      </div>
                      <Badge
                        className={
                          (location.used / location.capacity) * 100 < 50
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : (location.used / location.capacity) * 100 < 80
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {Math.round((location.used / location.capacity) * 100)}%
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Button asChild size="icon" variant="ghost">
                        <Link href={`/location-bin-detail?id=${location.locId}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
