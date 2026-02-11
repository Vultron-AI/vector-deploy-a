/**
 * AddTodoForm Component
 *
 * Form for adding new todos with input validation.
 */

import { useState, FormEvent } from 'react'
import { Button, Input, Spinner } from '@/components/ui'

export interface AddTodoFormProps {
  /** Callback when a new todo is submitted */
  onSubmit: (title: string) => Promise<void>
  /** Whether the form is in a loading state */
  isLoading?: boolean
}

export function AddTodoForm({ onSubmit, isLoading }: AddTodoFormProps) {
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate: non-empty title
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setError('Please enter a todo title')
      return
    }

    try {
      await onSubmit(trimmedTitle)
      setTitle('') // Clear input after successful submission
    } catch {
      setError('Failed to add todo. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2" data-testid="todos.add.form">
      <div className="flex-1">
        <Input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (error) setError(null) // Clear error on input change
          }}
          placeholder="TODO description"
          disabled={isLoading}
          aria-label="New todo title"
          data-testid="todos.add.input"
        />
        {error && (
          <p
            className="text-xs text-[var(--color-error)] mt-1"
            data-testid="todos.add.error"
          >
            {error}
          </p>
        )}
      </div>
      <Button
        type="submit"
        disabled={isLoading || !title.trim()}
        data-testid="todos.add.submit"
      >
        {isLoading ? (
          <>
            <Spinner className="mr-2" />
          </>
        ) : (
          '+'
        )}
      </Button>
    </form>
  )
}
