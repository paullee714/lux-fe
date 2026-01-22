import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Users, Video, Globe, Clock, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EventSummary } from "@/types/event";
import { formatDate, formatTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: EventSummary;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className: "bg-muted/80 text-muted-foreground border-muted-foreground/20",
  },
  published: {
    label: "Open",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  },
  ongoing: {
    label: "Live",
    className: "bg-blue-500/10 text-blue-600 border-blue-500/30 dark:text-blue-400",
  },
  completed: {
    label: "Ended",
    className: "bg-gray-500/10 text-gray-600 border-gray-500/30 dark:text-gray-400",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-500/10 text-red-600 border-red-500/30 dark:text-red-400",
  },
};

export function EventCard({ event, className }: EventCardProps) {
  const startDate = new Date(event.starts_at);
  const isPast = new Date(event.ends_at) < new Date();
  const status = statusConfig[event.status] || statusConfig.draft;

  // Determine location type based on fields
  const isOnline = event.location?.toLowerCase().includes("online") || !event.venue_name;
  const LocationIcon = isOnline ? Video : MapPin;
  const locationColor = isOnline ? "text-blue-500" : "text-emerald-500";

  // Build location display string
  const locationDisplay = event.venue_name
    ? `${event.venue_name}${event.city ? `, ${event.city}` : ""}`
    : event.location || "Location TBA";

  return (
    <Link href={`/events/${event.id}`}>
      <Card
        className={cn(
          "group relative h-full overflow-hidden border-border/40 transition-all duration-300",
          "hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1",
          isPast && "opacity-70 hover:opacity-90",
          className
        )}
      >
        {/* Cover Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {event.cover_image_url ? (
            <Image
              src={event.cover_image_url}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-primary/5">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-xl" />
                <Calendar className="relative h-14 w-14 text-primary/50" />
              </div>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />

          {/* Top badges */}
          <div className="absolute left-3 right-3 top-3 flex items-start justify-between">
            {/* Location type badge */}
            <Badge
              variant="secondary"
              className="gap-1.5 border bg-white/90 text-xs font-medium backdrop-blur-sm dark:bg-black/60"
            >
              <LocationIcon className={cn("h-3 w-3", locationColor)} />
              {isOnline ? "Online" : "In-person"}
            </Badge>

            {/* Status badge */}
            <Badge className={cn("border text-xs font-semibold", status.className)}>
              {event.status === "ongoing" && (
                <span className="relative mr-1.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
                </span>
              )}
              {status.label}
            </Badge>
          </div>

          {/* Date overlay at bottom of image */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur-sm">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-medium text-white">
              {formatDate(startDate)} at {formatTime(startDate)}
            </span>
          </div>
        </div>

        <CardHeader className="pb-3 pt-4">
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
            {event.title}
          </h3>
        </CardHeader>

        <CardContent className="space-y-3 pb-4">
          {/* Location */}
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-muted/50">
              <LocationIcon className={cn("h-4 w-4", locationColor)} />
            </div>
            <span className="truncate">{locationDisplay}</span>
          </div>

          {/* Capacity */}
          {event.capacity && (
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-muted/50">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <span>Capacity: {event.capacity}</span>
            </div>
          )}

          {/* Category */}
          {event.category && (
            <Badge variant="outline" className="text-xs">
              {event.category}
            </Badge>
          )}
        </CardContent>

        <CardFooter className="border-t border-border/50 pt-4">
          <div className="flex w-full items-center justify-between gap-2">
            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {event.tags?.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* View indicator */}
            <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
              <span>View</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </CardFooter>

        {/* Past event overlay */}
        {isPast && (
          <div className="absolute right-3 top-3">
            <Badge variant="outline" className="border-white/30 bg-black/40 text-xs text-white backdrop-blur-sm">
              Past Event
            </Badge>
          </div>
        )}
      </Card>
    </Link>
  );
}

// Enhanced skeleton loader for EventCard
export function EventCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[16/10] bg-muted">
        <div className="absolute inset-0 shimmer" />
      </div>
      <CardHeader className="pb-3 pt-4">
        <div className="h-6 w-4/5 rounded-lg bg-muted" />
        <div className="mt-2 h-5 w-3/5 rounded-lg bg-muted" />
      </CardHeader>
      <CardContent className="space-y-3 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-muted" />
          <div className="h-4 w-32 rounded bg-muted" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-muted" />
          <div className="h-4 w-24 rounded bg-muted" />
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-16 rounded bg-muted" />
          <div className="h-5 w-16 rounded bg-muted" />
        </div>
      </CardFooter>
    </Card>
  );
}
