import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition",
        variant === "primary" && "bg-primary text-primary-foreground shadow-soft hover:bg-blue-700",
        variant === "secondary" && "border border-border bg-white text-foreground hover:bg-slate-50",
        variant === "ghost" && "text-muted-foreground hover:bg-slate-100 hover:text-foreground",
        className
      )}
      {...props}
    />
  );
}
