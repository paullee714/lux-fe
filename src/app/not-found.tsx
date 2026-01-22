import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/common/back-button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">L</span>
            </div>
            <span className="text-xl font-bold">Lux</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Icon */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <FileQuestion className="h-10 w-10 text-muted-foreground" />
          </div>

          {/* Error Code */}
          <div className="space-y-2">
            <h1 className="text-7xl font-bold tracking-tight text-primary">404</h1>
            <h2 className="text-2xl font-semibold">Page not found</h2>
          </div>

          {/* Description */}
          <p className="max-w-md text-muted-foreground">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The page may
            have been moved, deleted, or never existed.
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go to home
              </Link>
            </Button>
            <BackButton />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
