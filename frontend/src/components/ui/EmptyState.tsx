/**
 * EmptyState Component
 *
 * A component for displaying empty states with optional icon and action.
 *
 * CUSTOMIZATION: Update the className values to match your design tokens from tokens.css.
 *
 * Usage:
 *   <EmptyState
 *     title="No items found"
 *     description="Add your first item to get started"
 *     action={<Button>Add Item</Button>}
 *   />
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon to display (optional) */
  icon?: React.ReactNode
  /** Main title text */
  title: string
  /** Description text (optional) */
  description?: string
  /** Action button or element (optional) */
  action?: React.ReactNode
}

function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 text-[var(--color-muted)]">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-[var(--color-fg)] mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[var(--color-muted)] max-w-sm mb-4">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export { EmptyState }
