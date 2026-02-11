/**
 * Input Component
 *
 * A versatile input component with consistent styling.
 *
 * CUSTOMIZATION: Update the className values to match your design tokens from tokens.css.
 *
 * Usage:
 *   <Input placeholder="Enter text" />
 *   <Input type="email" disabled />
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-muted)] transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:border-[var(--color-accent)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'hover:border-[var(--color-border-hover)]',
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export { Input }
