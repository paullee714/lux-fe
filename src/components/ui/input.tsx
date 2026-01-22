import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-xl border-2 bg-background px-4 py-2 text-base transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/60 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default:
          "border-input/50 hover:border-input focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
        // Filled style - more prominent background
        filled:
          "border-transparent bg-muted/50 hover:bg-muted/70 focus-visible:bg-background focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
        // Ghost style - minimal
        ghost:
          "border-transparent bg-transparent hover:bg-muted/30 focus-visible:bg-muted/50 focus-visible:outline-none",
      },
      inputSize: {
        sm: "h-9 px-3 text-sm rounded-lg",
        default: "h-11",
        lg: "h-12 px-5 text-base rounded-xl",
      },
      state: {
        default: "",
        error:
          "border-destructive/50 hover:border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
        success:
          "border-green-500/50 hover:border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/20",
        warning:
          "border-amber-500/50 hover:border-amber-500 focus-visible:border-amber-500 focus-visible:ring-amber-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
      state: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, inputSize, state, startIcon, endIcon, ...props }, ref) => {
    if (startIcon || endIcon) {
      return (
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {startIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ variant, inputSize, state }),
              startIcon && "pl-10",
              endIcon && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {endIcon}
            </div>
          )}
        </div>
      )
    }

    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, inputSize, state, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

// Floating Label Input component
export interface FloatingInputProps extends InputProps {
  label: string
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, id, variant, inputSize, state, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || `input-${generatedId}`

    return (
      <div className="relative">
        <input
          type={props.type}
          id={inputId}
          placeholder=" "
          className={cn(
            inputVariants({ variant, inputSize, state }),
            "peer pt-6 pb-2",
            className
          )}
          ref={ref}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-200 pointer-events-none origin-left",
            "peer-focus:top-3 peer-focus:scale-75 peer-focus:text-primary",
            "peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:scale-75",
            state === "error" && "peer-focus:text-destructive",
            state === "success" && "peer-focus:text-green-500"
          )}
        >
          {label}
        </label>
      </div>
    )
  }
)
FloatingInput.displayName = "FloatingInput"

// Input with inline validation message
export interface ValidatedInputProps extends InputProps {
  error?: string
  success?: string
  hint?: string
}

const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ className, error, success, hint, state, ...props }, ref) => {
    const derivedState = error ? "error" : success ? "success" : state

    return (
      <div className="space-y-1.5">
        <Input
          ref={ref}
          state={derivedState}
          className={className}
          {...props}
        />
        {(error || success || hint) && (
          <p
            className={cn(
              "text-xs px-1",
              error && "text-destructive",
              success && !error && "text-green-600 dark:text-green-400",
              !error && !success && "text-muted-foreground"
            )}
          >
            {error || success || hint}
          </p>
        )}
      </div>
    )
  }
)
ValidatedInput.displayName = "ValidatedInput"

export { Input, FloatingInput, ValidatedInput, inputVariants }
