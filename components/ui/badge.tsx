import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex rounded-full bg-leaf/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-leaf", className)}>{children}</span>;
}
