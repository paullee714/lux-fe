"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { resendVerificationEmail } from "@/lib/api/auth";
import { useToast } from "@/hooks/use-toast";

export function VerificationPendingForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { toast } = useToast();

  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);

    try {
      await resendVerificationEmail();

      toast({
        title: "Email sent",
        description: "A new verification email has been sent to your inbox.",
      });
      // Start 60 second cooldown
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      toast({
        title: "Failed to send email",
        description:
          err instanceof Error
            ? err.message
            : "Could not send verification email. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
          <Mail className="h-6 w-6 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
        <CardDescription>
          We&apos;ve sent a verification link to your email address.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        {email && (
          <p className="text-sm font-medium text-foreground">
            {email}
          </p>
        )}
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            Click the link in the email to verify your account. If you
            don&apos;t see the email, check your spam folder.
          </p>
        </div>

        <div className="rounded-md bg-muted p-4 text-left text-sm">
          <p className="font-medium mb-2">Didn&apos;t receive the email?</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Check your spam or junk folder</li>
            <li>Make sure you entered the correct email</li>
            <li>Wait a few minutes and try again</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          className="w-full"
          onClick={handleResendEmail}
          disabled={isResending || resendCooldown > 0}
        >
          {isResending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : resendCooldown > 0 ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Resend in {resendCooldown}s
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Resend verification email
            </>
          )}
        </Button>
        <Button variant="ghost" className="w-full" asChild>
          <Link href="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
