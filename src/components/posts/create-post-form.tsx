"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  Plus,
  MessageSquare,
  Megaphone,
  Bell,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPost, updatePost } from "@/lib/api/posts";
import { createPostSchema, type CreatePostFormValues } from "@/lib/validations/post";
import { cn } from "@/lib/utils";
import type { Post, PostType } from "@/types/post";

interface CreatePostFormProps {
  eventId: string;
  eventTitle: string;
  editingPost?: Post | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

const postTypeOptions: { value: PostType; label: string; icon: typeof MessageSquare; description: string }[] = [
  {
    value: "update",
    label: "Update",
    icon: MessageSquare,
    description: "Share general updates about the event",
  },
  {
    value: "announcement",
    label: "Announcement",
    icon: Megaphone,
    description: "Important announcements for attendees",
  },
  {
    value: "reminder",
    label: "Reminder",
    icon: Bell,
    description: "Remind attendees about something",
  },
];

export function CreatePostForm({
  eventId,
  eventTitle,
  editingPost,
  open,
  onOpenChange,
  trigger,
}: CreatePostFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!editingPost;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      type: "update",
      title: "",
      content: "",
      images: [],
    },
  });

  // Reset form when editingPost changes
  useEffect(() => {
    if (editingPost) {
      reset({
        type: editingPost.type,
        title: editingPost.title || "",
        content: editingPost.content,
        images: editingPost.images || [],
      });
    } else {
      reset({
        type: "update",
        title: "",
        content: "",
        images: [],
      });
    }
  }, [editingPost, reset]);

  const createMutation = useMutation({
    mutationFn: (data: CreatePostFormValues) =>
      isEditing
        ? updatePost(editingPost!.id, data)
        : createPost(eventId, data),
    onSuccess: () => {
      toast.success(isEditing ? "Post updated successfully" : "Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts", eventId] });
      reset();
      onOpenChange?.(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || `Failed to ${isEditing ? "update" : "create"} post`);
    },
  });

  const watchedType = watch("type");
  const watchedContent = watch("content");

  const onSubmit = (data: CreatePostFormValues) => {
    // Clean up empty title
    const cleanedData = {
      ...data,
      title: data.title?.trim() || undefined,
    };
    createMutation.mutate(cleanedData);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
    }
    onOpenChange?.(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Post" : "Create Post"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your post for this event"
              : `Share an update for "${eventTitle}"`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Post Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Post Type</Label>
            <Select
              value={watchedType}
              onValueChange={(value: PostType) => setValue("type", value)}
              disabled={createMutation.isPending}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select post type" />
              </SelectTrigger>
              <SelectContent>
                {postTypeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {postTypeOptions.find((o) => o.value === watchedType)?.description}
            </p>
          </div>

          {/* Title (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="title">Title (Optional)</Label>
            <Input
              id="title"
              placeholder="Add a title for your post"
              disabled={createMutation.isPending}
              {...register("title")}
              className={cn(errors.title && "border-destructive")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your post content..."
              rows={6}
              disabled={createMutation.isPending}
              {...register("content")}
              className={cn(errors.content && "border-destructive")}
            />
            <div className="flex items-center justify-between">
              {errors.content ? (
                <p className="text-sm text-destructive">{errors.content.message}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-muted-foreground">
                {watchedContent?.length || 0}/5000
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Saving..." : "Creating..."}
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  {isEditing ? "Save Changes" : "Create Post"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
