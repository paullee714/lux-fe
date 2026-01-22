"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { useAuth } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);
  const { login, isLoading, error, clearError } = useAuth({
    redirectIfAuthenticated: "/events",
  });

  // Check if user just registered
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setShowRegistrationSuccess(true);
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    clearError();
    try {
      await login(data);
    } catch {
      // Error is handled by the store
    }
  };

  return (
    <Card className="w-full max-w-md overflow-hidden border-0 bg-card/80 shadow-elevated-lg backdrop-blur-xl">
      {/* Gradient accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600" />

      <CardHeader className="space-y-1 pb-6 pt-8 text-center">
        {/* Logo with glow effect */}
        <div className="relative mx-auto mb-6">
          <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 opacity-40 blur-xl" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 shadow-lg shadow-amber-500/30">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
        </div>

        <CardTitle className="text-2xl font-bold tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Sign in to continue to your Lux account
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-5 px-8">
          {showRegistrationSuccess && (
            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span className="font-medium">Account created successfully! Please sign in.</span>
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              disabled={isLoading}
              {...register("email")}
              className={cn(
                "h-12 rounded-xl border-2 border-transparent bg-muted/50 px-4 transition-all duration-200",
                "placeholder:text-muted-foreground/50",
                "hover:bg-muted/70",
                "focus:border-primary/30 focus:bg-background focus:ring-2 focus:ring-primary/20",
                errors.email && "border-destructive/50 focus:border-destructive focus:ring-destructive/20"
              )}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isLoading}
                {...register("password")}
                className={cn(
                  "h-12 rounded-xl border-2 border-transparent bg-muted/50 px-4 pr-12 transition-all duration-200",
                  "placeholder:text-muted-foreground/50",
                  "hover:bg-muted/70",
                  "focus:border-primary/30 focus:bg-background focus:ring-2 focus:ring-primary/20",
                  errors.password && "border-destructive/50 focus:border-destructive focus:ring-destructive/20"
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="rememberMe"
              {...register("rememberMe")}
              className="h-4 w-4 rounded-md border-2 border-muted-foreground/30 bg-muted/50 text-primary transition-colors focus:ring-2 focus:ring-primary/20 focus:ring-offset-0"
            />
            <Label htmlFor="rememberMe" className="text-sm font-normal text-muted-foreground">
              Keep me signed in
            </Label>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-6 px-8 pb-8 pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className={cn(
              "relative h-12 w-full overflow-hidden rounded-xl text-base font-semibold transition-all duration-300",
              "bg-gradient-to-r from-amber-500 via-amber-500 to-orange-500",
              "hover:from-amber-600 hover:via-amber-500 hover:to-orange-600",
              "shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30",
              "disabled:opacity-70 disabled:shadow-none"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card/80 px-3 text-muted-foreground">
                New to Lux?
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            <Link
              href="/register"
              className="font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Create an account
            </Link>
            {" "}to get started
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
