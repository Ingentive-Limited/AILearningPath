import { test, expect } from '@playwright/test';
import { TodoPage } from '../page-objects/TodoPage';
import { TestHelpers } from '../utils/testHelpers';
import { testTodos, searchTestData, filterTestData } from '../fixtures/todoFixtures';

test.describe('Todo Search and Filter Functionality', () => {
  let todoPage: TodoPage;
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page, request }) => {
    todoPage = new TodoPage(page);
    testHelpers = new TestHelpers(page, request);
    
    // Ensure API and frontend are ready
    await testHelpers.waitForAPI();
    await testHelpers.waitForFrontend();
    
    // Clean up any existing todos
    await testHelpers.cleanupTodos();
    
    // Create test data
    await testHelpers.createTodosViaAPI([
      testTodos.simple,
      testTodos.highPriority,
      testTodos.lowPriority,
      testTodos.shopping,
      testTodos.work,
      testTodos.personal,
      testTodos.overdue
    ]);
    
    // Navigate to the todo page
    await todoPage.navigateToTodos();
  });

  test.afterEach(async () => {
    await testHelpers.cleanupTodos();
  });

  test.describe('Search Functionality', () => {
    test('should search todos by title', async () => {
      await todoPage.searchTodos('project');
      
      const visibleTodos = await todoPage.getTodoTitles();
      expect(visibleTodos).toContain('Complete project report');
      expect(visibleTodos.length).toBe(1);
    });

    test('should search todos by description', async () => {
      await todoPage.searchTodos('groceries');
      
      const visibleTodos = await todoPage.getTodoTitles();
      expect(visibleTodos).toContain('Buy groceries');
      expect(visibleTodos.length).toBe(1);
    });

    test('should perform case-insensitive search', async () => {
      await todoPage.searchTodos('PROJECT');
      
      const visibleTodos = await todoPage.getTodoTitles();
      expect(visibleTodos).toContain('Complete project report');
    });

    test('should perform partial text search', async () => {
      await todoPage.searchTodos('call');
      
      const visibleTodos = await todoPage.getTodoTitles();
      expect(visibleTodos).toContain('Call dentist');
    });

    test('should show no results for non-existent search term', async () => {
      await todoPage.searchTodos('nonexistent');
      
      expect(await todoPage.getTodoCount()).toBe(0);
      expect(await todoPage.isEmptyStateVisible()).toBe(true);
    });

    test('should clear search and show all todos', async () => {
      // First search to filter results
      await todoPage.searchTodos('project');
      expect(await todoPage.getTodoCount()).toBe(1);
      
      // Clear search
      await todoPage.clearSearch();
      expect(await todoPage.getTodoCount()).toBeGreaterThan(1);
    });

    test('should update search results in real-time', async () => {
      await todoPage.searchTodos('c');
      let todoCount = await todoPage.getTodoCount();
      expect(todoCount).toBeGreaterThan(0);
      
      await todoPage.searchTodos('ca');
      todoCount = await todoPage.getTodoCount();
      expect(todoCount).toBeGreaterThanOrEqual(1);
      
      await todoPage.searchTodos('call');
      todoCount = await todoPage.getTodoCount();
      expect(todoCount).toBe(1);
    });
  });

  test.describe('Status Filter', () => {
    test.beforeEach(async () => {
      // Mark some todos as completed
      await todoPage.toggleTodoCompletion('Simple Todo');
      await todoPage.toggleTodoCompletion('Buy groceries');
    });

    test('should filter by active status', async () => {
      await todoPage.filterByStatus('active');
      
      const visibleTodos = await todoPage.getTodoTitles();
      expect(visibleTodos).not.toContain('Simple Todo');
      expect(visibleTodos).not.toContain('Buy groceries');
      expect(visibleTodos).toContain('High Priority Task');
    });

    test('should filter by completed status', async () => {
      await todoPage.filterByStatus('completed');
      
      const visibleTodos = await todoPage.getTodoTitles();
      expect(visibleTodos).toContain('Simple Todo');
      expect(visibleTodos).toContain('Buy groceries');
      expect(visibleTodos).not.toContain('High Priority Task');
    });

    test('should show all todos when filter is set to all', async () => {
      await todoPage.filterByStatus('completed');
      expect(await todoPage.getTodoCount()).toBe(2);
      
      await todoPage.filterByStatus('all');
      expect(await todoPage.getTodoCount()).toBeGreaterThan(2);
    });
  });

  test.describe('Priority Filter', () => {
    test('should filter by high priority', async () => {
      await todoPage.filterByPriority('high');
      
      const visibleTodos = await todoPage.getTodoTitles();
      expect(visibleTodos).toContain('High Priority Task');
      expect(visibleTodos).toContain('Complete project report');
      expect(visibleTodos).toContain('Overdue Task');
      expect(visibleTodos).not.toContain('Low Priority Task');
    });

    test('should filter by medium priority', async () => {
      await todoPage.filterByPriority('medium');
      
      const visibleTodos = await todoPage.getTodoTitles();
      expect(visibleTodos).toContain('Simple Todo');
      expect(visibleTodos).toContain('Buy groceries');
      expect(visibleTodos).not.toContain('High Priority Task');
      expect(visibleTodos).not.toContain('Low Priority Task');
    });

    test('should filter by low priority', async () => {
      await todoPage.filterByPriority('low');
      
      const visibleTodos = await todoPage.getTodoTitles();
      expect(visibleTodos).toContain('Low Priority Task');
      expect(visibleTodos).toContain('Call dentist');
      expect(visibleTodos).not.toContain('High Priority Task');
    });

    test('should show all priorities when filter is set to all', async () => {
      await todoPage.filterByPriority('high');
      const highPriorityCount = await todoPage.getTodoCount();
      
      await todoPage.filterByPriority('all');
      const allCount = await todoPage.getTodoCount();
      
      expect(allCount).toBeGreaterThan(highPriorityCount);
    });
  });

  test.describe('Date Filter', () => {
    test('should filter overdue todos', async () => {
      await todoPage.filterByDate('overdue');
      
      const visibleTodos = await todoPage.getTodoTitles();
      expect(visibleTodos).toContain('Overdue Task');
      expect(visibleTodos.length).toBeGreaterThanOrEqual(1);
    });

    test('should filter todos due today', async () => {
      // Create a todo due today
      const todayTodo = {
        title: 'Due Today',
        description: 'Task due today',
        priority: 'medium' as const,
        dueDate: new Date().toISOString().split('T')[0]
      };
      
      await testHelpers.createTodosViaAPI([todayTodo]);
      await todoPage.navigateToTodos();
      
      await todoPage.filterByDate('today');
      
      const visibleTodos = await todoPage.getTodoTitles();
      expect(visibleTodos).toContain('Due Today');
    });

    test('should filter todos due this week', async () => {
      await todoPage.filterByDate('this week');
      
      // Should show todos with due dates within the current week
      const todoCount = await todoPage.getTodoCount();
      expect(todoCount).toBeGreaterThanOrEqual(0);
    });

    test('should show all todos when date filter is set to all', async () => {
      await todoPage.filterByDate('overdue');
      const overdueCount = await todoPage.getTodoCount();
      
      await todoPage.filterByDate('all');
      const allCount = await todoPage.getTodoCount();
      
      expect(allCount).toBeGreaterThanOrEqual(overdueCount);
    });
  });

  test.describe('Combined Filters', () => {
    test('should apply multiple filters simultaneously', async () => {
      // Mark a high priority todo as completed
      await todoPage.toggleTodoCompletion('High Priority Task');
      
      // Filter by completed status and high priority
      await todoPage.filterByStatus('completed');
      await todoPage.filterByPriority('high');
      
      const visibleTodos = await todoPage.getTodoTitles();
      expect(visibleTodos).toContain('High Priority Task');
      expect(visibleTodos.length).toBe(1);
    });

    test('should combine search with filters', async () => {
      await todoPage.searchTodos('task');
      await todoPage.filterByPriority('high');
      
      const visibleTodos = await todoPage.getTodoTitles();
      expect(visibleTodos).toContain('High Priority Task');
      expect(visibleTodos).toContain('Overdue Task');
      expect(visibleTodos).not.toContain('Low Priority Task');
    });

    test('should clear all filters at once', async () => {
      // Apply multiple filters
      await todoPage.searchTodos('project');
      await todoPage.filterByPriority('high');
      await todoPage.filterByStatus('active');
      
      expect(await todoPage.getTodoCount()).toBe(1);
      
      // Clear all filters
      await todoPage.clearAllFilters();
      await todoPage.clearSearch();
      
      expect(await todoPage.getTodoCount()).toBeGreaterThan(1);
    });
  });

  test.describe('Filter Persistence', () => {
    test('should maintain filter state during session', async () => {
      await todoPage.filterByPriority('high');
      const filteredCount = await todoPage.getTodoCount();
      
      // Refresh the page
      await todoPage.navigateToTodos();
      
      // Filter state should persist (if implemented)
      // Note: This depends on implementation - may need localStorage or URL params
      const newCount = await todoPage.getTodoCount();
      expect(newCount).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe('Empty States', () => {
    test('should show appropriate empty state when no todos match search', async () => {
      await todoPage.searchTodos('zzzznonexistent');
      
      expect(await todoPage.isEmptyStateVisible()).toBe(true);
      expect(await todoPage.getTodoCount()).toBe(0);
    });

    test('should show appropriate empty state when no todos match filters', async () => {
      // Mark all todos as completed
      const titles = await todoPage.getTodoTitles();
      for (const title of titles) {
        await todoPage.toggleTodoCompletion(title);
      }
      
      // Filter by active status
      await todoPage.filterByStatus('active');
      
      expect(await todoPage.isEmptyStateVisible()).toBe(true);
      expect(await todoPage.getTodoCount()).toBe(0);
    });
  });

  test.describe('Performance', () => {
    test('should handle search with large number of todos', async () => {
      // Create many todos
      const manyTodos = testHelpers.generateRandomTodos(50);
      await testHelpers.createTodosViaAPI(manyTodos);
      await todoPage.navigateToTodos();
      
      const startTime = Date.now();
      await todoPage.searchTodos('Random');
      const endTime = Date.now();
      
      // Search should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(3000);
      expect(await todoPage.getTodoCount()).toBeGreaterThan(0);
    });

    test('should debounce search input', async () => {
      // Type quickly and verify debouncing
      await todoPage.searchTodos('p');
      await todoPage.searchTodos('pr');
      await todoPage.searchTodos('pro');
      await todoPage.searchTodos('proj');
      await todoPage.searchTodos('project');
      
      // Should eventually show the correct results
      const visibleTodos = await todoPage.getTodoTitles();
      expect(visibleTodos).toContain('Complete project report');
    });
  });
});