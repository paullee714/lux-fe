import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Users, Video, Globe } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { EventSummary } from "@/types/event";
import { formatDate, formatTime, getInitials } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: EventSummary;
  className?: string;
}

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  ongoing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  completed: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
};

const locationTypeLabels: Record<string, { label: string; icon: typeof MapPin }> = {
  online: { label: "Online", icon: Video },
  offline: { label: "In-person", icon: MapPin },
  hybrid: { label: "Hybrid", icon: Globe },
};

export function EventCard({ event, className }: EventCardProps) {
  const startDate = new Date(event.startDate);
  const isFull = event.maxAttendees
    ? event.currentAttendees >= event.maxAttendees
    : false;
  const isPast = new Date(event.endDate) < new Date();
  const LocationIcon = locationTypeLabels[event.location.type]?.icon || MapPin;

  return (
    <Link href={`/events/${event.id}`}>
      <Card
        className={cn(
          "group h-full overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5",
          isPast && "opacity-75",
          className
        )}
      >
        {/* Cover Image */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          {event.coverImage ? (
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <Calendar className="h-12 w-12 text-primary/40" />
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute right-2 top-2 flex flex-col gap-1">
            <Badge
              className={cn(statusColors[event.status])}
            >
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </Badge>
            {isFull && (
              <Badge variant="secondary">Full</Badge>
            )}
          </div>

          {/* Location Type Badge */}
          <Badge
            variant="secondary"
            className="absolute left-2 top-2 gap-1"
          >
            <LocationIcon className="h-3 w-3" />
            {locationTypeLabels[event.location.type]?.label}
          </Badge>
        </div>

        <CardHeader className="pb-2">
          <h3 className="line-clamp-2 text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
            {event.title}
          </h3>
        </CardHeader>

        <CardContent className="space-y-2.5 pb-3">
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {formatDate(startDate)} at {formatTime(startDate)}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LocationIcon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {event.location.type === "online"
                ? "Online Event"
                : event.location.venue
                  ? `${event.location.venue}${event.location.city ? `, ${event.location.city}` : ""}`
                  : event.location.city || "Location TBA"}
            </span>
          </div>

          {/* Attendees */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 flex-shrink-0" />
            <span>
              {event.currentAttendees}
              {event.maxAttendees ? ` / ${event.maxAttendees}` : ""} attendees
            </span>
          </div>
        </CardContent>

        <CardFooter className="border-t pt-3">
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="h-6 w-6 flex-shrink-0">
                <AvatarImage src={event.host.profileImage} alt={event.host.name} />
                <AvatarFallback className="text-xs">
                  {getInitials(event.host.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground truncate">
                {event.host.name}
              </span>
            </div>
            {isPast && (
              <Badge variant="outline" className="text-xs flex-shrink-0">
                Past
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

// Skeleton loader for EventCard
export function EventCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video animate-pulse bg-muted" />
      <CardHeader className="pb-2">
        <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent className="space-y-2.5 pb-3">
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
      </CardContent>
      <CardFooter className="border-t pt-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>
      </CardFooter>
    </Card>
  );
}
