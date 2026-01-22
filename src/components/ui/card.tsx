import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-2xl border bg-card text-card-foreground transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "border-border/50 shadow-sm hover:border-border hover:shadow-md",
        // Featured card - gradient border with elevated hover
        featured:
          "relative border-transparent bg-gradient-to-br from-primary/5 to-accent/5 shadow-md hover:shadow-elevated hover:-translate-y-1 before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:p-[1px] before:bg-gradient-to-br before:from-primary/50 before:to-accent/30",
        // Stat card - for statistics display
        stat:
          "border-border/30 bg-gradient-to-br from-card to-muted/20 shadow-sm hover:shadow-md hover:border-primary/20",
        // Interactive card - more pronounced hover
        interactive:
          "border-border/50 shadow-sm cursor-pointer hover:border-primary/30 hover:shadow-lg hover:-translate-y-1",
        // Outlined card - minimal style
        outlined:
          "border-border bg-transparent shadow-none hover:bg-muted/30",
        // Ghost card - no visible border
        ghost:
          "border-transparent bg-transparent shadow-none hover:bg-muted/50",
        // Premium card - with ambient glow
        premium:
          "relative border-primary/20 bg-card shadow-md hover:shadow-glow hover:border-primary/40 before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:opacity-0 before:blur-xl before:bg-gradient-to-br before:from-primary/20 before:to-accent/20 before:transition-opacity hover:before:opacity-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Stat Card specific components
const StatCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title: string
    value: string | number
    description?: string
    icon?: React.ReactNode
    trend?: {
      value: number
      isPositive: boolean
    }
  }
>(({ className, title, value, description, icon, trend, ...props }, ref) => (
  <Card
    ref={ref}
    variant="stat"
    className={cn("p-6", className)}
    {...props}
  >
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {trend && (
            <span
              className={cn(
                "text-sm font-medium",
                trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}
            >
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {icon && (
        <div className="rounded-xl bg-primary/10 p-3 text-primary">
          {icon}
        </div>
      )}
    </div>
  </Card>
))
StatCard.displayName = "StatCard"

// Featured Card component
const FeaturedCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    image?: string
    badge?: string
  }
>(({ className, image, badge, children, ...props }, ref) => (
  <Card
    ref={ref}
    variant="featured"
    className={cn("overflow-hidden", className)}
    {...props}
  >
    {image && (
      <div className="relative aspect-video overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {badge && (
          <div className="absolute left-4 top-4">
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-md">
              {badge}
            </span>
          </div>
        )}
      </div>
    )}
    {children}
  </Card>
))
FeaturedCard.displayName = "FeaturedCard"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  StatCard,
  FeaturedCard,
  cardVariants,
}
