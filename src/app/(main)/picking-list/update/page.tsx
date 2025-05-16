"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { AlertCircle, CalendarIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ThemeProvider } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";
import { formatDateForDisplay } from "@/lib/date-utils";

// Define the PickingList type to match the database schema
interface PickingList {
  picklistId: string | number;
  generatedAt: string | null;
  doneAt: string | null;
}

export default function UpdatePickingListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const picklistId = searchParams.get("id");
  const { toast } = useToast();

  const [pickingList, setPickingList] = useState<PickingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchPickingList() {
      if (!picklistId) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/picking-list`);
        if (!response.ok) {
          throw new Error("Failed to fetch picking lists");
        }

        const data: PickingList[] = await response.json();
        const list = data.find(
          (item) => String(item.picklistId) === String(picklistId)
        );

        if (!list) {
          throw new Error("Picking list not found");
        }

        setPickingList(list);

        // If doneAt is set, populate the date state
        if (list.doneAt) {
          setDate(new Date(list.doneAt));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchPickingList();
  }, [picklistId]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickingList || submitting) return;

    try {
      setSubmitting(true);
      setError(null);

      // Ensure picklistId is a number for consistent comparison in the API
      const normalizedPicklistId = Number(pickingList.picklistId);
      if (isNaN(normalizedPicklistId)) {
        throw new Error(`Invalid picklistId: ${pickingList.picklistId}`);
      } // Make sure we have a valid date format if date exists
      let formattedDate = null;
      if (date) {
        try {
          formattedDate = date.toISOString();
          console.log("Formatted date:", formattedDate);
        } catch (err) {
          console.error("Error formatting date:", err);
          throw new Error(
            "Invalid date selected. Please choose a different date."
          );
        }
      }

      const requestData = {
        picklistId: normalizedPicklistId,
        doneAt: formattedDate,
      };

      console.log("Sending update request:", requestData);

      const response = await fetch("/api/picking-list", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();
      console.log("Response from server:", responseData);

      if (!response.ok) {
        throw new Error(
          responseData.error ||
            responseData.message ||
            "Failed to update picking list"
        );
      } // Show success toast and navigate back to the picking lists page
      toast({
        title: "Success",
        description:
          responseData.message || "Picking list updated successfully",
        variant: "default",
      });
      router.push("/picking-list");
      router.refresh();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);

      // Show error toast
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="container mx-auto py-6 pl-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Update Picking List</h1>
          <p className="text-muted-foreground">
            Mark a picking list as completed or update its details
          </p>
        </div>

        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Picking List #{picklistId}</CardTitle>
          </CardHeader>{" "}
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="generatedAt">
                  Generated At
                </label>{" "}
                <Input
                  id="generatedAt"
                  value={
                    formatDateForDisplay(pickingList?.generatedAt) || "N/A"
                  }
                  disabled
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Done At</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-md z-50">
                    {" "}
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        console.log("Date selected:", newDate);
                        if (newDate) {
                          setDate(newDate);
                          // Close popover on selection to improve UX
                          setTimeout(() => document.body.click(), 100);
                        }
                      }}
                      initialFocus
                      className="bg-white rounded-md p-3"
                      classNames={{
                        head_row: "flex justify-around w-full border-b",
                        head_cell:
                          "text-muted-foreground w-10 font-medium text-[0.8rem] text-center py-2",
                        row: "flex w-full mt-2 justify-around",
                        cell: "text-center text-sm p-0 relative w-10 h-10 flex items-center justify-center",
                        day: "h-9 w-9 p-0 font-normal hover:bg-accent hover:text-accent-foreground rounded-md",
                        day_selected:
                          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-bold",
                      }}
                      style={{ backgroundColor: "white" }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Updating..." : "Update Picking List"}
                </Button>{" "}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
}
