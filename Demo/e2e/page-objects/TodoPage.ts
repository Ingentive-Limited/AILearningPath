import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface TodoData {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export class TodoPage extends BasePage {
  // Main page elements
  private readonly addTodoButton: Locator;
  private readonly searchInput: Locator;
  private readonly todoList: Locator;
  private readonly emptyState: Locator;
  private readonly bulkDeleteButton: Locator;

  // Filter elements
  private readonly statusFilter: Locator;
  private readonly priorityFilter: Locator;
  private readonly dateFilter: Locator;
  private readonly clearFiltersButton: Locator;

  // Sort elements
  private readonly sortDropdown: Locator;

  // Modal elements
  private readonly modal: Locator;
  private readonly modalTitle: Locator;
  private readonly titleInput: Locator;
  private readonly descriptionInput: Locator;
  private readonly prioritySelect: Locator;
  private readonly dueDateInput: Locator;
  private readonly saveButton: Locator;
  private readonly cancelButton: Locator;
  private readonly modalCloseButton: Locator;

  // Todo item elements
  private readonly todoItems: Locator;
  private readonly todoCheckboxes: Locator;
  private readonly todoTitles: Locator;
  private readonly todoPriorities: Locator;
  private readonly todoDueDates: Locator;
  private readonly todoEditButtons: Locator;
  private readonly todoDeleteButtons: Locator;

  // Error and success messages
  private readonly errorMessage: Locator;
  private readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    // Main page elements
    this.addTodoButton = page.getByTestId('add-todo-button');
    this.searchInput = page.getByTestId('search-input');
    this.todoList = page.getByTestId('todo-list');
    this.emptyState = page.getByTestId('empty-state');
    this.bulkDeleteButton = page.getByRole('button', { name: /delete selected/i });

    // Filter elements
    this.statusFilter = page.getByTestId('status-filter');
    this.priorityFilter = page.getByTestId('priority-filter');
    this.dateFilter = page.getByTestId('date-filter');
    this.clearFiltersButton = page.getByTestId('clear-filters-button');

    // Sort elements
    this.sortDropdown = page.getByTestId('sort-dropdown');

    // Modal elements
    this.modal = page.locator('[data-slot="dialog-content"]');
    this.modalTitle = this.modal.getByRole('heading');
    this.titleInput = page.getByTestId('title-input');
    this.descriptionInput = page.getByTestId('description-input');
    this.prioritySelect = page.getByTestId('priority-select');
    this.dueDateInput = page.getByTestId('due-date-input');
    this.saveButton = this.modal.getByRole('button', { name: /create todo|update todo/i });
    this.cancelButton = this.modal.getByRole('button', { name: /cancel/i });
    this.modalCloseButton = this.modal.getByRole('button', { name: /close/i });

    // Todo item elements
    this.todoItems = page.getByTestId('todo-item');
    this.todoCheckboxes = page.getByRole('checkbox');
    this.todoTitles = page.getByTestId('todo-title');
    this.todoPriorities = page.getByTestId('todo-priority');
    this.todoDueDates = page.getByTestId('todo-due-date');
    this.todoEditButtons = page.getByRole('button', { name: /edit/i });
    this.todoDeleteButtons = page.getByRole('button', { name: /delete/i });

    // Messages
    this.errorMessage = page.getByRole('alert').filter({ hasText: /error/i });
    this.successMessage = page.locator('.sonner-toast').filter({ hasText: /success|created|updated|deleted/i });
  }

  // Navigation
  async navigateToTodos() {
    await this.goto('/');
    await this.waitForPageLoad();
  }

  // Todo creation
  async openCreateTodoModal() {
    await this.clickElement(this.addTodoButton);
    // Wait longer for modal to appear
    await this.waitForElement(this.modal, 10000);
    await expect(this.modalTitle).toContainText(/create|add|new/i);
  }

  async fillTodoForm(todoData: TodoData) {
    await this.fillInput(this.titleInput, todoData.title);
    
    if (todoData.description) {
      await this.fillInput(this.descriptionInput, todoData.description);
    }
    
    if (todoData.priority) {
      await this.clickElement(this.prioritySelect);
      await this.page.getByRole('option', { name: todoData.priority }).click();
    }
    
    if (todoData.dueDate) {
      await this.fillInput(this.dueDateInput, todoData.dueDate);
    }
  }

  async saveTodo() {
    await this.clickElement(this.saveButton);
    await this.page.waitForTimeout(500); // Wait for save operation
  }

  async cancelTodoForm() {
    await this.clickElement(this.cancelButton);
    await this.page.waitForTimeout(500);
  }

  async createTodo(todoData: TodoData) {
    await this.openCreateTodoModal();
    await this.fillTodoForm(todoData);
    await this.saveTodo();
  }

  // Todo reading/viewing
  async getTodoCount(): Promise<number> {
    return await this.getElementCount(this.todoItems);
  }

  async getTodoTitles(): Promise<string[]> {
    const titles: string[] = [];
    const count = await this.getTodoCount();
    
    for (let i = 0; i < count; i++) {
      const title = await this.todoTitles.nth(i).textContent();
      if (title) titles.push(title);
    }
    
    return titles;
  }

  async getTodoByTitle(title: string): Promise<Locator> {
    return this.todoItems.filter({ hasText: title });
  }

  async isTodoVisible(title: string): Promise<boolean> {
    const todo = await this.getTodoByTitle(title);
    return await this.isVisible(todo);
  }

  async isTodoCompleted(title: string): Promise<boolean> {
    const todo = await this.getTodoByTitle(title);
    const checkbox = todo.getByRole('checkbox');
    return await checkbox.isChecked();
  }

  // Todo updating
  async editTodo(currentTitle: string, newData: TodoData) {
    const todo = await this.getTodoByTitle(currentTitle);
    const editButton = todo.getByRole('button', { name: /edit/i });
    await this.clickElement(editButton);
    
    await this.waitForElement(this.modal);
    await expect(this.modalTitle).toContainText(/edit|update/i);
    
    // Clear existing values and fill new ones
    await this.titleInput.clear();
    await this.fillTodoForm(newData);
    await this.saveTodo();
  }

  async toggleTodoCompletion(title: string) {
    const todo = await this.getTodoByTitle(title);
    const checkbox = todo.getByRole('checkbox');
    await this.clickElement(checkbox);
    await this.page.waitForTimeout(500); // Wait for update
  }

  // Todo deletion
  async deleteTodo(title: string) {
    const todo = await this.getTodoByTitle(title);
    const deleteButton = todo.getByRole('button', { name: /delete/i });
    await this.clickElement(deleteButton);
    
    // Handle confirmation dialog if present
    const confirmButton = this.page.getByRole('button', { name: /confirm|yes|delete/i });
    if (await this.isVisible(confirmButton)) {
      await this.clickElement(confirmButton);
    }
    
    await this.page.waitForTimeout(500); // Wait for deletion
  }

  async bulkDeleteCompleted() {
    await this.clickElement(this.bulkDeleteButton);
    
    // Handle confirmation dialog if present
    const confirmButton = this.page.getByRole('button', { name: /confirm|yes|delete/i });
    if (await this.isVisible(confirmButton)) {
      await this.clickElement(confirmButton);
    }
    
    await this.page.waitForTimeout(500); // Wait for deletion
  }

  // Search functionality
  async searchTodos(searchTerm: string) {
    await this.fillInput(this.searchInput, searchTerm);
    await this.page.waitForTimeout(1000); // Wait for debounced search
  }

  async clearSearch() {
    await this.searchInput.clear();
    await this.page.waitForTimeout(1000);
  }

  // Filter functionality
  async filterByStatus(status: 'all' | 'active' | 'completed') {
    await this.clickElement(this.statusFilter);
    await this.page.getByRole('option', { name: status }).click();
    await this.page.waitForTimeout(500);
  }

  async filterByPriority(priority: 'all' | 'high' | 'medium' | 'low') {
    await this.clickElement(this.priorityFilter);
    await this.page.getByRole('option', { name: priority }).click();
    await this.page.waitForTimeout(500);
  }

  async filterByDate(dateFilter: 'all' | 'today' | 'this week' | 'overdue') {
    await this.clickElement(this.dateFilter);
    await this.page.getByRole('option', { name: dateFilter }).click();
    await this.page.waitForTimeout(500);
  }

  async clearAllFilters() {
    if (await this.isVisible(this.clearFiltersButton)) {
      await this.clickElement(this.clearFiltersButton);
      await this.page.waitForTimeout(500);
    }
  }

  // Sort functionality
  async sortBy(sortOption: 'dueDate' | 'priority' | 'createdAt' | 'title', direction: 'asc' | 'desc' = 'asc') {
    await this.clickElement(this.sortDropdown);
    await this.page.getByRole('option', { name: new RegExp(`${sortOption}.*${direction}`, 'i') }).click();
    await this.page.waitForTimeout(500);
  }

  // Validation and error handling
  async getErrorMessage(): Promise<string> {
    if (await this.isVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return '';
  }

  async getSuccessMessage(): Promise<string> {
    if (await this.isVisible(this.successMessage)) {
      return await this.getText(this.successMessage);
    }
    return '';
  }

  async isEmptyStateVisible(): Promise<boolean> {
    return await this.isVisible(this.emptyState);
  }

  // Form validation
  async isFormValid(): Promise<boolean> {
    return await this.isEnabled(this.saveButton);
  }

  async getTitleValidationError(): Promise<string> {
    const errorElement = this.modal.locator('[data-testid="title-error"]');
    if (await this.isVisible(errorElement)) {
      return await this.getText(errorElement);
    }
    return '';
  }

  // Responsive design testing helpers
  async setMobileViewport() {
    await this.page.setViewportSize({ width: 375, height: 667 });
  }

  async setTabletViewport() {
    await this.page.setViewportSize({ width: 768, height: 1024 });
  }

  async setDesktopViewport() {
    await this.page.setViewportSize({ width: 1920, height: 1080 });
  }
}