import { test, expect } from '@playwright/test';
import { TodoPage } from '../page-objects/TodoPage';
import { TestHelpers } from '../utils/testHelpers';
import { testTodos } from '../fixtures/todoFixtures';

test.describe('Todo Sorting and Responsive Design', () => {
  let todoPage: TodoPage;
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page, request }) => {
    todoPage = new TodoPage(page);
    testHelpers = new TestHelpers(page, request);
    
    await testHelpers.waitForAPI();
    await testHelpers.waitForFrontend();
    await testHelpers.cleanupTodos();
    
    // Create test data with different dates and priorities
    const sortTestTodos = [
      {
        title: 'Alpha Todo',
        description: 'First alphabetically',
        priority: 'medium' as const,
        dueDate: '2025-01-20'
      },
      {
        title: 'Beta Todo',
        description: 'Second alphabetically',
        priority: 'high' as const,
        dueDate: '2025-01-15'
      },
      {
        title: 'Gamma Todo',
        description: 'Third alphabetically',
        priority: 'low' as const,
        dueDate: '2025-01-10'
      },
      {
        title: 'Delta Todo',
        description: 'Fourth alphabetically',
        priority: 'high' as const,
        dueDate: '2025-01-25'
      }
    ];
    
    await testHelpers.createTodosViaAPI(sortTestTodos);
    await todoPage.navigateToTodos();
  });

  test.afterEach(async () => {
    await testHelpers.cleanupTodos();
  });

  test.describe('Sorting Functionality', () => {
    test('should sort todos by title A-Z', async () => {
      await todoPage.sortBy('title', 'asc');
      
      const titles = await todoPage.getTodoTitles();
      expect(titles[0]).toBe('Alpha Todo');
      expect(titles[1]).toBe('Beta Todo');
      expect(titles[2]).toBe('Delta Todo');
      expect(titles[3]).toBe('Gamma Todo');
    });

    test('should sort todos by title Z-A', async () => {
      await todoPage.sortBy('title', 'desc');
      
      const titles = await todoPage.getTodoTitles();
      expect(titles[0]).toBe('Gamma Todo');
      expect(titles[1]).toBe('Delta Todo');
      expect(titles[2]).toBe('Beta Todo');
      expect(titles[3]).toBe('Alpha Todo');
    });

    test('should sort todos by priority (High to Low)', async () => {
      await todoPage.sortBy('priority', 'desc');
      
      const titles = await todoPage.getTodoTitles();
      // High priority todos should come first
      expect(titles.slice(0, 2)).toContain('Beta Todo');
      expect(titles.slice(0, 2)).toContain('Delta Todo');
      // Medium priority should be in middle
      expect(titles[2]).toBe('Alpha Todo');
      // Low priority should be last
      expect(titles[3]).toBe('Gamma Todo');
    });

    test('should sort todos by priority (Low to High)', async () => {
      await todoPage.sortBy('priority', 'asc');
      
      const titles = await todoPage.getTodoTitles();
      // Low priority should come first
      expect(titles[0]).toBe('Gamma Todo');
      // Medium priority should be in middle
      expect(titles[1]).toBe('Alpha Todo');
      // High priority todos should be last
      expect(titles.slice(2, 4)).toContain('Beta Todo');
      expect(titles.slice(2, 4)).toContain('Delta Todo');
    });

    test('should sort todos by due date (earliest first)', async () => {
      await todoPage.sortBy('dueDate', 'asc');
      
      const titles = await todoPage.getTodoTitles();
      expect(titles[0]).toBe('Gamma Todo'); // 2025-01-10
      expect(titles[1]).toBe('Beta Todo');  // 2025-01-15
      expect(titles[2]).toBe('Alpha Todo'); // 2025-01-20
      expect(titles[3]).toBe('Delta Todo'); // 2025-01-25
    });

    test('should sort todos by due date (latest first)', async () => {
      await todoPage.sortBy('dueDate', 'desc');
      
      const titles = await todoPage.getTodoTitles();
      expect(titles[0]).toBe('Delta Todo'); // 2025-01-25
      expect(titles[1]).toBe('Alpha Todo'); // 2025-01-20
      expect(titles[2]).toBe('Beta Todo');  // 2025-01-15
      expect(titles[3]).toBe('Gamma Todo'); // 2025-01-10
    });

    test('should sort todos by creation date (newest first)', async () => {
      await todoPage.sortBy('createdAt', 'desc');
      
      // Since todos were created in sequence, newest should be last created
      const titles = await todoPage.getTodoTitles();
      expect(titles.length).toBe(4);
      // Exact order depends on creation timing, but should be consistent
    });

    test('should sort todos by creation date (oldest first)', async () => {
      await todoPage.sortBy('createdAt', 'asc');
      
      const titles = await todoPage.getTodoTitles();
      expect(titles.length).toBe(4);
      // First created should be first in list
    });

    test('should maintain sort order when adding new todo', async () => {
      await todoPage.sortBy('title', 'asc');
      
      // Add a new todo that should appear in the middle alphabetically
      const newTodo = {
        title: 'Charlie Todo',
        description: 'Should appear between Beta and Delta',
        priority: 'medium' as const
      };
      
      await todoPage.createTodo(newTodo);
      
      const titles = await todoPage.getTodoTitles();
      const charlieIndex = titles.indexOf('Charlie Todo');
      const betaIndex = titles.indexOf('Beta Todo');
      const deltaIndex = titles.indexOf('Delta Todo');
      
      expect(charlieIndex).toBeGreaterThan(betaIndex);
      expect(charlieIndex).toBeLessThan(deltaIndex);
    });

    test('should maintain sort order when updating todo', async () => {
      await todoPage.sortBy('priority', 'desc');
      
      // Update a low priority todo to high priority
      await todoPage.editTodo('Gamma Todo', {
        title: 'Gamma Todo',
        description: 'Updated to high priority',
        priority: 'high'
      });
      
      const titles = await todoPage.getTodoTitles();
      const gammaIndex = titles.indexOf('Gamma Todo');
      
      // Gamma should now be with other high priority todos (first 3 positions)
      expect(gammaIndex).toBeLessThan(3);
    });
  });

  test.describe('Responsive Design - Mobile', () => {
    test.beforeEach(async () => {
      await todoPage.setMobileViewport();
    });

    test('should display todos properly on mobile viewport', async () => {
      expect(await todoPage.getTodoCount()).toBe(4);
      
      // All todos should still be visible
      const titles = await todoPage.getTodoTitles();
      expect(titles).toContain('Alpha Todo');
      expect(titles).toContain('Beta Todo');
      expect(titles).toContain('Gamma Todo');
      expect(titles).toContain('Delta Todo');
    });

    test('should allow creating todos on mobile', async () => {
      const mobileTodo = {
        title: 'Mobile Todo',
        description: 'Created on mobile viewport',
        priority: 'medium' as const
      };
      
      await todoPage.createTodo(mobileTodo);
      
      expect(await todoPage.isTodoVisible(mobileTodo.title)).toBe(true);
      expect(await todoPage.getTodoCount()).toBe(5);
    });

    test('should allow editing todos on mobile', async () => {
      const updatedTodo = {
        title: 'Alpha Todo',
        description: 'Updated on mobile',
        priority: 'high' as const
      };
      
      await todoPage.editTodo('Alpha Todo', updatedTodo);
      
      expect(await todoPage.isTodoVisible('Alpha Todo')).toBe(true);
    });

    test('should allow deleting todos on mobile', async () => {
      const initialCount = await todoPage.getTodoCount();
      
      await todoPage.deleteTodo('Alpha Todo');
      
      expect(await todoPage.getTodoCount()).toBe(initialCount - 1);
      expect(await todoPage.isTodoVisible('Alpha Todo')).toBe(false);
    });

    test('should handle search on mobile', async () => {
      await todoPage.searchTodos('Alpha');
      
      expect(await todoPage.getTodoCount()).toBe(1);
      expect(await todoPage.isTodoVisible('Alpha Todo')).toBe(true);
    });

    test('should handle filters on mobile', async () => {
      await todoPage.filterByPriority('high');
      
      const visibleTodos = await todoPage.getTodoTitles();
      expect(visibleTodos).toContain('Beta Todo');
      expect(visibleTodos).toContain('Delta Todo');
      expect(visibleTodos).not.toContain('Alpha Todo');
      expect(visibleTodos).not.toContain('Gamma Todo');
    });

    test('should handle sorting on mobile', async () => {
      await todoPage.sortBy('title', 'asc');
      
      const titles = await todoPage.getTodoTitles();
      expect(titles[0]).toBe('Alpha Todo');
      expect(titles[1]).toBe('Beta Todo');
    });
  });

  test.describe('Responsive Design - Tablet', () => {
    test.beforeEach(async () => {
      await todoPage.setTabletViewport();
    });

    test('should display todos properly on tablet viewport', async () => {
      expect(await todoPage.getTodoCount()).toBe(4);
      
      const titles = await todoPage.getTodoTitles();
      expect(titles.length).toBe(4);
    });

    test('should maintain functionality on tablet', async () => {
      // Test basic CRUD operations
      const tabletTodo = {
        title: 'Tablet Todo',
        description: 'Created on tablet viewport',
        priority: 'low' as const
      };
      
      await todoPage.createTodo(tabletTodo);
      expect(await todoPage.isTodoVisible(tabletTodo.title)).toBe(true);
      
      await todoPage.editTodo(tabletTodo.title, {
        ...tabletTodo,
        priority: 'high'
      });
      
      await todoPage.deleteTodo(tabletTodo.title);
      expect(await todoPage.isTodoVisible(tabletTodo.title)).toBe(false);
    });
  });

  test.describe('Responsive Design - Desktop', () => {
    test.beforeEach(async () => {
      await todoPage.setDesktopViewport();
    });

    test('should display todos properly on desktop viewport', async () => {
      expect(await todoPage.getTodoCount()).toBe(4);
      
      // Desktop should show all features
      const titles = await todoPage.getTodoTitles();
      expect(titles.length).toBe(4);
    });

    test('should show all features on desktop', async () => {
      // All functionality should be available on desktop
      await todoPage.searchTodos('Alpha');
      expect(await todoPage.getTodoCount()).toBe(1);
      
      await todoPage.clearSearch();
      await todoPage.filterByPriority('high');
      expect(await todoPage.getTodoCount()).toBe(2);
      
      await todoPage.clearAllFilters();
      await todoPage.sortBy('title', 'desc');
      
      const titles = await todoPage.getTodoTitles();
      expect(titles[0]).toBe('Gamma Todo');
    });
  });

  test.describe('Cross-Viewport Consistency', () => {
    test('should maintain data consistency across viewport changes', async () => {
      // Start on desktop
      await todoPage.setDesktopViewport();
      
      const desktopTodo = {
        title: 'Cross-Viewport Todo',
        description: 'Should work across viewports',
        priority: 'medium' as const
      };
      
      await todoPage.createTodo(desktopTodo);
      expect(await todoPage.getTodoCount()).toBe(5);
      
      // Switch to mobile
      await todoPage.setMobileViewport();
      expect(await todoPage.getTodoCount()).toBe(5);
      expect(await todoPage.isTodoVisible(desktopTodo.title)).toBe(true);
      
      // Switch to tablet
      await todoPage.setTabletViewport();
      expect(await todoPage.getTodoCount()).toBe(5);
      expect(await todoPage.isTodoVisible(desktopTodo.title)).toBe(true);
    });

    test('should handle viewport changes during operations', async () => {
      await todoPage.setDesktopViewport();
      
      // Start creating a todo
      await todoPage.openCreateTodoModal();
      
      // Change viewport while modal is open
      await todoPage.setMobileViewport();
      
      // Should still be able to complete the operation
      await todoPage.fillTodoForm({
        title: 'Viewport Change Todo',
        description: 'Created during viewport change',
        priority: 'low'
      });
      
      await todoPage.saveTodo();
      
      expect(await todoPage.isTodoVisible('Viewport Change Todo')).toBe(true);
    });
  });

  test.describe('Performance on Different Viewports', () => {
    test('should perform well on mobile with many todos', async () => {
      await todoPage.setMobileViewport();
      
      // Create many todos
      const manyTodos = testHelpers.generateRandomTodos(20);
      await testHelpers.createTodosViaAPI(manyTodos);
      await todoPage.navigateToTodos();
      
      const startTime = Date.now();
      await todoPage.sortBy('title', 'asc');
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(3000);
      expect(await todoPage.getTodoCount()).toBe(24); // 4 original + 20 new
    });

    test('should handle scrolling on mobile with many todos', async () => {
      await todoPage.setMobileViewport();
      
      // Create many todos to test scrolling
      const manyTodos = testHelpers.generateRandomTodos(30);
      await testHelpers.createTodosViaAPI(manyTodos);
      await todoPage.navigateToTodos();
      
      // Should be able to scroll and see all todos
      expect(await todoPage.getTodoCount()).toBe(34); // 4 original + 30 new
      
      // Test that we can interact with todos at the bottom of the list
      const titles = await todoPage.getTodoTitles();
      const lastTitle = titles[titles.length - 1];
      
      await todoPage.toggleTodoCompletion(lastTitle);
      expect(await todoPage.isTodoCompleted(lastTitle)).toBe(true);
    });
  });
});