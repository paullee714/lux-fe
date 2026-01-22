"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { verifyEmail } from "@/lib/api/auth";

type VerificationState = "loading" | "success" | "error" | "invalid";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [state, setState] = useState<VerificationState>(
    token ? "loading" : "invalid"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setState("invalid");
      return;
    }

    const verifyToken = async () => {
      try {
        await verifyEmail(token);
        setState("success");
      } catch (err) {
        setState("error");
        if (err instanceof Error) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage(
            "Failed to verify email. The link may have expired."
          );
        }
      }
    };

    verifyToken();
  }, [token]);

  // Invalid token state - no token provided
  if (state === "invalid") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">Invalid link</CardTitle>
          <CardDescription>
            This email verification link is invalid or missing.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" asChild>
            <Link href="/login">Go to login</Link>
          </Button>
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/register">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to registration
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Loading state
  if (state === "loading") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Mail className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Verifying your email
          </CardTitle>
          <CardDescription>
            Please wait while we verify your email address...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Success state
  if (state === "success") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold">Email verified!</CardTitle>
          <CardDescription>
            Your email address has been successfully verified.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            You can now sign in to your account and access all features.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" asChild>
            <Link href="/login">Continue to login</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Error state
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <CardTitle className="text-2xl font-bold">Verification failed</CardTitle>
        <CardDescription>
          {errorMessage || "We couldn't verify your email address."}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground">
          The verification link may have expired or already been used. Please
          request a new verification email.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full" asChild>
          <Link href="/login">Go to login</Link>
        </Button>
        <Button variant="ghost" className="w-full" asChild>
          <Link href="/register">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Create new account
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
