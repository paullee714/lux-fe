import type { Metadata } from "next";
import { Suspense } from "react";
import { VerificationPendingForm } from "@/components/auth/verification-pending-form";
import { LoadingSpinner } from "@/components/common/loading-spinner";

export const metadata: Metadata = {
  title: "Verify Your Email",
  description: "Please verify your email address to complete registration",
};

export default function VerificationPendingPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <VerificationPendingForm />
    </Suspense>
  );
}
