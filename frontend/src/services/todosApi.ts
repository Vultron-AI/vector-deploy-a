/**
 * Todos API Service
 *
 * Provides typed API methods for interacting with the Django todos backend.
 */

import { api, PaginatedResponse } from './api'

/**
 * Todo interface matching the Django model
 */
export interface Todo {
  id: string
  title: string
  completed: boolean
  created_at: string
  updated_at: string
}

/**
 * Data for creating a new todo
 */
export interface CreateTodoData {
  title: string
  completed?: boolean
}

/**
 * Data for updating an existing todo
 */
export interface UpdateTodoData {
  title?: string
  completed?: boolean
}

/**
 * Todos API methods
 */
export const todosApi = {
  /**
   * List all todos for the current user
   * Returns just the results array (simplified)
   */
  list: async (): Promise<Todo[]> => {
    const response = await api.get<PaginatedResponse<Todo>>('/api/todos/')
    return response.data.results
  },

  /**
   * List todos with full pagination info
   */
  listPaginated: async (page?: number): Promise<PaginatedResponse<Todo>> => {
    const response = await api.get<PaginatedResponse<Todo>>('/api/todos/', {
      params: { page },
    })
    return response.data
  },

  /**
   * Get a single todo by ID
   */
  get: async (id: string): Promise<Todo> => {
    const response = await api.get<Todo>(`/api/todos/${id}/`)
    return response.data
  },

  /**
   * Create a new todo
   */
  create: async (data: CreateTodoData): Promise<Todo> => {
    const response = await api.post<Todo>('/api/todos/', data)
    return response.data
  },

  /**
   * Update an existing todo
   */
  update: async (id: string, data: UpdateTodoData): Promise<Todo> => {
    const response = await api.patch<Todo>(`/api/todos/${id}/`, data)
    return response.data
  },

  /**
   * Delete a todo
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/todos/${id}/`)
  },

  /**
   * Toggle the completed status of a todo
   */
  toggleComplete: async (id: string): Promise<Todo> => {
    const response = await api.post<Todo>(`/api/todos/${id}/toggle/`)
    return response.data
  },

  /**
   * Copy a todo (create a duplicate)
   */
  copy: async (id: string): Promise<Todo> => {
    const response = await api.post<Todo>(`/api/todos/${id}/copy/`)
    return response.data
  },
}
