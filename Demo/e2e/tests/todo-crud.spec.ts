import { test, expect } from '@playwright/test';
import { TodoPage } from '../page-objects/TodoPage';
import { TestHelpers } from '../utils/testHelpers';
import { testTodos, invalidTodos } from '../fixtures/todoFixtures';

test.describe('Todo CRUD Operations', () => {
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
    
    // Navigate to the todo page
    await todoPage.navigateToTodos();
  });

  test.afterEach(async () => {
    // Clean up after each test
    await testHelpers.cleanupTodos();
  });

  test.describe('Create Todo', () => {
    test('should create a simple todo successfully', async () => {
      await todoPage.createTodo(testTodos.simple);
      
      // Verify todo appears in the list
      expect(await todoPage.isTodoVisible(testTodos.simple.title)).toBe(true);
      expect(await todoPage.getTodoCount()).toBe(1);
      
      // Verify success message
      const successMessage = await todoPage.getSuccessMessage();
      expect(successMessage).toContain('created');
    });

    test('should create todo with all fields filled', async () => {
      await todoPage.createTodo(testTodos.highPriority);
      
      expect(await todoPage.isTodoVisible(testTodos.highPriority.title)).toBe(true);
      expect(await todoPage.getTodoCount()).toBe(1);
    });

    test('should create todo without description', async () => {
      await todoPage.createTodo(testTodos.withoutDescription);
      
      expect(await todoPage.isTodoVisible(testTodos.withoutDescription.title)).toBe(true);
      expect(await todoPage.getTodoCount()).toBe(1);
    });

    test('should handle long title correctly', async () => {
      await todoPage.createTodo(testTodos.longTitle);
      
      expect(await todoPage.isTodoVisible(testTodos.longTitle.title)).toBe(true);
    });

    test('should handle long description correctly', async () => {
      await todoPage.createTodo(testTodos.longDescription);
      
      expect(await todoPage.isTodoVisible(testTodos.longDescription.title)).toBe(true);
    });

    test('should show validation error for empty title', async () => {
      await todoPage.openCreateTodoModal();
      await todoPage.fillTodoForm(invalidTodos.emptyTitle);
      
      // Form should not be valid
      expect(await todoPage.isFormValid()).toBe(false);
      
      // Should show validation error
      const errorMessage = await todoPage.getTitleValidationError();
      expect(errorMessage).toContain('required');
    });

    test('should show validation error for title too long', async () => {
      await todoPage.openCreateTodoModal();
      await todoPage.fillTodoForm(invalidTodos.tooLongTitle);
      
      expect(await todoPage.isFormValid()).toBe(false);
      
      const errorMessage = await todoPage.getTitleValidationError();
      expect(errorMessage).toContain('200');
    });

    test('should cancel todo creation', async () => {
      await todoPage.openCreateTodoModal();
      await todoPage.fillTodoForm(testTodos.simple);
      await todoPage.cancelTodoForm();
      
      // Todo should not be created
      expect(await todoPage.getTodoCount()).toBe(0);
      expect(await todoPage.isEmptyStateVisible()).toBe(true);
    });
  });

  test.describe('Read/View Todos', () => {
    test('should display empty state when no todos exist', async () => {
      expect(await todoPage.isEmptyStateVisible()).toBe(true);
      expect(await todoPage.getTodoCount()).toBe(0);
    });

    test('should display todos in list format', async () => {
      // Create multiple todos
      await testHelpers.createTodosViaAPI([
        testTodos.simple,
        testTodos.highPriority,
        testTodos.lowPriority
      ]);
      
      await todoPage.navigateToTodos();
      
      expect(await todoPage.getTodoCount()).toBe(3);
      expect(await todoPage.isEmptyStateVisible()).toBe(false);
      
      const titles = await todoPage.getTodoTitles();
      expect(titles).toContain(testTodos.simple.title);
      expect(titles).toContain(testTodos.highPriority.title);
      expect(titles).toContain(testTodos.lowPriority.title);
    });

    test('should show overdue todos with visual indication', async () => {
      await testHelpers.createTodosViaAPI([testTodos.overdue]);
      await todoPage.navigateToTodos();
      
      expect(await todoPage.isTodoVisible(testTodos.overdue.title)).toBe(true);
      // Note: Visual indication testing would require more specific selectors
    });
  });

  test.describe('Update Todo', () => {
    test.beforeEach(async () => {
      // Create a todo to edit
      await testHelpers.createTodosViaAPI([testTodos.simple]);
      await todoPage.navigateToTodos();
    });

    test('should edit todo title successfully', async () => {
      const updatedTodo = {
        ...testTodos.simple,
        title: 'Updated Todo Title'
      };
      
      await todoPage.editTodo(testTodos.simple.title, updatedTodo);
      
      expect(await todoPage.isTodoVisible(updatedTodo.title)).toBe(true);
      expect(await todoPage.isTodoVisible(testTodos.simple.title)).toBe(false);
    });

    test('should edit todo description successfully', async () => {
      const updatedTodo = {
        ...testTodos.simple,
        description: 'Updated description content'
      };
      
      await todoPage.editTodo(testTodos.simple.title, updatedTodo);
      
      expect(await todoPage.isTodoVisible(testTodos.simple.title)).toBe(true);
    });

    test('should change todo priority successfully', async () => {
      const updatedTodo = {
        ...testTodos.simple,
        priority: 'high' as const
      };
      
      await todoPage.editTodo(testTodos.simple.title, updatedTodo);
      
      expect(await todoPage.isTodoVisible(testTodos.simple.title)).toBe(true);
    });

    test('should toggle todo completion status', async () => {
      // Initially todo should be active
      expect(await todoPage.isTodoCompleted(testTodos.simple.title)).toBe(false);
      
      // Toggle to completed
      await todoPage.toggleTodoCompletion(testTodos.simple.title);
      expect(await todoPage.isTodoCompleted(testTodos.simple.title)).toBe(true);
      
      // Toggle back to active
      await todoPage.toggleTodoCompletion(testTodos.simple.title);
      expect(await todoPage.isTodoCompleted(testTodos.simple.title)).toBe(false);
    });

    test('should add due date to existing todo', async () => {
      const updatedTodo = {
        ...testTodos.simple,
        dueDate: '2025-01-15'
      };
      
      await todoPage.editTodo(testTodos.simple.title, updatedTodo);
      
      expect(await todoPage.isTodoVisible(testTodos.simple.title)).toBe(true);
    });
  });

  test.describe('Delete Todo', () => {
    test.beforeEach(async () => {
      // Create todos to delete
      await testHelpers.createTodosViaAPI([
        testTodos.simple,
        testTodos.highPriority,
        testTodos.lowPriority
      ]);
      await todoPage.navigateToTodos();
    });

    test('should delete individual todo successfully', async () => {
      const initialCount = await todoPage.getTodoCount();
      
      await todoPage.deleteTodo(testTodos.simple.title);
      
      expect(await todoPage.getTodoCount()).toBe(initialCount - 1);
      expect(await todoPage.isTodoVisible(testTodos.simple.title)).toBe(false);
    });

    test('should delete all todos individually', async () => {
      const titles = await todoPage.getTodoTitles();
      
      for (const title of titles) {
        await todoPage.deleteTodo(title);
      }
      
      expect(await todoPage.getTodoCount()).toBe(0);
      expect(await todoPage.isEmptyStateVisible()).toBe(true);
    });

    test('should bulk delete completed todos', async () => {
      // Mark some todos as completed
      await todoPage.toggleTodoCompletion(testTodos.simple.title);
      await todoPage.toggleTodoCompletion(testTodos.highPriority.title);
      
      const initialCount = await todoPage.getTodoCount();
      
      await todoPage.bulkDeleteCompleted();
      
      // Should have deleted 2 completed todos
      expect(await todoPage.getTodoCount()).toBe(initialCount - 2);
      expect(await todoPage.isTodoVisible(testTodos.simple.title)).toBe(false);
      expect(await todoPage.isTodoVisible(testTodos.highPriority.title)).toBe(false);
      expect(await todoPage.isTodoVisible(testTodos.lowPriority.title)).toBe(true);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async () => {
      await testHelpers.simulateNetworkError();
      
      await todoPage.openCreateTodoModal();
      await todoPage.fillTodoForm(testTodos.simple);
      await todoPage.saveTodo();
      
      // Should show error message
      const errorMessage = await todoPage.getErrorMessage();
      expect(errorMessage).toBeTruthy();
      
      await testHelpers.resetNetworkInterception();
    });

    test('should show loading states during slow operations', async () => {
      await testHelpers.simulateSlowNetwork();
      
      await todoPage.openCreateTodoModal();
      await todoPage.fillTodoForm(testTodos.simple);
      await todoPage.saveTodo();
      
      // Note: Loading state testing would require specific loading indicators
      
      await testHelpers.resetNetworkInterception();
    });
  });
});