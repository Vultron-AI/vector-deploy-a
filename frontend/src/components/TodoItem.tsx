/**
 * TodoItem Component
 *
 * Displays a single todo item with checkbox, title, and delete button.
 */

import { Button, Badge } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Todo } from '@/services/todosApi'

export interface TodoItemProps {
  /** The todo to display */
  todo: Todo
  /** Callback when the toggle checkbox is clicked */
  onToggle: (id: string) => void
  /** Callback when the delete button is clicked */
  onDelete: (id: string) => void
  /** Callback when the copy button is clicked */
  onCopy: (id: string) => void
  /** Whether the item is in a loading state */
  isLoading?: boolean
}

export function TodoItem({ todo, onToggle, onDelete, onCopy, isLoading }: TodoItemProps) {
  return (
    <div
      className="flex items-center gap-3 p-3 border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-bg)] transition-colors"
      data-testid="todos.item"
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        disabled={isLoading}
        className="h-5 w-5 rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-focus-ring)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        data-testid="todos.item.checkbox"
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />

      {/* Title */}
      <span
        className={cn(
          'flex-1 text-sm',
          todo.completed && 'line-through text-[var(--color-muted)]'
        )}
        data-testid="todos.item.title"
      >
        {todo.title}
      </span>

      {/* Status Badge */}
      {todo.completed && (
        <Badge variant="success" data-testid="todos.item.badge">
          Done
        </Badge>
      )}

      {/* Copy Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onCopy(todo.id)}
        disabled={isLoading}
        className="text-[var(--color-muted)] hover:bg-[var(--color-muted)] hover:text-white"
        data-testid="todos.item.copy"
        aria-label={`Copy "${todo.title}"`}
        title="Copy this todo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        </svg>
      </Button>

      {/* Delete Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(todo.id)}
        disabled={isLoading}
        className="text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white"
        data-testid="todos.item.delete"
        aria-label={`Delete "${todo.title}"`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          <line x1="10" x2="10" y1="11" y2="17" />
          <line x1="14" x2="14" y1="11" y2="17" />
        </svg>
      </Button>
    </div>
  )
}
