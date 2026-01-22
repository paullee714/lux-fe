import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-amber-50/80 via-background to-orange-50/50 dark:from-amber-950/20 dark:via-background dark:to-orange-950/20" />

      {/* Animated gradient orbs */}
      <div className="absolute -left-40 -top-40 -z-10 h-80 w-80 rounded-full bg-gradient-to-br from-amber-400/30 to-orange-500/20 blur-3xl dark:from-amber-500/10 dark:to-orange-600/10" />
      <div className="absolute -bottom-40 -right-40 -z-10 h-80 w-80 rounded-full bg-gradient-to-br from-orange-400/20 to-amber-500/30 blur-3xl dark:from-orange-500/10 dark:to-amber-600/10" />
      <div className="absolute left-1/2 top-1/3 -z-10 h-60 w-60 -translate-x-1/2 rounded-full bg-gradient-to-br from-yellow-400/10 to-amber-400/20 blur-3xl dark:from-yellow-500/5 dark:to-amber-500/10" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.02)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_60%,transparent_100%)]" />

      {/* Subtle noise texture */}
      <div className="absolute inset-0 -z-10 opacity-[0.015] dark:opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
      }} />

      {/* Content */}
      <div className="animate-fade-in">
        {children}
      </div>

      {/* Footer branding */}
      <div className="absolute bottom-6 text-center text-xs text-muted-foreground/60">
        <p>Powered by Lux</p>
      </div>
    </div>
  );
}
