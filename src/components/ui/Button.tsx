import React from "react";
import { type VariantProps, cva } from "class-variance-authority";

// NOTA: Podrías instalar 'class-variance-authority' y 'clsx' (pnpm add class-variance-authority clsx tailwind-merge) para manejar esto nativamente, 
// o usar este enfoque nativo con Tailwind. Aquí hay una versión ligera basada en utilidades.

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-university-blue text-surface-white hover:bg-innovation-purple shadow-lg",
        secondary: "bg-academic-gold text-university-blue hover:opacity-90 shadow-lg",
        outline: "border-2 border-university-blue text-university-blue hover:bg-university-blue hover:text-white",
        ghost: "text-university-blue hover:bg-university-blue/10",
        danger: "bg-error text-white hover:bg-error/90 shadow-md",
      },
      size: {
        sm: "px-4 py-2 text-label-sm",
        md: "px-6 py-3 text-label-md",
        lg: "px-8 py-4 text-title-lg rounded-2xl",
        icon: "h-12 w-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  icon?: string;
}

export function Button({ className, variant, size, icon, children, ...props }: ButtonProps) {
  return (
    <button className={buttonVariants({ variant, size, className })} {...props}>
      {children}
      {icon && <span className="material-symbols-outlined ml-2 text-inherit">{icon}</span>}
    </button>
  );
}
