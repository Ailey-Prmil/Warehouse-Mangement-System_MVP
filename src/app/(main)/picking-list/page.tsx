"use client";

import { useState, useEffect } from "react";
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
import { Search, Trash2, Edit } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { formatDateForDisplay } from "@/lib/date-utils";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch picking lists from the API
  useEffect(() => {
    fetchPickingLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchPickingLists() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/picking-list");
      if (!response.ok) {
        throw new Error("Failed to fetch picking lists");
      }
      const data: PickingList[] = await response.json();
      setPickingLists(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const filteredPickingLists = pickingLists.filter((list) => {
    // Convert fields to strings and handle null/undefined
    const picklistId = String(list.picklistId || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    return picklistId.includes(search);
  });
  // State for dialog control
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Handle create picking list
  const handleCreatePickingList = async () => {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/picking-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create picking list");
      }

      // Refresh the list
      await fetchPickingLists();

      // Show success toast
      toast({
        title: "Success",
        description: "New picking list created successfully",
        variant: "default",
      });

      // Close the dialog
      setCreateDialogOpen(false);
    } catch (err) {
      // Show error toast
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to create picking list",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  // State for update dialog control
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedPicklistId, setSelectedPicklistId] = useState<
    string | number | null
  >(null);

  // Handle update picking list (mark as completed)
  const handleUpdatePickingList = async (picklistId: string | number) => {
    try {
      setIsSubmitting(true);

      // Set the current date and time as doneAt
      const now = new Date();

      // Normalize the picklistId to a number
      const normalizedPicklistId = Number(picklistId);
      if (isNaN(normalizedPicklistId)) {
        throw new Error(`Invalid picklistId: ${picklistId}`);
      }

      const requestData = {
        picklistId: normalizedPicklistId,
        doneAt: now.toISOString(), // Current date and time
      };

      const response = await fetch("/api/picking-list", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error ||
            responseData.message ||
            "Failed to update picking list"
        );
      }

      // Refresh the list
      await fetchPickingLists();

      // Show success toast
      toast({
        title: "Success",
        description:
          responseData.message || "Picking list completed successfully",
        variant: "default",
      });

      // Close the dialog
      setUpdateDialogOpen(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";

      // Show error toast
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete picking list
  const handleDelete = async (picklistId: string | number) => {
    try {
      setIsDeleting(true);

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

      // Show success toast
      toast({
        title: "Success",
        description: "Picking list deleted successfully",
        variant: "default",
      });
    } catch (err) {
      // Show error toast
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to delete picking list",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 pl-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Picking Lists</h1>
          <p className="text-muted-foreground">
            Manage order picking operations{" "}
          </p>
        </div>
        {/* Create Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setCreateDialogOpen(true)}>Create</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Picking List</DialogTitle>
              <DialogDescription>
                Generate a new picking list for order fulfillment. The list will
                be created with the current timestamp.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreatePickingList} disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Picking List"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                  <TableHead>Completed At</TableHead>
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
                        {formatDateForDisplay(list.generatedAt) || "N/A"}
                      </TableCell>
                      <TableCell>
                        {formatDateForDisplay(list.doneAt) || "-"}
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
                      </TableCell>{" "}
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          {!list.doneAt && (
                            <Dialog
                              open={
                                updateDialogOpen &&
                                selectedPicklistId === list.picklistId
                              }
                              onOpenChange={(isOpen) => {
                                setUpdateDialogOpen(isOpen);
                                if (!isOpen) setSelectedPicklistId(null);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => {
                                    setUpdateDialogOpen(true);
                                    setSelectedPicklistId(list.picklistId);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Complete</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Complete Picking List
                                  </DialogTitle>
                                  <DialogDescription>
                                    Mark picking list #{String(list.picklistId)}{" "}
                                    as completed. This will record the current
                                    time as the completion time.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="flex justify-end gap-2 pt-4">
                                  <Button
                                    variant="outline"
                                    onClick={() => setUpdateDialogOpen(false)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleUpdatePickingList(list.picklistId)
                                    }
                                    disabled={isSubmitting}
                                  >
                                    {isSubmitting
                                      ? "Processing..."
                                      : "Confirm Completion"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}{" "}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-red-600 hover:text-red-800"
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
                                  Are you sure you want to delete this picking
                                  list? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(list.picklistId)}
                                  className="bg-red-600 hover:bg-red-700"
                                  disabled={isDeleting}
                                >
                                  {isDeleting ? "Deleting..." : "Delete"}
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
