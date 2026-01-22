"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, Plus, X, Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { sendInvitations } from "@/lib/api/invitations";

interface SendInvitationModalProps {
  eventId: string;
  eventTitle: string;
  trigger?: React.ReactNode;
}

export function SendInvitationModal({
  eventId,
  eventTitle,
  trigger,
}: SendInvitationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sendMutation = useMutation({
    mutationFn: () => sendInvitations(eventId, emails, message || undefined),
    onSuccess: (response: { data: { sent: number; failed?: string[] } }) => {
      const data = response.data;
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });

      if (data && data.sent > 0) {
        toast({
          title: "Invitations Sent",
          description: `Successfully sent ${data.sent} invitation(s)${
            data.failed && data.failed.length > 0
              ? `. ${data.failed.length} failed.`
              : "."
          }`,
        });
      }

      if (data?.failed && data.failed.length > 0) {
        toast({
          variant: "destructive",
          title: "Some Invitations Failed",
          description: `Failed to send to: ${data.failed.join(", ")}`,
        });
      }

      setIsOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to send invitations",
        description: error.message,
      });
    },
  });

  const resetForm = () => {
    setEmails([]);
    setEmailInput("");
    setMessage("");
    setError("");
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addEmail = () => {
    const trimmedEmail = emailInput.trim().toLowerCase();

    if (!trimmedEmail) {
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (emails.includes(trimmedEmail)) {
      setError("This email has already been added");
      return;
    }

    if (emails.length >= 50) {
      setError("Maximum 50 emails allowed per batch");
      return;
    }

    setEmails([...emails, trimmedEmail]);
    setEmailInput("");
    setError("");
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((e) => e !== emailToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    }
    if (e.key === "," || e.key === " ") {
      e.preventDefault();
      addEmail();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const pastedEmails = pastedText
      .split(/[,\s\n]+/)
      .map((email) => email.trim().toLowerCase())
      .filter((email) => email && validateEmail(email) && !emails.includes(email));

    if (pastedEmails.length > 0) {
      const newEmails = [...emails, ...pastedEmails].slice(0, 50);
      setEmails(newEmails);
      setEmailInput("");
      setError("");
    }
  };

  const handleSend = () => {
    if (emails.length === 0) {
      setError("Please add at least one email address");
      return;
    }
    sendMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite People
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Send Invitations</DialogTitle>
          <DialogDescription>
            Invite people to &quot;{eventTitle}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Email Addresses
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter email address"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                className="flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={addEmail}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Press Enter, comma, or space to add. You can also paste multiple emails.
            </p>
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
          </div>

          {/* Email Tags */}
          {emails.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {emails.length} recipient{emails.length !== 1 ? "s" : ""}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEmails([])}
                  className="h-auto py-1 px-2 text-xs"
                >
                  Clear all
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-md bg-muted/50">
                {emails.map((email) => (
                  <Badge
                    key={email}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Mail className="h-3 w-3" />
                    {email}
                    <button
                      type="button"
                      onClick={() => removeEmail(email)}
                      className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Personal Message (optional)
            </label>
            <Textarea
              placeholder="Add a personal message to your invitation..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/500
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={sendMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={emails.length === 0 || sendMutation.isPending}
          >
            {sendMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send {emails.length > 0 ? `(${emails.length})` : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
