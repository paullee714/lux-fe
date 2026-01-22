"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import {
  ArrowLeft,
  Loader2,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Lock,
  Eye,
  Users,
  Tag,
  Image as ImageIcon,
  Video,
  Plus,
  X,
  Save,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { createEvent, publishEvent } from "@/lib/api/events";
import { cn } from "@/lib/utils";
import type { CreateEventRequest, EventVisibility } from "@/types/event";

// Event categories
const CATEGORIES = [
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

// Timezones (commonly used)
const TIMEZONES = [
  { value: "Asia/Seoul", label: "Korea (KST, UTC+9)" },
  { value: "Asia/Tokyo", label: "Japan (JST, UTC+9)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Central European (CET)" },
  { value: "UTC", label: "UTC" },
];

// Form validation schema
const createEventFormSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title must be less than 100 characters"),
    description: z
      .string()
      .min(1, "Description is required")
      .min(10, "Description must be at least 10 characters")
      .max(5000, "Description must be less than 5000 characters"),
    coverImage: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    startDate: z.string().min(1, "Start date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endDate: z.string().min(1, "End date is required"),
    endTime: z.string().min(1, "End time is required"),
    timezone: z.string().min(1, "Timezone is required"),
    locationType: z.enum(["online", "offline", "hybrid"]),
    venue: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    onlineUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    onlinePlatform: z.string().optional(),
    visibility: z.enum(["public", "private", "invite_only"]),
    maxAttendees: z.number().int().positive().optional().nullable(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    allowComments: z.boolean(),
    allowGuests: z.boolean(),
    requireApproval: z.boolean(),
    sendReminders: z.boolean(),
  })
  .refine(
    (data) => {
      const start = new Date(`${data.startDate}T${data.startTime}`);
      const end = new Date(`${data.endDate}T${data.endTime}`);
      return end > start;
    },
    {
      message: "End date/time must be after start date/time",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      const start = new Date(`${data.startDate}T${data.startTime}`);
      return start > new Date();
    },
    {
      message: "Start date/time must be in the future",
      path: ["startDate"],
    }
  )
  .refine(
    (data) => {
      if (data.locationType === "offline" || data.locationType === "hybrid") {
        return !!data.venue && data.venue.trim().length > 0;
      }
      return true;
    },
    {
      message: "Venue is required for in-person events",
      path: ["venue"],
    }
  )
  .refine(
    (data) => {
      if (data.locationType === "online" || data.locationType === "hybrid") {
        return !!data.onlineUrl && data.onlineUrl.trim().length > 0;
      }
      return true;
    },
    {
      message: "Online URL is required for online/hybrid events",
      path: ["onlineUrl"],
    }
  );

type CreateEventFormValues = z.infer<typeof createEventFormSchema>;

export default function CreateEventPage() {
  const router = useRouter();
  const [tagInput, setTagInput] = useState("");
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [shouldPublish, setShouldPublish] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      coverImage: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      timezone: "Asia/Seoul",
      locationType: "offline",
      venue: "",
      address: "",
      city: "",
      country: "",
      onlineUrl: "",
      onlinePlatform: "",
      visibility: "public",
      maxAttendees: null,
      category: "",
      tags: [],
      allowComments: true,
      allowGuests: false,
      requireApproval: false,
      sendReminders: true,
    },
  });

  const locationType = watch("locationType");
  const tags = watch("tags") || [];

  // Create event mutation
  const createMutation = useMutation({
    mutationFn: async (data: { eventData: CreateEventRequest; publish: boolean }) => {
      const response = await createEvent(data.eventData);
      if (data.publish && response.data?.id) {
        await publishEvent(response.data.id);
      }
      return response;
    },
    onSuccess: (response, variables) => {
      toast.success(
        variables.publish
          ? "Event created and published successfully!"
          : "Event saved as draft"
      );
      router.push(`/events/${response.data?.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create event");
    },
  });

  // Handle form submission
  const onSubmit = async (data: CreateEventFormValues) => {
    // Build location string based on type
    let locationStr: string | undefined;
    if (data.locationType === "online") {
      locationStr = data.onlinePlatform || "Online";
    } else if (data.locationType === "hybrid") {
      locationStr = `${data.venue || ""} / Online`.trim();
    } else {
      locationStr = data.venue || undefined;
    }

    const eventData: CreateEventRequest = {
      title: data.title,
      description: data.description || undefined,
      location: locationStr,
      venue_name: data.venue || undefined,
      address_line1: data.address || undefined,
      city: data.city || undefined,
      country: data.country || undefined,
      timezone: data.timezone,
      starts_at: new Date(`${data.startDate}T${data.startTime}`).toISOString(),
      ends_at: new Date(`${data.endDate}T${data.endTime}`).toISOString(),
      capacity: data.maxAttendees || undefined,
      cover_image_url: data.coverImage || undefined,
      visibility: data.visibility as EventVisibility,
      category: data.category || undefined,
      tags: data.tags && data.tags.length > 0 ? data.tags : undefined,
    };

    createMutation.mutate({ eventData, publish: shouldPublish });
  };

  // Handle tag addition
  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      setValue("tags", [...tags, trimmedTag]);
      setTagInput("");
    }
  };

  // Handle tag removal
  const removeTag = (tagToRemove: string) => {
    setValue("tags", tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle cover image URL change
  const handleCoverImageChange = (url: string) => {
    setValue("coverImage", url);
    setCoverImagePreview(url || null);
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/events">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Link>
      </Button>

      <PageHeader
        title="Create Event"
        description="Fill in the details to create a new event"
      />

      <form className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Provide the essential details about your event
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Event Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Enter a catchy title for your event"
                {...register("title")}
                className={cn(errors.title && "border-destructive")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your event, what attendees can expect, agenda, etc."
                rows={6}
                {...register("description")}
                className={cn(errors.description && "border-destructive")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Minimum 10 characters. Support line breaks for formatting.
              </p>
            </div>

            {/* Cover Image URL */}
            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="coverImage"
                    placeholder="https://example.com/image.jpg"
                    {...register("coverImage")}
                    onChange={(e) => handleCoverImageChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              {errors.coverImage && (
                <p className="text-sm text-destructive">{errors.coverImage.message}</p>
              )}
              {coverImagePreview && (
                <div className="relative mt-2 aspect-video w-full max-w-md overflow-hidden rounded-lg border">
                  <img
                    src={coverImagePreview}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                    onError={() => setCoverImagePreview(null)}
                  />
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Provide a URL to an image for your event cover. Recommended: 1200x630px
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Add a tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    className="pl-10"
                  />
                </div>
                <Button type="button" variant="secondary" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Add up to 10 tags to help people discover your event
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Date & Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Date & Time
            </CardTitle>
            <CardDescription>
              When will your event take place?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Start Date <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="startDate"
                    type="date"
                    {...register("startDate")}
                    min={new Date().toISOString().split("T")[0]}
                    className={cn("pl-10", errors.startDate && "border-destructive")}
                  />
                </div>
                {errors.startDate && (
                  <p className="text-sm text-destructive">{errors.startDate.message}</p>
                )}
              </div>

              {/* Start Time */}
              <div className="space-y-2">
                <Label htmlFor="startTime">
                  Start Time <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="startTime"
                    type="time"
                    {...register("startTime")}
                    className={cn("pl-10", errors.startTime && "border-destructive")}
                  />
                </div>
                {errors.startTime && (
                  <p className="text-sm text-destructive">{errors.startTime.message}</p>
                )}
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label htmlFor="endDate">
                  End Date <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="endDate"
                    type="date"
                    {...register("endDate")}
                    min={watch("startDate") || new Date().toISOString().split("T")[0]}
                    className={cn("pl-10", errors.endDate && "border-destructive")}
                  />
                </div>
                {errors.endDate && (
                  <p className="text-sm text-destructive">{errors.endDate.message}</p>
                )}
              </div>

              {/* End Time */}
              <div className="space-y-2">
                <Label htmlFor="endTime">
                  End Time <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="endTime"
                    type="time"
                    {...register("endTime")}
                    className={cn("pl-10", errors.endTime && "border-destructive")}
                  />
                </div>
                {errors.endTime && (
                  <p className="text-sm text-destructive">{errors.endTime.message}</p>
                )}
              </div>
            </div>

            {/* Timezone */}
            <div className="space-y-2">
              <Label htmlFor="timezone">
                Timezone <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="timezone"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <Globe className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location
            </CardTitle>
            <CardDescription>
              Where will your event take place?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Location Type */}
            <div className="space-y-2">
              <Label>Location Type <span className="text-destructive">*</span></Label>
              <Controller
                name="locationType"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-3 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => field.onChange("offline")}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors",
                        field.value === "offline"
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50"
                      )}
                    >
                      <MapPin className="h-6 w-6" />
                      <span className="text-sm font-medium">In-person</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange("online")}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors",
                        field.value === "online"
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50"
                      )}
                    >
                      <Video className="h-6 w-6" />
                      <span className="text-sm font-medium">Online</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange("hybrid")}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors",
                        field.value === "hybrid"
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50"
                      )}
                    >
                      <Globe className="h-6 w-6" />
                      <span className="text-sm font-medium">Hybrid</span>
                    </button>
                  </div>
                )}
              />
            </div>

            {/* Physical Location Fields */}
            {(locationType === "offline" || locationType === "hybrid") && (
              <div className="space-y-4 rounded-lg border p-4">
                <h4 className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Physical Location
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="venue">
                      Venue Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="venue"
                      placeholder="e.g., Grand Conference Center"
                      {...register("venue")}
                      className={cn(errors.venue && "border-destructive")}
                    />
                    {errors.venue && (
                      <p className="text-sm text-destructive">{errors.venue.message}</p>
                    )}
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Street address"
                      {...register("address")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      {...register("city")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="Country"
                      {...register("country")}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Online Location Fields */}
            {(locationType === "online" || locationType === "hybrid") && (
              <div className="space-y-4 rounded-lg border p-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Online Details
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="onlineUrl">
                      Meeting URL <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="onlineUrl"
                      placeholder="https://zoom.us/j/..."
                      {...register("onlineUrl")}
                      className={cn(errors.onlineUrl && "border-destructive")}
                    />
                    {errors.onlineUrl && (
                      <p className="text-sm text-destructive">{errors.onlineUrl.message}</p>
                    )}
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="onlinePlatform">Platform</Label>
                    <Input
                      id="onlinePlatform"
                      placeholder="e.g., Zoom, Google Meet, Teams"
                      {...register("onlinePlatform")}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visibility & Capacity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Visibility & Capacity
            </CardTitle>
            <CardDescription>
              Control who can see and join your event
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Visibility */}
            <div className="space-y-2">
              <Label>Event Visibility</Label>
              <Controller
                name="visibility"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-3 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => field.onChange("public")}
                      className={cn(
                        "flex flex-col items-start gap-1 rounded-lg border-2 p-4 text-left transition-colors",
                        field.value === "public"
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span className="font-medium">Public</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Anyone can find and join
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange("invite_only")}
                      className={cn(
                        "flex flex-col items-start gap-1 rounded-lg border-2 p-4 text-left transition-colors",
                        field.value === "invite_only"
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span className="font-medium">Invite Only</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Only invited people can join
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange("private")}
                      className={cn(
                        "flex flex-col items-start gap-1 rounded-lg border-2 p-4 text-left transition-colors",
                        field.value === "private"
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        <span className="font-medium">Private</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Invite only
                      </span>
                    </button>
                  </div>
                )}
              />
            </div>

            {/* Max Attendees */}
            <div className="space-y-2">
              <Label htmlFor="maxAttendees">Maximum Attendees</Label>
              <div className="relative max-w-xs">
                <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="maxAttendees"
                  type="number"
                  placeholder="Unlimited"
                  min={1}
                  {...register("maxAttendees", {
                    setValueAs: (v) => (v === "" ? null : parseInt(v, 10)),
                  })}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty for unlimited capacity
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Event Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Event Settings</CardTitle>
            <CardDescription>
              Configure additional options for your event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  {...register("allowComments")}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div>
                  <span className="font-medium">Allow Comments</span>
                  <p className="text-xs text-muted-foreground">
                    Attendees can post comments on the event
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  {...register("allowGuests")}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div>
                  <span className="font-medium">Allow Guests</span>
                  <p className="text-xs text-muted-foreground">
                    Attendees can bring additional guests
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  {...register("requireApproval")}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div>
                  <span className="font-medium">Require Approval</span>
                  <p className="text-xs text-muted-foreground">
                    Manually approve each registration
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  {...register("sendReminders")}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div>
                  <span className="font-medium">Send Reminders</span>
                  <p className="text-xs text-muted-foreground">
                    Email attendees before the event
                  </p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setShouldPublish(false);
              handleSubmit(onSubmit)();
            }}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending && !shouldPublish ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save as Draft
          </Button>
          <Button
            type="button"
            onClick={() => {
              setShouldPublish(true);
              handleSubmit(onSubmit)();
            }}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending && shouldPublish ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Publish Event
          </Button>
        </div>
      </form>
    </div>
  );
}
