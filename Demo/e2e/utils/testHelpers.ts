import { Page, APIRequestContext } from '@playwright/test';
import { TodoPage, TodoData } from '../page-objects/TodoPage';

export class TestHelpers {
  private page: Page;
  private apiContext: APIRequestContext;
  private todoPage: TodoPage;

  constructor(page: Page, apiContext: APIRequestContext) {
    this.page = page;
    this.apiContext = apiContext;
    this.todoPage = new TodoPage(page);
  }

  /**
   * Clean up all todos via API for faster test setup
   */
  async cleanupTodos(): Promise<void> {
    try {
      // Get all todos
      const response = await this.apiContext.get('http://localhost:5000/api/todos');
      if (response.ok()) {
        const data = await response.json();
        const todos = data.data || [];

        // Delete each todo
        for (const todo of todos) {
          await this.apiContext.delete(`http://localhost:5000/api/todos/${todo.id}`);
        }
      }
    } catch (error) {
      console.warn('Failed to cleanup todos via API:', error);
      // Fallback to UI cleanup if API fails
      await this.cleanupTodosViaUI();
    }
  }

  /**
   * Fallback cleanup method using UI
   */
  private async cleanupTodosViaUI(): Promise<void> {
    await this.todoPage.navigateToTodos();
    
    // Try bulk delete first
    try {
      await this.todoPage.bulkDeleteCompleted();
    } catch {
      // If bulk delete fails, delete individually
    }

    // Delete remaining todos one by one
    let todoCount = await this.todoPage.getTodoCount();
    while (todoCount > 0) {
      const titles = await this.todoPage.getTodoTitles();
      if (titles.length > 0) {
        await this.todoPage.deleteTodo(titles[0]);
        await this.page.waitForTimeout(500);
      }
      todoCount = await this.todoPage.getTodoCount();
    }
  }

  /**
   * Create multiple todos via API for faster test setup
   */
  async createTodosViaAPI(todos: TodoData[]): Promise<void> {
    for (const todo of todos) {
      try {
        await this.apiContext.post('http://localhost:5000/api/todos', {
          data: {
            title: todo.title,
            description: todo.description || '',
            priority: todo.priority || 'medium',
            dueDate: todo.dueDate || null
          }
        });
      } catch (error) {
        console.warn(`Failed to create todo "${todo.title}" via API:`, error);
        // Fallback to UI creation
        await this.todoPage.createTodo(todo);
      }
    }
  }

  /**
   * Create a single todo via API
   */
  async createTodoViaAPI(todo: TodoData): Promise<string | null> {
    try {
      const response = await this.apiContext.post('http://localhost:5000/api/todos', {
        data: {
          title: todo.title,
          description: todo.description || '',
          priority: todo.priority || 'medium',
          dueDate: todo.dueDate || null
        }
      });

      if (response.ok()) {
        const createdTodo = await response.json();
        return createdTodo.id;
      }
    } catch (error) {
      console.warn(`Failed to create todo "${todo.title}" via API:`, error);
    }
    return null;
  }

  /**
   * Wait for API to be ready
   */
  async waitForAPI(timeout: number = 30000): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        const response = await this.apiContext.get('http://localhost:5000/api/todos');
        if (response.ok()) {
          return true;
        }
      } catch {
        // API not ready yet
      }
      
      await this.page.waitForTimeout(1000);
    }
    
    return false;
  }

  /**
   * Wait for frontend to be ready
   */
  async waitForFrontend(timeout: number = 30000): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        await this.page.goto('/', { timeout: 5000 });
        await this.page.waitForLoadState('networkidle', { timeout: 5000 });
        return true;
      } catch {
        // Frontend not ready yet
      }
      
      await this.page.waitForTimeout(1000);
    }
    
    return false;
  }

  /**
   * Take a screenshot with timestamp
   */
  async takeTimestampedScreenshot(name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
  }

  /**
   * Generate random todo data for testing
   */
  generateRandomTodo(): TodoData {
    const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    const randomId = Math.random().toString(36).substring(7);
    
    return {
      title: `Random Todo ${randomId}`,
      description: `This is a randomly generated todo for testing purposes - ${randomId}`,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
  }

  /**
   * Generate multiple random todos
   */
  generateRandomTodos(count: number): TodoData[] {
    return Array.from({ length: count }, () => this.generateRandomTodo());
  }

  /**
   * Verify API response structure
   */
  async verifyTodoAPIResponse(todoId: string): Promise<boolean> {
    try {
      const response = await this.apiContext.get(`http://localhost:5000/api/todos/${todoId}`);
      if (!response.ok()) return false;

      const todo = await response.json();
      
      // Verify required fields
      const requiredFields = ['id', 'title', 'status', 'priority', 'createdAt', 'updatedAt'];
      return requiredFields.every(field => todo.hasOwnProperty(field));
    } catch {
      return false;
    }
  }

  /**
   * Get current todo count via API
   */
  async getTodoCountViaAPI(): Promise<number> {
    try {
      const response = await this.apiContext.get('http://localhost:5000/api/todos');
      if (response.ok()) {
        const data = await response.json();
        return data.totalCount || data.data?.length || 0;
      }
    } catch {
      // Fallback to UI count
    }
    return await this.todoPage.getTodoCount();
  }

  /**
   * Simulate network delay for testing loading states
   */
  async simulateSlowNetwork(): Promise<void> {
    await this.page.route('**/api/todos**', async (route) => {
      await this.page.waitForTimeout(2000); // 2 second delay
      await route.continue();
    });
  }

  /**
   * Simulate network error for testing error handling
   */
  async simulateNetworkError(): Promise<void> {
    await this.page.route('**/api/todos**', async (route) => {
      await route.abort('failed');
    });
  }

  /**
   * Reset network interception
   */
  async resetNetworkInterception(): Promise<void> {
    await this.page.unroute('**/api/todos**');
  }

  /**
   * Wait for element to be stable (not moving/changing)
   */
  async waitForElementStable(selector: string, timeout: number = 5000): Promise<void> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible', timeout });
    
    // Wait for element to stop moving/changing
    let previousBoundingBox = await element.boundingBox();
    let stableCount = 0;
    const requiredStableChecks = 3;
    
    while (stableCount < requiredStableChecks) {
      await this.page.waitForTimeout(100);
      const currentBoundingBox = await element.boundingBox();
      
      if (JSON.stringify(previousBoundingBox) === JSON.stringify(currentBoundingBox)) {
        stableCount++;
      } else {
        stableCount = 0;
        previousBoundingBox = currentBoundingBox;
      }
    }
  }

  /**
   * Get console errors from the page
   */
  getConsoleErrors(): string[] {
    const errors: string[] = [];
    
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    return errors;
  }

  /**
   * Check for JavaScript errors on the page
   */
  async checkForJavaScriptErrors(): Promise<string[]> {
    const errors: string[] = [];
    
    this.page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    
    return errors;
  }
}