import { LoadingSpinner } from "@/components/common/loading-spinner";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
}
