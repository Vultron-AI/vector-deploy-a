/**
 * Badge Component
 *
 * A small badge component for status indicators and labels.
 *
 * CUSTOMIZATION: Update the className values to match your design tokens from tokens.css.
 *
 * Usage:
 *   <Badge>Default</Badge>
 *   <Badge variant="success">Complete</Badge>
 *   <Badge variant="destructive">Error</Badge>
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  // STYLE: Base badge styles
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        // STYLE: Default variant
        default: 'bg-[var(--color-accent)] text-white',
        // STYLE: Secondary variant
        secondary: 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-fg)]',
        // STYLE: Success variant
        success: 'bg-[var(--color-success)] text-white',
        // STYLE: Warning variant
        warning: 'bg-[var(--color-warning)] text-white',
        // STYLE: Destructive variant
        destructive: 'bg-[var(--color-error)] text-white',
        // STYLE: Outline variant
        outline: 'border border-[var(--color-border)] text-[var(--color-fg)] bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
