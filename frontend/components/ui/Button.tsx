// frontend/components/ui/Button.tsx
// Reusable Button component with variant and size support
// Variants: primary (blue), secondary (outline), danger (red), ghost

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-blue text-white hover:bg-navy',
  secondary: 'border border-slate-200 text-gray hover:bg-slate-50',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  ghost: 'text-gray hover:bg-slate-100',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          className
        )
      )}
      {...props}
    >
      {children}
    </button>
  )
}
