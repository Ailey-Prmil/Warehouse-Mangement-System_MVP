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
import { Edit, Search, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Define the Inspection type to match the database schema
interface Inspection {
  inspectId: string | number; // Allow number in case inspectId is numeric
  stockId: string | number;
  inspectTime: string | null; // Nullable as it may not always be set
  defectQuantity: number;
  reason: string | null; // Nullable as it’s optional
}

export default function InspectionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);

  // Fetch inspections from the API
  useEffect(() => {
    async function fetchInspections() {
      try {
        setLoading(true);
        const response = await fetch("/api/inspection");
        if (!response.ok) {
          throw new Error("Failed to fetch inspections");
        }
        const data: Inspection[] = await response.json();
        console.log("Fetched data:", data); // Log to inspect the response
        setInspections(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchInspections();
  }, []);

  const filteredInspections = inspections.filter((inspection) => {
    // Convert fields to strings and handle null/undefined
    const inspectId = String(inspection.inspectId || "").toLowerCase();
    const stockId = String(inspection.stockId || "").toLowerCase();
    const reason = String(inspection.reason || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    return (
      inspectId.includes(search) ||
      stockId.includes(search) ||
      reason.includes(search)
    );
  });
  // Handle delete inspection
  const handleDelete = async () => {
    if (deleteId === null) return;

    try {
      const response = await fetch("/api/inspection", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inspectId: deleteId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete inspection");
      }

      // Update state to remove the deleted inspection
      setInspections((prev) => prev.filter((i) => i.inspectId !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div className="container mx-auto py-6 pl-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inspections</h1>
          <p className="text-muted-foreground">
            Manage quality control inspections
          </p>
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
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-600">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Inspect ID</TableHead>
                  <TableHead>Stock ID</TableHead>
                  <TableHead>Inspect Time</TableHead>
                  <TableHead>Defect Quantity</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInspections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No inspections found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInspections.map((inspection) => (
                    <TableRow key={String(inspection.inspectId)}>
                      <TableCell className="text-center">
                        {String(inspection.inspectId)}
                      </TableCell>
                      <TableCell>{String(inspection.stockId)}</TableCell>
                      <TableCell>
                        {inspection.inspectTime
                          ? new Date(
                              inspection.inspectTime
                            ).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            inspection.defectQuantity === 0
                              ? "bg-green-100 text-green-800"
                              : inspection.defectQuantity < 3
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {inspection.defectQuantity}
                        </Badge>
                      </TableCell>
                      <TableCell>{inspection.reason || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button asChild size="icon" variant="ghost">
                            <Link
                              href={`/inspection/update?id=${inspection.inspectId}`}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>{" "}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-red-600 hover:text-red-800"
                                onClick={() =>
                                  setDeleteId(inspection.inspectId)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Confirm Deletion
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this
                                  inspection? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDelete}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
