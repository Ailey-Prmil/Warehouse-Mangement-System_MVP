"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Edit, Search, Trash } from "lucide-react";

// Define the PickingList type to match the database schema
interface PickingList {
  picklistId: string | number; // Allow number in case picklistId is numeric
  generatedAt: string | null; // Nullable as it may be auto-generated
  doneAt: string | null; // Nullable as it may not be set
}

export default function PickingListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pickingLists, setPickingLists] = useState<PickingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch picking lists from the API
  useEffect(() => {
    async function fetchPickingLists() {
      try {
        setLoading(true);
        const response = await fetch("/api/picking-list");
        if (!response.ok) {
          throw new Error("Failed to fetch picking lists");
        }
        const data: PickingList[] = await response.json();
        console.log("Fetched data:", data); // Log to inspect the response
        setPickingLists(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchPickingLists();
  }, []);

  const filteredPickingLists = pickingLists.filter((list) => {
    // Convert fields to strings and handle null/undefined
    const picklistId = String(list.picklistId || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    return picklistId.includes(search);
  });

  // Handle delete picking list
  const handleDelete = async (picklistId: string | number) => {
    if (!confirm("Are you sure you want to delete this picking list?")) return;

    try {
      const response = await fetch("/api/picking-list", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ picklistId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete picking list");
      }

      // Update state to remove the deleted picking list
      setPickingLists((prev) =>
        prev.filter((l) => l.picklistId !== picklistId)
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div className="container mx-auto py-6 pl-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Picking Lists</h1>
          <p className="text-muted-foreground">
            Manage order picking operations
          </p>
        </div>
        <Button asChild>
          <Link href="/picking-list/create">Create</Link>
        </Button>
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
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-600">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Picklist ID</TableHead>
                  <TableHead>Generated At</TableHead>
                  <TableHead>Done At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPickingLists.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No picking lists found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPickingLists.map((list) => (
                    <TableRow key={String(list.picklistId)}>
                      <TableCell className="text-center">
                        {String(list.picklistId)}
                      </TableCell>
                      <TableCell>
                        {list.generatedAt
                          ? new Date(list.generatedAt).toLocaleString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {list.doneAt
                          ? new Date(list.doneAt).toLocaleString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            list.doneAt
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {list.doneAt ? "Completed" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button asChild size="icon" variant="ghost">
                            <Link
                              href={`/picking-list/update?id=${list.picklistId}`}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(list.picklistId)}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
