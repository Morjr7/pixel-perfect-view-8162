import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const popVariants = cva(
  "btn-pop select-none active:btn-pop-press disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      tone: {
        primary: "bg-primary text-primary-foreground hover:brightness-110",
        action: "bg-accent text-accent-foreground hover:brightness-105",
        success: "bg-success text-success-foreground hover:brightness-105",
        warning: "bg-warning text-warning-foreground hover:brightness-105",
        neutral: "bg-surface-strong text-foreground hover:brightness-125",
        danger: "bg-destructive text-destructive-foreground hover:brightness-110",
      },
      size: {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2.5 text-sm",
        lg: "px-6 py-3 text-base",
        block: "w-full px-6 py-3 text-base",
      },
    },
    defaultVariants: { tone: "primary", size: "md" },
  },
);

export function PopButton({
  className,
  tone,
  size,
  asChild,
  ...props
}: ComponentProps<"button"> & VariantProps<typeof popVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(popVariants({ tone, size }), className)} {...props} />;
}
