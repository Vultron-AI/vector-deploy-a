/**
 * E2E Tests for Todo Application
 *
 * These tests verify the todo application functionality and capture screenshots.
 *
 * Required screenshots:
 * - MainPage.png: The main todo list page
 * - LandingPage.png: Same as main page (no separate landing page)
 */

import { test, expect } from '@playwright/test'
import { mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// DO NOT CHANGE THESE NAMES
const MAIN_PAGE_SCREENSHOT_NAME = 'MainPage'
const LANDING_PAGE_SCREENSHOT_NAME = 'LandingPage'

// Ensure screenshots directory exists (ESM-compatible)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const screenshotsDir = join(__dirname, '..', 'screenshots')
if (!existsSync(screenshotsDir)) {
  mkdirSync(screenshotsDir, { recursive: true })
}

test.describe('Todo App E2E Tests', () => {
  /**
   * Test: Landing Page Screenshot
   * Since there's no auth, the landing page is the same as the main todo list.
   */
  test('captures LandingPage screenshot', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Wait for the page to load (either empty state or todo list)
    await expect(
      page.getByTestId('todos.title').or(page.getByTestId('todos.loading'))
    ).toBeVisible()

    // Wait for loading to finish
    await page.waitForTimeout(1000)

    // Capture screenshot
    await page.screenshot({
      path: join(screenshotsDir, LANDING_PAGE_SCREENSHOT_NAME + '.png'),
      fullPage: true,
    })

    // Verify page title exists
    await expect(page).toHaveTitle(/.+/)

    // Verify the main heading is visible
    await expect(page.getByTestId('todos.title')).toHaveText("Aurash's TODO List")
  })

  /**
   * Test: Main Page Screenshot with Todo Functionality
   */
  test('captures MainPage screenshot', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Wait for the app to load
    await expect(page.getByTestId('todos.title')).toBeVisible()

    // Wait for any loading states to complete
    await page.waitForTimeout(1000)

    // Capture main page screenshot
    await page.screenshot({
      path: join(screenshotsDir, MAIN_PAGE_SCREENSHOT_NAME + '.png'),
      fullPage: true,
    })

    // Verify core elements are present
    await expect(page.getByTestId('todos.add.form')).toBeVisible()
    await expect(page.getByTestId('todos.add.input')).toBeVisible()
    await expect(page.getByTestId('todos.add.submit')).toBeVisible()
  })

  /**
   * Test: Add a new todo
   */
  test('can add a new todo', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Wait for the form to be ready
    await expect(page.getByTestId('todos.add.input')).toBeVisible()

    // Type a new todo
    const todoTitle = 'Buy groceries'
    await page.getByTestId('todos.add.input').fill(todoTitle)

    // Submit the form
    await page.getByTestId('todos.add.submit').click()

    // Wait for the todo to appear in the list
    await page.waitForTimeout(500)

    // Verify the todo was added
    const todoItem = page.getByTestId('todos.item').filter({ hasText: todoTitle })
    await expect(todoItem).toBeVisible()

    // Verify the input was cleared
    await expect(page.getByTestId('todos.add.input')).toHaveValue('')
  })

  /**
   * Test: Toggle todo completion
   */
  test('can toggle todo completion', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Add a todo first
    const todoTitle = 'Complete project'
    await page.getByTestId('todos.add.input').fill(todoTitle)
    await page.getByTestId('todos.add.submit').click()
    await page.waitForTimeout(500)

    // Find the todo item
    const todoItem = page.getByTestId('todos.item').filter({ hasText: todoTitle })
    await expect(todoItem).toBeVisible()

    // Click the checkbox to mark as complete
    const checkbox = todoItem.getByTestId('todos.item.checkbox')
    await checkbox.click()
    await page.waitForTimeout(500)

    // Verify the todo shows as completed (badge should appear)
    await expect(todoItem.getByTestId('todos.item.badge')).toBeVisible()

    // Click again to mark as incomplete
    await checkbox.click()
    await page.waitForTimeout(500)

    // Verify the badge is gone
    await expect(todoItem.getByTestId('todos.item.badge')).not.toBeVisible()
  })

  /**
   * Test: Delete a todo
   */
  test('can delete a todo', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Add a todo first
    const todoTitle = 'Todo to delete'
    await page.getByTestId('todos.add.input').fill(todoTitle)
    await page.getByTestId('todos.add.submit').click()
    await page.waitForTimeout(500)

    // Find the todo item
    const todoItem = page.getByTestId('todos.item').filter({ hasText: todoTitle })
    await expect(todoItem).toBeVisible()

    // Click the delete button
    await todoItem.getByTestId('todos.item.delete').click()
    await page.waitForTimeout(500)

    // Verify the todo is gone
    await expect(todoItem).not.toBeVisible()
  })

  /**
   * Test: Empty state validation
   */
  test('shows empty state when no todos', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Wait for loading to complete
    await page.waitForTimeout(1000)

    // If there's an empty state (no todos), verify it
    const emptyState = page.getByTestId('todos.empty')
    const todoList = page.getByTestId('todos.list')

    // Either empty state or todo list should be visible
    const isEmptyVisible = await emptyState.isVisible().catch(() => false)
    const isListVisible = await todoList.isVisible().catch(() => false)

    expect(isEmptyVisible || isListVisible).toBe(true)
  })

  /**
   * Test: Form validation - empty title
   */
  test('validates empty todo title', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Try to submit with empty input - button should be disabled
    const submitButton = page.getByTestId('todos.add.submit')
    await expect(submitButton).toBeDisabled()

    // Type some text
    await page.getByTestId('todos.add.input').fill('Test')
    await expect(submitButton).toBeEnabled()

    // Clear the text
    await page.getByTestId('todos.add.input').clear()
    await expect(submitButton).toBeDisabled()
  })
})
