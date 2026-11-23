import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/format";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-navy-900 text-white hover:bg-navy-800 active:bg-navy-950 shadow-sm",
        gold: "bg-gold-400 text-navy-950 hover:bg-gold-300 active:bg-gold-500 shadow-sm",
        outline:
          "border border-border-strong bg-white text-navy-900 hover:bg-cream-200 hover:border-navy-200",
        ghost: "text-navy-900 hover:bg-navy-50",
        subtle: "bg-navy-50 text-navy-900 hover:bg-navy-100",
        danger: "bg-red-600 text-white hover:bg-red-700",
        link: "text-navy-800 underline underline-offset-4 hover:text-gold-700 p-0 h-auto rounded-none",
      },
      size: {
        sm: "h-9 px-3.5 text-[0.8rem]",
        default: "h-11 px-5",
        lg: "h-12 px-6 text-[0.95rem]",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
