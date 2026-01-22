"use client";

import { Calendar } from "lucide-react";
import { EventCard, EventCardSkeleton } from "./event-card";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { EventSummary } from "@/types/event";

interface EventListProps {
  events: EventSummary[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  showCreateButton?: boolean;
}

export function EventList({
  events,
  isLoading,
  error,
  onRetry,
  emptyTitle = "No events found",
  emptyDescription = "There are no events to display at the moment.",
  showCreateButton = true,
}: EventListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load events"
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (events.length === 0) {
    return (
      <EmptyState
        icon={<Calendar className="h-8 w-8 text-muted-foreground" />}
        title={emptyTitle}
        description={emptyDescription}
        action={
          showCreateButton ? (
            <Button asChild>
              <Link href="/events/create">Create Event</Link>
            </Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
