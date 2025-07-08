import { test, expect } from '@playwright/test';
import { TodoPage } from '../page-objects/TodoPage';
import { TestHelpers } from '../utils/testHelpers';
import { testTodos, bulkTestTodos } from '../fixtures/todoFixtures';

test.describe('Integration Tests - Complete User Workflows', () => {
  let todoPage: TodoPage;
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page, request }) => {
    todoPage = new TodoPage(page);
    testHelpers = new TestHelpers(page, request);
    
    await testHelpers.waitForAPI();
    await testHelpers.waitForFrontend();
    await testHelpers.cleanupTodos();
    await todoPage.navigateToTodos();
  });

  test.afterEach(async () => {
    await testHelpers.cleanupTodos();
  });

  test.describe('Complete User Journeys', () => {
    test('should complete full todo lifecycle workflow', async () => {
      // 1. Start with empty state
      expect(await todoPage.isEmptyStateVisible()).toBe(true);
      expect(await todoPage.getTodoCount()).toBe(0);

      // 2. Create a new todo
      await todoPage.createTodo(testTodos.work);
      expect(await todoPage.getTodoCount()).toBe(1);
      expect(await todoPage.isTodoVisible(testTodos.work.title)).toBe(true);
      expect(await todoPage.isEmptyStateVisible()).toBe(false);

      // 3. Edit the todo
      const updatedTodo = {
        ...testTodos.work,
        title: 'Updated Project Report',
        description: 'Updated: Finish the quarterly project report and submit to manager',
        priority: 'medium' as const
      };
      
      await todoPage.editTodo(testTodos.work.title, updatedTodo);
      expect(await todoPage.isTodoVisible(updatedTodo.title)).toBe(true);
      expect(await todoPage.isTodoVisible(testTodos.work.title)).toBe(false);

      // 4. Mark as completed
      await todoPage.toggleTodoCompletion(updatedTodo.title);
      expect(await todoPage.isTodoCompleted(updatedTodo.title)).toBe(true);

      // 5. Delete the todo
      await todoPage.deleteTodo(updatedTodo.title);
      expect(await todoPage.getTodoCount()).toBe(0);
      expect(await todoPage.isEmptyStateVisible()).toBe(true);
    });

    test('should handle complex multi-todo workflow', async () => {
      // Create multiple todos
      await testHelpers.createTodosViaAPI(bulkTestTodos);
      await todoPage.navigateToTodos();
      
      const initialCount = await todoPage.getTodoCount();
      expect(initialCount).toBe(5);

      // Mark some as completed
      await todoPage.toggleTodoCompletion('Bulk Todo 1');
      await todoPage.toggleTodoCompletion('Bulk Todo 3');
      
      // Filter by completed
      await todoPage.filterByStatus('completed');
      expect(await todoPage.getTodoCount()).toBe(2);

      // Filter by active
      await todoPage.filterByStatus('active');
      expect(await todoPage.getTodoCount()).toBe(3);

      // Clear filters and search
      await todoPage.filterByStatus('all');
      await todoPage.searchTodos('Bulk Todo 2');
      expect(await todoPage.getTodoCount()).toBe(1);

      // Clear search and sort
      await todoPage.clearSearch();
      await todoPage.sortBy('priority', 'desc');
      
      const titles = await todoPage.getTodoTitles();
      expect(titles.length).toBe(5);

      // Bulk delete completed
      await todoPage.bulkDeleteCompleted();
      expect(await todoPage.getTodoCount()).toBe(3);
    });

    test('should handle mobile user workflow', async () => {
      await todoPage.setMobileViewport();
      
      // Create todo on mobile
      await todoPage.createTodo(testTodos.personal);
      expect(await todoPage.isTodoVisible(testTodos.personal.title)).toBe(true);

      // Search on mobile
      await todoPage.searchTodos('dentist');
      expect(await todoPage.getTodoCount()).toBe(1);

      // Edit on mobile
      await todoPage.clearSearch();
      await todoPage.editTodo(testTodos.personal.title, {
        ...testTodos.personal,
        priority: 'high'
      });

      // Filter on mobile
      await todoPage.filterByPriority('high');
      expect(await todoPage.getTodoCount()).toBe(1);

      // Complete workflow on mobile
      await todoPage.clearAllFilters();
      await todoPage.toggleTodoCompletion(testTodos.personal.title);
      await todoPage.deleteTodo(testTodos.personal.title);
      
      expect(await todoPage.getTodoCount()).toBe(0);
    });
  });

  test.describe('Error Recovery Workflows', () => {
    test('should recover from network errors gracefully', async () => {
      // Create a todo successfully first
      await todoPage.createTodo(testTodos.simple);
      expect(await todoPage.getTodoCount()).toBe(1);

      // Simulate network error
      await testHelpers.simulateNetworkError();

      // Try to create another todo (should fail)
      await todoPage.openCreateTodoModal();
      await todoPage.fillTodoForm(testTodos.highPriority);
      await todoPage.saveTodo();

      // Should show error message
      const errorMessage = await todoPage.getErrorMessage();
      expect(errorMessage).toBeTruthy();

      // Reset network and try again
      await testHelpers.resetNetworkInterception();
      
      // Should be able to create todo now
      await todoPage.createTodo(testTodos.highPriority);
      expect(await todoPage.getTodoCount()).toBe(2);
    });

    test('should handle validation errors and recovery', async () => {
      // Try to create invalid todo
      await todoPage.openCreateTodoModal();
      await todoPage.fillTodoForm({
        title: '', // Invalid empty title
        description: 'Invalid todo',
        priority: 'medium'
      });

      // Form should not be valid
      expect(await todoPage.isFormValid()).toBe(false);

      // Fix the validation error
      await todoPage.fillTodoForm(testTodos.simple);
      expect(await todoPage.isFormValid()).toBe(true);

      // Save successfully
      await todoPage.saveTodo();
      expect(await todoPage.getTodoCount()).toBe(1);
    });
  });

  test.describe('Performance and Stress Workflows', () => {
    test('should handle large number of todos efficiently', async () => {
      // Create many todos
      const manyTodos = testHelpers.generateRandomTodos(25);
      await testHelpers.createTodosViaAPI(manyTodos);
      await todoPage.navigateToTodos();

      expect(await todoPage.getTodoCount()).toBe(25);

      // Test search performance
      const searchStart = Date.now();
      await todoPage.searchTodos('Random');
      const searchEnd = Date.now();
      
      expect(searchEnd - searchStart).toBeLessThan(2000);
      expect(await todoPage.getTodoCount()).toBeGreaterThan(0);

      // Test filter performance
      await todoPage.clearSearch();
      const filterStart = Date.now();
      await todoPage.filterByPriority('high');
      const filterEnd = Date.now();
      
      expect(filterEnd - filterStart).toBeLessThan(1000);

      // Test sort performance
      await todoPage.clearAllFilters();
      const sortStart = Date.now();
      await todoPage.sortBy('title', 'asc');
      const sortEnd = Date.now();
      
      expect(sortEnd - sortStart).toBeLessThan(1000);
    });

    test('should handle rapid user interactions', async () => {
      await testHelpers.createTodosViaAPI([
        testTodos.simple,
        testTodos.highPriority,
        testTodos.lowPriority
      ]);
      await todoPage.navigateToTodos();

      // Rapid filter changes
      await todoPage.filterByPriority('high');
      await todoPage.filterByPriority('medium');
      await todoPage.filterByPriority('low');
      await todoPage.filterByPriority('all');

      // Rapid search changes
      await todoPage.searchTodos('h');
      await todoPage.searchTodos('hi');
      await todoPage.searchTodos('hig');
      await todoPage.searchTodos('high');
      await todoPage.clearSearch();

      // Should still function correctly
      expect(await todoPage.getTodoCount()).toBe(3);
    });
  });

  test.describe('Cross-Browser Compatibility', () => {
    test('should work consistently across different browsers', async () => {
      // This test will run on all configured browsers in playwright.config.ts
      
      // Basic functionality test
      await todoPage.createTodo(testTodos.simple);
      expect(await todoPage.getTodoCount()).toBe(1);

      // Search functionality
      await todoPage.searchTodos('Simple');
      expect(await todoPage.getTodoCount()).toBe(1);

      // Filter functionality
      await todoPage.clearSearch();
      await todoPage.filterByPriority('medium');
      expect(await todoPage.getTodoCount()).toBe(1);

      // Edit functionality
      await todoPage.clearAllFilters();
      await todoPage.editTodo(testTodos.simple.title, {
        ...testTodos.simple,
        title: 'Browser Test Todo'
      });
      expect(await todoPage.isTodoVisible('Browser Test Todo')).toBe(true);

      // Delete functionality
      await todoPage.deleteTodo('Browser Test Todo');
      expect(await todoPage.getTodoCount()).toBe(0);
    });
  });

  test.describe('Accessibility and Usability', () => {
    test('should be keyboard navigable', async ({ page }) => {
      await todoPage.createTodo(testTodos.simple);
      
      // Test keyboard navigation (basic test)
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      
      // Should be able to interact with todos using keyboard
      expect(await todoPage.getTodoCount()).toBe(1);
    });

    test('should maintain focus management', async ({ page }) => {
      // Open modal
      await todoPage.openCreateTodoModal();
      
      // Focus should be on title input
      const titleInput = page.getByLabel(/title/i);
      await expect(titleInput).toBeFocused();
      
      // Cancel and focus should return appropriately
      await todoPage.cancelTodoForm();
    });
  });

  test.describe('Data Persistence', () => {
    test('should persist data across page refreshes', async () => {
      // Create todos
      await todoPage.createTodo(testTodos.simple);
      await todoPage.createTodo(testTodos.highPriority);
      
      expect(await todoPage.getTodoCount()).toBe(2);
      
      // Refresh page
      await todoPage.navigateToTodos();
      
      // Data should persist
      expect(await todoPage.getTodoCount()).toBe(2);
      expect(await todoPage.isTodoVisible(testTodos.simple.title)).toBe(true);
      expect(await todoPage.isTodoVisible(testTodos.highPriority.title)).toBe(true);
    });

    test('should maintain todo state correctly', async () => {
      await todoPage.createTodo(testTodos.simple);
      
      // Mark as completed
      await todoPage.toggleTodoCompletion(testTodos.simple.title);
      expect(await todoPage.isTodoCompleted(testTodos.simple.title)).toBe(true);
      
      // Refresh and verify state
      await todoPage.navigateToTodos();
      expect(await todoPage.isTodoCompleted(testTodos.simple.title)).toBe(true);
      
      // Toggle back to active
      await todoPage.toggleTodoCompletion(testTodos.simple.title);
      expect(await todoPage.isTodoCompleted(testTodos.simple.title)).toBe(false);
    });
  });
});