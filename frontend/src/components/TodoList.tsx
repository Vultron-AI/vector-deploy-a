/**
 * TodoList Component
 *
 * Displays a list of todo items with loading, empty, and error states.
 */

import { Card, CardContent, Spinner, EmptyState } from '@/components/ui'
import { TodoItem } from '@/components/TodoItem'
import type { Todo } from '@/services/todosApi'

export interface TodoListProps {
  /** Array of todos to display */
  todos: Todo[]
  /** Whether the list is loading */
  isLoading?: boolean
  /** Error message to display */
  error?: string | null
  /** Callback when a todo's toggle checkbox is clicked */
  onToggle: (id: string) => void
  /** Callback when a todo's delete button is clicked */
  onDelete: (id: string) => void
  /** Callback when a todo's copy button is clicked */
  onCopy: (id: string) => void
  /** ID of the todo currently being updated */
  updatingId?: string | null
}

export function TodoList({
  todos,
  isLoading,
  error,
  onToggle,
  onDelete,
  onCopy,
  updatingId,
}: TodoListProps) {
  // Loading state
  if (isLoading) {
    return (
      <Card data-testid="todos.loading">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center gap-3">
            <Spinner className="h-8 w-8" />
            <p className="text-sm text-[var(--color-muted)]">Loading todos...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Card data-testid="todos.error">
        <CardContent className="py-12">
          <EmptyState
            title="Error loading todos"
            description={error}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[var(--color-error)]"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
            }
          />
        </CardContent>
      </Card>
    )
  }

  // Empty state
  if (todos.length === 0) {
    return (
      <Card data-testid="todos.empty">
        <CardContent className="py-12">
          <EmptyState
            title="No todos"
            description="Time to add more Todos!"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            }
          />
        </CardContent>
      </Card>
    )
  }

  // List of todos
  return (
    <Card data-testid="todos.list">
      <CardContent className="p-0">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onCopy={onCopy}
            isLoading={updatingId === todo.id}
          />
        ))}
      </CardContent>
    </Card>
  )
}
