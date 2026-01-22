"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Megaphone, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { PostCard, PostCardSkeleton } from "./post-card";
import { CreatePostForm } from "./create-post-form";
import { getEventPosts } from "@/lib/api/posts";
import type { Post } from "@/types/post";

interface PostsSectionProps {
  eventId: string;
  eventTitle: string;
  isHost: boolean;
  isAuthenticated?: boolean;
}

export function PostsSection({
  eventId,
  eventTitle,
  isHost,
}: PostsSectionProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const {
    data: postsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["posts", eventId],
    queryFn: () => getEventPosts(eventId, { limit: 50 }),
  });

  const posts = useMemo(() => postsData?.data?.data || [], [postsData?.data?.data]);

  // Sort posts: pinned first, then by creation date (newest first)
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      // Pinned posts come first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // If both are pinned or both are not pinned, sort by date
      if (a.isPinned && b.isPinned) {
        // Sort pinned posts by pinnedAt date
        const pinnedAtA = a.pinnedAt ? new Date(a.pinnedAt).getTime() : 0;
        const pinnedAtB = b.pinnedAt ? new Date(b.pinnedAt).getTime() : 0;
        return pinnedAtB - pinnedAtA;
      }

      // Sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [posts]);

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsCreateDialogOpen(true);
  };

  const handleCloseDialog = (open: boolean) => {
    setIsCreateDialogOpen(open);
    if (!open) {
      setEditingPost(null);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Posts & Updates
          </CardTitle>
          <CardDescription>Loading posts...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PostCardSkeleton />
          <PostCardSkeleton />
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Posts & Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState
            title="Failed to load posts"
            message={error.message || "An error occurred while loading posts."}
            onRetry={() => refetch()}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Posts & Updates
            </CardTitle>
            <CardDescription>
              {posts.length > 0
                ? `${posts.length} post${posts.length !== 1 ? "s" : ""} from the organizer`
                : "No posts yet"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => refetch()}
              title="Refresh posts"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            {isHost && (
              <CreatePostForm
                eventId={eventId}
                eventTitle={eventTitle}
                editingPost={editingPost}
                open={isCreateDialogOpen}
                onOpenChange={handleCloseDialog}
                trigger={
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Post
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sortedPosts.length === 0 ? (
          <EmptyState
            icon={<Megaphone className="h-8 w-8 text-muted-foreground" />}
            title="No posts yet"
            description={
              isHost
                ? "Share updates, announcements, or reminders with your attendees."
                : "The organizer hasn't posted any updates yet."
            }
            action={
              isHost && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Post
                </Button>
              )
            }
            className="min-h-[200px]"
          />
        ) : (
          <div className="space-y-4">
            {sortedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                eventId={eventId}
                canEdit={isHost || post.authorId === post.author.id}
                canPin={isHost}
                onEdit={handleEditPost}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
