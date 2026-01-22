"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  Edit,
  Globe,
  Video,
  Trash2,
  Copy,
  Check,
  XCircle,
  Loader2,
  ExternalLink,
  Mail,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Event } from "@/types/event";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageLoading } from "@/components/common/loading-spinner";
import { ErrorState } from "@/components/common/error-state";
import { PostsSection } from "@/components/posts";
import {
  getEvent,
  cancelEvent,
  registerForEvent,
  unregisterFromEvent,
} from "@/lib/api/events";
import { useAuthStore } from "@/stores";
import { formatDate, formatTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  ongoing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  completed: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
};

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const {
    data: eventData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEvent(eventId),
  });

  // Register for event mutation
  const registerMutation = useMutation({
    mutationFn: () => registerForEvent(eventId),
    onSuccess: () => {
      toast.success("Successfully registered for the event!");
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to register for event");
    },
  });

  // Unregister from event mutation
  const unregisterMutation = useMutation({
    mutationFn: () => unregisterFromEvent(eventId),
    onSuccess: () => {
      toast.success("Successfully unregistered from the event");
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to unregister from event");
    },
  });

  // Cancel event mutation
  const cancelMutation = useMutation({
    mutationFn: (reason?: string) => cancelEvent(eventId, reason),
    onSuccess: () => {
      toast.success("Event has been cancelled");
      setShowCancelDialog(false);
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to cancel event");
    },
  });

  const event = eventData?.data;
  const isHost = event?.organizer_id === user?.id;
  const isRegistrationMutating = registerMutation.isPending || unregisterMutation.isPending;

  // Handle share functionality
  const handleShare = async (method: "copy" | "email" | "twitter") => {
    const eventUrl = `${window.location.origin}/events/${eventId}`;
    const shareText = `Check out this event: ${event?.title}`;

    switch (method) {
      case "copy":
        try {
          await navigator.clipboard.writeText(eventUrl);
          setLinkCopied(true);
          toast.success("Link copied to clipboard!");
          setTimeout(() => setLinkCopied(false), 2000);
        } catch {
          toast.error("Failed to copy link");
        }
        break;
      case "email":
        window.location.href = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(eventUrl)}`;
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(eventUrl)}`,
          "_blank"
        );
        break;
    }
  };

  if (isLoading) {
    return <PageLoading message="Loading event details..." />;
  }

  if (error || !event) {
    return (
      <ErrorState
        title="Event not found"
        message={error?.message || "The event you're looking for doesn't exist."}
        onRetry={() => refetch()}
      />
    );
  }

  const startDate = new Date(event.starts_at);
  const endDate = new Date(event.ends_at);
  const isPastEvent = endDate < new Date();
  const isCancelled = event.status === "cancelled";

  // Determine if event is online based on location field
  const isOnline = event.location?.toLowerCase().includes("online") || !event.venue_name;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/events">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Link>
      </Button>

      {/* Event Header */}
      <div className="relative overflow-hidden rounded-xl">
        {event.cover_image_url ? (
          <div className="relative aspect-[3/1] w-full">
            <Image
              src={event.cover_image_url}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        ) : (
          <div className="flex aspect-[3/1] w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <Calendar className="h-24 w-24 text-primary/30" />
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn(statusColors[event.status])}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </Badge>
            <Badge variant="secondary">
              {event.visibility === "public" ? (
                <>
                  <Globe className="mr-1 h-3 w-3" />
                  Public
                </>
              ) : event.visibility === "private" ? (
                "Private"
              ) : (
                "Invite Only"
              )}
            </Badge>
            {event.category && (
              <Badge variant="outline" className="border-white/50 text-white">
                {event.category}
              </Badge>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{event.title}</h1>
        </div>
      </div>

      {/* Cancelled Banner */}
      {isCancelled && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <XCircle className="h-5 w-5 text-destructive" />
          <div>
            <p className="font-medium text-destructive">This event has been cancelled</p>
            <p className="text-sm text-muted-foreground">
              The organizer has cancelled this event. Any registrations have been automatically removed.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About this event</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {event.description}
              </p>

              {event.tags && event.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isOnline ? (
                  <Video className="h-5 w-5" />
                ) : (
                  <MapPin className="h-5 w-5" />
                )}
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isOnline ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      <Video className="mr-1 h-3 w-3" />
                      Online Event
                    </Badge>
                  </div>
                  {event.location && (
                    <p className="text-sm text-muted-foreground">
                      {event.location}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  {event.venue_name && (
                    <p className="font-medium">{event.venue_name}</p>
                  )}
                  {event.address_line1 && (
                    <p className="text-sm text-muted-foreground">
                      {event.address_line1}
                    </p>
                  )}
                  {event.city && (
                    <p className="text-sm text-muted-foreground">
                      {event.city}
                      {event.country && `, ${event.country}`}
                    </p>
                  )}
                  {event.location && (
                    <p className="text-sm text-muted-foreground">
                      {event.location}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Posts Section */}
          <PostsSection
            eventId={eventId}
            eventTitle={event.title}
            isHost={isHost}
            isAuthenticated={isAuthenticated}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Date & Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Date & Time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{formatDate(startDate)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(startDate)} - {formatTime(endDate)}
                  </p>
                  {startDate.toDateString() !== endDate.toDateString() && (
                    <p className="text-sm text-muted-foreground">
                      to {formatDate(endDate)}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Timezone: {event.timezone}
              </p>
              {isPastEvent && (
                <Badge variant="secondary" className="w-full justify-center">
                  This event has ended
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Capacity & RSVP */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Registration
              </CardTitle>
              {event.capacity && (
                <CardDescription>
                  Capacity: {event.capacity} attendees
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {/* RSVP Button */}
              {!isAuthenticated ? (
                <Button className="w-full" asChild>
                  <Link href="/login">Sign in to Register</Link>
                </Button>
              ) : isHost ? (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/events/${event.id}/attendees`}>
                    <Users className="mr-2 h-4 w-4" />
                    Manage Event
                  </Link>
                </Button>
              ) : isCancelled ? (
                <Badge variant="destructive" className="w-full justify-center py-2">
                  Event Cancelled
                </Badge>
              ) : isPastEvent ? (
                <Badge variant="secondary" className="w-full justify-center py-2">
                  Registration Closed
                </Badge>
              ) : (
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => registerMutation.mutate()}
                    disabled={isRegistrationMutating}
                  >
                    {registerMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <UserPlus className="mr-2 h-4 w-4" />
                    )}
                    Register for Event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Event Info */}
          <Card>
            <CardHeader>
              <CardTitle>Event Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {event.category && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Category</span>
                  <Badge variant="outline">{event.category}</Badge>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Visibility</span>
                <span className="font-medium capitalize">{event.visibility.replace("_", " ")}</span>
              </div>
              {event.timezone && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Timezone</span>
                  <span className="font-medium">{event.timezone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {/* Share Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Event
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleShare("copy")}>
                  {linkCopied ? (
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  {linkCopied ? "Copied!" : "Copy Link"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("email")}>
                  <Mail className="mr-2 h-4 w-4" />
                  Share via Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("twitter")}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Share on Twitter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Host Actions */}
            {isHost && (
              <>
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/events/${event.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Event
                  </Link>
                </Button>

                {event.status !== "cancelled" && event.status !== "completed" && (
                  <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Cancel Event
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cancel Event</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to cancel this event? This action cannot be undone.
                          All registered attendees will be notified.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                          variant="outline"
                          onClick={() => setShowCancelDialog(false)}
                        >
                          Keep Event
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => cancelMutation.mutate(undefined)}
                          disabled={cancelMutation.isPending}
                        >
                          {cancelMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="mr-2 h-4 w-4" />
                          )}
                          Yes, Cancel Event
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
