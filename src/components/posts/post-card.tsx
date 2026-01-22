"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MoreHorizontal,
  Pin,
  Pencil,
  Trash2,
  Megaphone,
  Bell,
  MessageSquare,
  Loader2,
  PinOff,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deletePost, pinPost, unpinPost } from "@/lib/api/posts";
import { formatRelativeTime, getInitials } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { Post, PostType } from "@/types/post";

interface PostCardProps {
  post: Post;
  eventId: string;
  canEdit?: boolean;
  canPin?: boolean;
  onEdit?: (post: Post) => void;
}

const postTypeConfig: Record<
  PostType,
  { label: string; icon: typeof MessageSquare; className: string }
> = {
  update: {
    label: "Update",
    icon: MessageSquare,
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  },
  announcement: {
    label: "Announcement",
    icon: Megaphone,
    className:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
  },
  reminder: {
    label: "Reminder",
    icon: Bell,
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
  },
};

export function PostCard({
  post,
  eventId,
  canEdit = false,
  canPin = false,
  onEdit,
}: PostCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();

  const typeConfig = postTypeConfig[post.type] || postTypeConfig.update;
  const TypeIcon = typeConfig.icon;

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(post.id),
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts", eventId] });
      setShowDeleteDialog(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete post");
    },
  });

  const pinMutation = useMutation({
    mutationFn: () => (post.isPinned ? unpinPost(post.id) : pinPost(post.id)),
    onSuccess: () => {
      toast.success(post.isPinned ? "Post unpinned" : "Post pinned");
      queryClient.invalidateQueries({ queryKey: ["posts", eventId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update pin status");
    },
  });

  const handleEdit = () => {
    if (onEdit) {
      onEdit(post);
    }
  };

  return (
    <>
      <Card
        className={cn(
          "transition-all",
          post.isPinned && "border-primary/50 bg-primary/5"
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={post.author.profileImage}
                  alt={post.author.name}
                />
                <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{post.author.name}</span>
                  {post.isPinned && (
                    <Badge variant="outline" className="gap-1 text-xs">
                      <Pin className="h-3 w-3" />
                      Pinned
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={cn("text-xs", typeConfig.className)}>
                    <TypeIcon className="mr-1 h-3 w-3" />
                    {typeConfig.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(post.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {(canEdit || canPin) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canPin && (
                    <DropdownMenuItem
                      onClick={() => pinMutation.mutate()}
                      disabled={pinMutation.isPending}
                    >
                      {pinMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : post.isPinned ? (
                        <PinOff className="mr-2 h-4 w-4" />
                      ) : (
                        <Pin className="mr-2 h-4 w-4" />
                      )}
                      {post.isPinned ? "Unpin post" : "Pin post"}
                    </DropdownMenuItem>
                  )}
                  {canEdit && (
                    <>
                      {canPin && <DropdownMenuSeparator />}
                      <DropdownMenuItem onClick={handleEdit}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit post
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete post
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {post.title && (
            <h4 className="text-lg font-semibold">{post.title}</h4>
          )}
          <p className="whitespace-pre-wrap text-muted-foreground">
            {post.content}
          </p>

          {post.images && post.images.length > 0 && (
            <div
              className={cn(
                "grid gap-2 pt-2",
                post.images.length === 1
                  ? "grid-cols-1"
                  : post.images.length === 2
                    ? "grid-cols-2"
                    : "grid-cols-2 sm:grid-cols-3"
              )}
            >
              {post.images.slice(0, 6).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-video overflow-hidden rounded-lg bg-muted"
                >
                  <Image
                    src={image}
                    alt={`Post image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {index === 5 && post.images && post.images.length > 6 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                      <span className="text-lg font-semibold">
                        +{post.images.length - 6}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>

        {post.updatedAt !== post.createdAt && (
          <CardFooter className="pt-0">
            <span className="text-xs text-muted-foreground">
              Edited {formatRelativeTime(post.updatedAt)}
            </span>
          </CardFooter>
        )}
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Skeleton loader for PostCard
export function PostCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}
