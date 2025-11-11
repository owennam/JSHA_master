import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground rounded-xl shadow-[0_0_4px_0_rgba(2,32,71,0.05),0_4px_16px_0_rgba(2,32,71,0.05)] hover:bg-primary-dark hover:shadow-[0_8px_16px_0_rgba(0,27,55,0.12),0_4px_8px_0_rgba(2,32,71,0.08)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-[250ms] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:shadow-[0_0_0_3px_hsl(217_91%_60%/0.15)]",
        destructive: "bg-destructive text-destructive-foreground rounded-xl shadow-[0_0_4px_0_rgba(2,32,71,0.05),0_4px_16px_0_rgba(2,32,71,0.05)] hover:bg-destructive/90 hover:shadow-[0_8px_16px_0_rgba(0,27,55,0.12),0_4px_8px_0_rgba(2,32,71,0.08)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-[250ms]",
        outline: "border-2 border-border bg-background rounded-xl hover:bg-muted hover:border-primary hover:shadow-[0_0_4px_0_rgba(2,32,71,0.05),0_2px_8px_0_rgba(2,32,71,0.03)] transition-all duration-[250ms]",
        secondary: "bg-muted text-foreground rounded-xl hover:bg-muted/80 hover:shadow-[0_0_4px_0_rgba(2,32,71,0.05),0_2px_8px_0_rgba(2,32,71,0.03)] transition-all duration-[250ms]",
        ghost: "hover:bg-muted hover:text-foreground rounded-xl transition-all duration-[150ms]",
        link: "text-primary underline-offset-4 hover:underline transition-all duration-[150ms]",
      },
      size: {
        default: "h-11 px-6 py-3 rounded-xl",
        sm: "h-9 rounded-lg px-4 text-sm",
        lg: "h-14 rounded-xl px-8 text-base",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
