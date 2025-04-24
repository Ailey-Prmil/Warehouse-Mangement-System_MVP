"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function PickingListPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data for picking lists
  const pickingLists = [
    {
      PicklistID: "PL001",
      GeneratedAt: "2023-06-20 09:15:00",
      DoneAt: "2023-06-20 11:30:00",
    },
    {
      PicklistID: "PL002",
      GeneratedAt: "2023-06-25 10:20:00",
      DoneAt: "2023-06-25 13:45:00",
    },
    {
      PicklistID: "PL003",
      GeneratedAt: "2023-07-01 08:30:00",
      DoneAt: null, // Not completed yet
    },
  ]

  const filteredPickingLists = pickingLists.filter((list) =>
    list.PicklistID.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-6 pl-6">
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold">Picking Lists</h1>
          <p className="text-muted-foreground">Manage order picking operations</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Search Picking Lists</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by picking list ID..."
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
                <TableHead>Picklist ID</TableHead>
                <TableHead>Generated At</TableHead>
                <TableHead>Done At</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPickingLists.map((list) => (
                <TableRow key={list.PicklistID}>
                  <TableCell className="font-medium">{list.PicklistID}</TableCell>
                  <TableCell>{list.GeneratedAt}</TableCell>
                  <TableCell>{list.DoneAt || "-"}</TableCell>
                  <TableCell>
                    <Badge className={list.DoneAt ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                      {list.DoneAt ? "Completed" : "Pending"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPickingLists.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No picking lists found.
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
