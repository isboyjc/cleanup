import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-bold transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none border-3 border-foreground",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[4px_4px_0_var(--foreground)] hover:shadow-[6px_6px_0_var(--foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[2px_2px_0_var(--foreground)] active:translate-x-0 active:translate-y-0",
        destructive:
          "bg-destructive text-white shadow-[4px_4px_0_var(--foreground)] hover:shadow-[6px_6px_0_var(--foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[2px_2px_0_var(--foreground)] active:translate-x-0 active:translate-y-0",
        outline:
          "bg-background text-foreground shadow-[4px_4px_0_var(--foreground)] hover:bg-accent hover:text-accent-foreground hover:shadow-[6px_6px_0_var(--foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[2px_2px_0_var(--foreground)] active:translate-x-0 active:translate-y-0",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[4px_4px_0_var(--foreground)] hover:shadow-[6px_6px_0_var(--foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[2px_2px_0_var(--foreground)] active:translate-x-0 active:translate-y-0",
        accent:
          "bg-accent text-accent-foreground shadow-[4px_4px_0_var(--foreground)] hover:shadow-[6px_6px_0_var(--foreground)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[2px_2px_0_var(--foreground)] active:translate-x-0 active:translate-y-0",
        ghost:
          "border-transparent hover:bg-accent hover:text-accent-foreground hover:border-foreground hover:shadow-[4px_4px_0_var(--foreground)]",
        link: "text-primary underline-offset-4 hover:underline border-transparent",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-md gap-1.5 px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
