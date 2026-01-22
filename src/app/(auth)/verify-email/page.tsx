import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { LoadingSpinner } from "@/components/common/loading-spinner";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address for your Lux account",
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <VerifyEmailForm />
    </Suspense>
  );
}
