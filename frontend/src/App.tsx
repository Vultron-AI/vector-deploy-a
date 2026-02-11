/**
 * Main App Component
 *
 * Todo application with full CRUD operations.
 * Pre-wrapped with DialogProvider to enable the useDialog hook throughout the app.
 */

import { useState, useEffect, useCallback } from 'react'
import { DialogProvider } from '@/components/ui'
import { TodoList } from '@/components/TodoList'
import { AddTodoForm } from '@/components/AddTodoForm'
import { todosApi, type Todo } from '@/services/todosApi'
import { getErrorMessage } from '@/services/api'

function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch todos on mount
  const fetchTodos = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await todosApi.list()
      setTodos(data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  // Add a new todo
  const handleAddTodo = async (title: string) => {
    try {
      setIsAdding(true)
      const newTodo = await todosApi.create({ title })
      setTodos((prev) => [newTodo, ...prev])
    } finally {
      setIsAdding(false)
    }
  }

  // Toggle todo completion
  const handleToggle = async (id: string) => {
    try {
      setUpdatingId(id)
      const updatedTodo = await todosApi.toggleComplete(id)
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      )
    } catch (err) {
      console.error('Failed to toggle todo:', getErrorMessage(err))
    } finally {
      setUpdatingId(null)
    }
  }

  // Delete a todo
  const handleDelete = async (id: string) => {
    try {
      setUpdatingId(id)
      await todosApi.delete(id)
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
    } catch (err) {
      console.error('Failed to delete todo:', getErrorMessage(err))
    } finally {
      setUpdatingId(null)
    }
  }

  // Copy a todo
  const handleCopy = async (id: string) => {
    try {
      setUpdatingId(id)
      const copiedTodo = await todosApi.copy(id)
      setTodos((prev) => [copiedTodo, ...prev])
    } catch (err) {
      console.error('Failed to copy todo:', getErrorMessage(err))
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1
            className="text-3xl font-bold text-[var(--color-fg)] mb-2"
            data-testid="todos.title"
          >
            Aurash's TODO List
          </h1>
        </header>

        {/* Add Todo Form */}
        <div className="mb-6">
          <AddTodoForm onSubmit={handleAddTodo} isLoading={isAdding} />
        </div>

        {/* Todo List */}
        <TodoList
          todos={todos}
          isLoading={isLoading}
          error={error}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onCopy={handleCopy}
          updatingId={updatingId}
        />

        {/* Stats */}
        {!isLoading && !error && todos.length > 0 && (
          <div
            className="mt-4 text-sm text-[var(--color-muted)] text-center"
            data-testid="todos.stats"
          >
            {todos.filter((t) => t.completed).length} of {todos.length} completed
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <DialogProvider>
      <TodoApp />
    </DialogProvider>
  )
}

export default App
