"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, Check, X, Clock, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import {
  getReceivedInvitations,
  getSentInvitations,
  respondToInvitation,
  cancelInvitation
} from "@/lib/api/invitations";
import { formatDate, formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Invitation, InvitationStatus } from "@/types/event";

const statusConfig: Record<
  InvitationStatus,
  { label: string; icon: typeof Clock; className: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  },
  accepted: {
    label: "Accepted",
    icon: Check,
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  },
  declined: {
    label: "Declined",
    icon: X,
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  },
  expired: {
    label: "Expired",
    icon: Clock,
    className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
  },
  cancelled: {
    label: "Cancelled",
    icon: X,
    className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
  },
};

type ResponseAction = "accept" | "decline";

function InvitationCard({
  invitation,
  type,
  onRespond,
  onCancel,
  isResponding,
}: {
  invitation: Invitation;
  type: "received" | "sent";
  onRespond?: (id: string, action: ResponseAction, message?: string) => void;
  onCancel?: (id: string) => void;
  isResponding?: boolean;
}) {
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [responseAction, setResponseAction] = useState<ResponseAction>("accept");
  const [responseMessage, setResponseMessage] = useState("");

  const config = statusConfig[invitation.status];
  const StatusIcon = config.icon;

  const handleRespond = (action: ResponseAction) => {
    setResponseAction(action);
    setShowResponseDialog(true);
  };

  const handleConfirmResponse = () => {
    onRespond?.(invitation.id, responseAction, responseMessage || undefined);
    setShowResponseDialog(false);
    setResponseMessage("");
  };

  // Display name for the invitation
  const displayName = type === "received"
    ? "Event Invitation"
    : invitation.invitee_name || invitation.invitee_email || "Invitee";

  return (
    <>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">
                  {type === "received"
                    ? "Event Invitation"
                    : `To: ${displayName}`}
                </CardTitle>
                <CardDescription className="text-xs">
                  {formatRelativeTime(invitation.created_at)}
                </CardDescription>
              </div>
            </div>
            <Badge className={cn(config.className)}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {config.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {invitation.event ? (
              <>
                <h4 className="font-medium">{invitation.event.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {formatDate(new Date(invitation.event.starts_at))}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Event ID: {invitation.event_id}</p>
            )}
            {invitation.message && (
              <p className="text-sm italic text-muted-foreground border-l-2 border-primary/50 pl-3">
                &quot;{invitation.message}&quot;
              </p>
            )}
          </div>
        </CardContent>
        {type === "received" && invitation.status === "pending" && (
          <CardFooter className="gap-2">
            <Button
              size="sm"
              className="flex-1"
              onClick={() => handleRespond("accept")}
              disabled={isResponding}
            >
              {isResponding ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => handleRespond("decline")}
              disabled={isResponding}
            >
              <X className="mr-2 h-4 w-4" />
              Decline
            </Button>
          </CardFooter>
        )}
        {type === "sent" && invitation.status === "pending" && (
          <CardFooter>
            <Button
              size="sm"
              variant="destructive"
              className="w-full"
              onClick={() => onCancel?.(invitation.id)}
              disabled={isResponding}
            >
              {isResponding ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <X className="mr-2 h-4 w-4" />
              )}
              Cancel Invitation
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Response Confirmation Dialog */}
      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {responseAction === "accept" ? "Accept Invitation" : "Decline Invitation"}
            </DialogTitle>
            <DialogDescription>
              {responseAction === "accept"
                ? `You are about to accept this invitation.`
                : `You are about to decline this invitation.`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium">
              Add a message (optional)
            </label>
            <Textarea
              placeholder={
                responseAction === "accept"
                  ? "Thanks for the invitation! Looking forward to it."
                  : "Sorry, I won't be able to make it..."
              }
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowResponseDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant={responseAction === "accept" ? "default" : "destructive"}
              onClick={handleConfirmResponse}
              disabled={isResponding}
            >
              {isResponding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {responseAction === "accept" ? "Accept" : "Decline"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Skeleton for loading state
function InvitationCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              <div className="h-3 w-20 bg-muted animate-pulse rounded" />
            </div>
          </div>
          <div className="h-5 w-16 bg-muted animate-pulse rounded" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-5 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function InvitationsPage() {
  const [tab, setTab] = useState<"received" | "sent">("received");
  const [statusFilter, setStatusFilter] = useState<InvitationStatus | "all">("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: receivedData,
    isLoading: receivedLoading,
    error: receivedError,
    refetch: refetchReceived,
  } = useQuery({
    queryKey: ["invitations", "received", statusFilter],
    queryFn: () => getReceivedInvitations(
      statusFilter !== "all" ? { status: statusFilter } : undefined
    ),
    enabled: tab === "received",
  });

  const {
    data: sentData,
    isLoading: sentLoading,
    error: sentError,
    refetch: refetchSent,
  } = useQuery({
    queryKey: ["invitations", "sent", statusFilter],
    queryFn: () => getSentInvitations(
      statusFilter !== "all" ? { status: statusFilter } : undefined
    ),
    enabled: tab === "sent",
  });

  // Respond to invitation mutation
  const respondMutation = useMutation({
    mutationFn: async ({ id, action, message }: { id: string; action: ResponseAction; message?: string }) => {
      return respondToInvitation(id, {
        status: action === "accept" ? "accepted" : "declined",
        message
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      toast({
        title: variables.action === "accept" ? "Invitation Accepted" : "Invitation Declined",
        description: variables.action === "accept"
          ? "You have accepted the invitation. See you at the event!"
          : "You have declined the invitation.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to respond",
        description: error.message,
      });
    },
  });

  // Cancel invitation mutation
  const cancelMutation = useMutation({
    mutationFn: cancelInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      toast({
        title: "Invitation Cancelled",
        description: "The invitation has been cancelled.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to cancel",
        description: error.message,
      });
    },
  });

  const handleRespond = (id: string, action: ResponseAction, message?: string) => {
    respondMutation.mutate({ id, action, message });
  };

  const handleCancel = (id: string) => {
    if (window.confirm("Are you sure you want to cancel this invitation?")) {
      cancelMutation.mutate(id);
    }
  };

  const invitations =
    tab === "received"
      ? receivedData?.data?.data || []
      : sentData?.data?.data || [];
  const isLoading = tab === "received" ? receivedLoading : sentLoading;
  const error = tab === "received" ? receivedError : sentError;
  const refetch = tab === "received" ? refetchReceived : refetchSent;

  // Filter invitations by status if filter is set
  const filteredInvitations = statusFilter === "all"
    ? invitations
    : invitations.filter(inv => inv.status === statusFilter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invitations"
        description="Manage your event invitations"
      />

      {/* Tabs and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 border-b sm:border-b-0">
          <button
            onClick={() => setTab("received")}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors rounded-t-lg sm:rounded-lg",
              tab === "received"
                ? "border-b-2 border-primary text-primary sm:bg-primary sm:text-primary-foreground sm:border-0"
                : "text-muted-foreground hover:text-foreground sm:hover:bg-muted"
            )}
          >
            Received
          </button>
          <button
            onClick={() => setTab("sent")}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors rounded-t-lg sm:rounded-lg",
              tab === "sent"
                ? "border-b-2 border-primary text-primary sm:bg-primary sm:text-primary-foreground sm:border-0"
                : "text-muted-foreground hover:text-foreground sm:hover:bg-muted"
            )}
          >
            Sent
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as InvitationStatus | "all")}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <InvitationCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="Failed to load invitations"
          message={(error as Error).message}
          onRetry={() => refetch()}
        />
      ) : filteredInvitations.length === 0 ? (
        <EmptyState
          icon={<Mail className="h-8 w-8 text-muted-foreground" />}
          title={
            tab === "received"
              ? statusFilter !== "all"
                ? `No ${statusFilter} invitations`
                : "No invitations received"
              : statusFilter !== "all"
                ? `No ${statusFilter} invitations`
                : "No invitations sent"
          }
          description={
            tab === "received"
              ? "You haven't received any event invitations yet."
              : "You haven't sent any invitations yet."
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredInvitations.map((invitation) => (
            <InvitationCard
              key={invitation.id}
              invitation={invitation}
              type={tab}
              onRespond={handleRespond}
              onCancel={handleCancel}
              isResponding={respondMutation.isPending || cancelMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
