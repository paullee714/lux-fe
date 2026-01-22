"use client";

import { useState, Suspense, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { EventList } from "@/components/events/event-list";
import { PageLoading } from "@/components/common/loading-spinner";
import { getEvents, getMyEvents } from "@/lib/api/events";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useAuthStore } from "@/stores";
import type { EventLocation } from "@/types/event";

// Event categories
const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "conference", label: "Conference" },
  { value: "workshop", label: "Workshop" },
  { value: "meetup", label: "Meetup" },
  { value: "webinar", label: "Webinar" },
  { value: "networking", label: "Networking" },
  { value: "party", label: "Party" },
  { value: "sports", label: "Sports" },
  { value: "music", label: "Music" },
  { value: "other", label: "Other" },
];

// Location types
const LOCATION_TYPES = [
  { value: "all", label: "All Locations" },
  { value: "online", label: "Online" },
  { value: "offline", label: "In-person" },
  { value: "hybrid", label: "Hybrid" },
];

// Status filter options
const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "upcoming", label: "Upcoming" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

function EventsContent() {
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const tab = searchParams.get("tab") || "all";

  // Filter states
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState<string>(searchParams.get("status") || "all");
  const [category, setCategory] = useState<string>(searchParams.get("category") || "all");
  const [locationType, setLocationType] = useState<string>(searchParams.get("location") || "all");
  const [dateFrom, setDateFrom] = useState<string>(searchParams.get("from") || "");
  const [dateTo, setDateTo] = useState<string>(searchParams.get("to") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(search, 300);
  const limit = 12;

  // Build filters object
  const buildFilters = useCallback(() => {
    const filters: Record<string, string | number | undefined> = {
      page,
      limit,
    };

    if (debouncedSearch) filters.search = debouncedSearch;
    if (status !== "all") {
      if (status === "upcoming") {
        filters.startFrom = new Date().toISOString();
        filters.status = "published";
      } else {
        filters.status = status;
      }
    }
    if (category !== "all") filters.category = category;
    if (locationType !== "all") filters.locationType = locationType as EventLocation["type"];
    if (dateFrom) filters.startFrom = new Date(dateFrom).toISOString();
    if (dateTo) filters.startTo = new Date(dateTo).toISOString();

    return filters;
  }, [debouncedSearch, status, category, locationType, dateFrom, dateTo, page, limit]);

  const {
    data: eventsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["events", tab, buildFilters()],
    queryFn: async () => {
      const filters = buildFilters();

      if (tab === "my") {
        return getMyEvents(filters);
      }
      return getEvents(filters);
    },
  });

  const events = eventsData?.data?.data || [];
  const meta = eventsData?.data?.meta;
  const totalPages = meta?.totalPages || 1;

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setCategory("all");
    setLocationType("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  // Count active filters
  const activeFilterCount = [
    status !== "all",
    category !== "all",
    locationType !== "all",
    dateFrom,
    dateTo,
  ].filter(Boolean).length;

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={tab === "my" ? "My Events" : "Events"}
        description={
          tab === "my"
            ? "Manage your created events"
            : "Discover and join events"
        }
        actions={
          isAuthenticated ? (
            <Button asChild>
              <Link href="/events/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </Button>
          ) : null
        }
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <Link
          href="/events"
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "all"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All Events
        </Link>
        {isAuthenticated && (
          <Link
            href="/events?tab=my"
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === "my"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            My Events
          </Link>
        )}
      </div>

      {/* Search and Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events by title, description..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
            {search && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                onClick={() => setSearch("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Status Filter */}
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Toggle Advanced Filters */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 h-5 w-5 rounded-full p-0 text-xs"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={category}
                    onValueChange={(value) => {
                      setCategory(value);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Type Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location Type</label>
                  <Select
                    value={locationType}
                    onValueChange={(value) => {
                      setLocationType(value);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATION_TYPES.map((loc) => (
                        <SelectItem key={loc.value} value={loc.value}>
                          {loc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date From */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">From Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => {
                        setDateFrom(e.target.value);
                        setPage(1);
                      }}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Date To */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">To Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => {
                        setDateTo(e.target.value);
                        setPage(1);
                      }}
                      min={dateFrom}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters Button */}
              {activeFilterCount > 0 && (
                <div className="mt-4 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="mr-2 h-4 w-4" />
                    Clear all filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Active Filter Tags */}
        {activeFilterCount > 0 && !showFilters && (
          <div className="flex flex-wrap gap-2">
            {status !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Status: {STATUS_OPTIONS.find((s) => s.value === status)?.label}
                <button
                  onClick={() => setStatus("all")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {category !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {CATEGORIES.find((c) => c.value === category)?.label}
                <button
                  onClick={() => setCategory("all")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {locationType !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {LOCATION_TYPES.find((l) => l.value === locationType)?.label}
                <button
                  onClick={() => setLocationType("all")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {dateFrom && (
              <Badge variant="secondary" className="gap-1">
                From: {dateFrom}
                <button
                  onClick={() => setDateFrom("")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {dateTo && (
              <Badge variant="secondary" className="gap-1">
                To: {dateTo}
                <button
                  onClick={() => setDateTo("")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      {meta && !isLoading && (
        <p className="text-sm text-muted-foreground">
          Showing {events.length} of {meta.total} events
          {debouncedSearch && ` for "${debouncedSearch}"`}
        </p>
      )}

      {/* Event List */}
      <EventList
        events={events}
        isLoading={isLoading}
        error={error?.message}
        onRetry={() => refetch()}
        emptyTitle={
          tab === "my"
            ? "No events created yet"
            : debouncedSearch
              ? "No events found"
              : "No events available"
        }
        emptyDescription={
          tab === "my"
            ? "Create your first event to get started."
            : debouncedSearch
              ? "Try adjusting your search terms or filters."
              : "Check back later for upcoming events."
        }
      />

      {/* Pagination */}
      {meta && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={!meta.hasPreviousPage}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  className="w-9"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={!meta.hasNextPage}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<PageLoading message="Loading events..." />}>
      <EventsContent />
    </Suspense>
  );
}
