"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Globe } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth";
import { useAuth } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading, error, clearError } = useAuth({
    redirectIfAuthenticated: "/events",
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      displayName: "",
      language: "ko",
      agreeToTerms: false as boolean,
    },
  });

  const selectedLanguage = watch("language");

  const onSubmit = async (data: RegisterFormValues) => {
    clearError();
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        display_name: data.displayName,
        language: data.language,
      });
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
            <span className="text-2xl font-bold text-white">L</span>
          </div>
        </div>

        <CardTitle className="text-2xl font-bold tracking-tight">
          Create an account
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Join Lux and start discovering amazing events
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="displayName">Name</Label>
            <Input
              id="displayName"
              type="text"
              placeholder="Your name"
              autoComplete="name"
              disabled={isLoading}
              {...register("displayName")}
              className={cn(errors.displayName && "border-destructive")}
            />
            {errors.displayName && (
              <p className="text-sm text-destructive">{errors.displayName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              disabled={isLoading}
              {...register("email")}
              className={cn(errors.email && "border-destructive")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Preferred Language</Label>
            <Select
              value={selectedLanguage}
              onValueChange={(value: "ko" | "en") => setValue("language", value)}
              disabled={isLoading}
            >
              <SelectTrigger id="language" className="w-full">
                <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ko">Korean (한국어)</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                autoComplete="new-password"
                disabled={isLoading}
                {...register("password")}
                className={cn(
                  "pr-10",
                  errors.password && "border-destructive"
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Must be at least 8 characters with uppercase, lowercase, and number
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                autoComplete="new-password"
                disabled={isLoading}
                {...register("confirmPassword")}
                className={cn(
                  "pr-10",
                  errors.confirmPassword && "border-destructive"
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="agreeToTerms"
                {...register("agreeToTerms")}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                disabled={isLoading}
              />
              <Label htmlFor="agreeToTerms" className="text-sm font-normal leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                <span className="text-destructive"> *</span>
              </Label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm text-destructive">
                {errors.agreeToTerms.message}
              </p>
            )}
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
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card/80 px-3 text-muted-foreground">
                Already have an account?
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Sign in instead
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
