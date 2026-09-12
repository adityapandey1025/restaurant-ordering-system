import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron",
  {
    variants: {
      variant: {
        default: "bg-ink px-5 py-2.5 text-white hover:bg-leaf",
        accent: "bg-saffron px-5 py-2.5 text-ink hover:bg-[#f09b48]",
        outline: "border border-ink/20 bg-white px-5 py-2.5 text-ink hover:border-ink/50",
        ghost: "px-4 py-2 text-ink hover:bg-ink/5",
        danger: "bg-red-700 px-5 py-2.5 text-white hover:bg-red-800",
      },
      size: { default: "h-10", sm: "h-8 px-3 text-xs", lg: "h-12 px-7" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
});
Button.displayName = "Button";
