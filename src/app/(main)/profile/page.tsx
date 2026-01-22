"use client";

import { User, Mail, Phone, Calendar, Settings, Shield, Globe, CheckCircle2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/page-header";
import { useAuthStore } from "@/stores";
import { formatDate, getInitials } from "@/lib/utils/format";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 animate-fade-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
          <User className="h-10 w-10 text-muted-foreground/50" />
        </div>
        <p className="text-muted-foreground">Please log in to view your profile.</p>
        <Button asChild>
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Profile"
        description="Manage your account settings and preferences"
        actions={
          <Button variant="outline" asChild className="gap-2">
            <Link href="/settings">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="relative overflow-hidden lg:col-span-1">
          {/* Background gradient */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-amber-400/20 via-orange-500/10 to-transparent" />

          <CardContent className="relative pt-8">
            <div className="flex flex-col items-center text-center">
              {/* Avatar with ring */}
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 opacity-75 blur" />
                <Avatar className="relative h-28 w-28 border-4 border-background">
                  <AvatarImage src={user.avatar_url} alt={user.display_name} />
                  <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-3xl font-bold text-white">
                    {getInitials(user.display_name)}
                  </AvatarFallback>
                </Avatar>
                {user.email_verified && (
                  <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-emerald-500 text-white">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                )}
              </div>

              <h2 className="mt-5 text-xl font-bold tracking-tight">{user.display_name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>

              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <Badge
                  className={
                    user.email_verified
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  }
                >
                  <Shield className="mr-1 h-3 w-3" />
                  {user.email_verified ? "Verified" : "Unverified"}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {user.role}
                </Badge>
              </div>

              <Button className="mt-6 w-full gap-2" variant="outline">
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="border-b bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Account Information</CardTitle>
                  <CardDescription>Your personal details and contact information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="divide-y">
              <div className="flex items-center gap-4 py-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="font-semibold">{user.display_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 py-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                  <p className="font-semibold">{user.email}</p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center gap-4 py-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10">
                    <Phone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                    <p className="font-semibold">{user.phone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 py-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10">
                  <Globe className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Language</p>
                  <p className="font-semibold">{user.language === "ko" ? "Korean" : "English"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 py-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10">
                  <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                  <p className="font-semibold">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {user.bio && (
            <Card>
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-base">About</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">{user.bio}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
