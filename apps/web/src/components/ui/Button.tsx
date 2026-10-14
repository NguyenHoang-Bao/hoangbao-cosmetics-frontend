import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Bảng ánh xạ class theo đúng tone màu thương hiệu của dự án cũ (Rose & Pink Palette)
const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700 shadow-sm shadow-rose-200",
  secondary: "bg-gray-800 text-white hover:bg-gray-900 active:bg-black shadow-sm",
  outline: "border border-gray-300 text-gray-700 bg-white hover:border-rose-500 hover:text-rose-600 active:bg-rose-50 shadow-sm",
  ghost: "text-gray-700 hover:text-rose-600 hover:bg-rose-50 active:bg-rose-100",
  danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm shadow-red-200",
};

// Chuẩn bo góc rounded-md theo style thực tế của shop
const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-md font-medium",
  md: "h-9 px-4 text-sm gap-2 rounded-md font-semibold",
  lg: "h-11 px-6 text-base gap-2.5 rounded-md font-semibold",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(
          "inline-flex items-center justify-center transition-all select-none cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-1",
          "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>Đang tải...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
