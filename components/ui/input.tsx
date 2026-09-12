import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn("h-11 w-full rounded-xl border border-ink/15 bg-white px-4 text-sm outline-none transition placeholder:text-ink/40 focus:border-leaf focus:ring-2 focus:ring-leaf/10", className)} {...props} />
));
Input.displayName = "Input";
