export type Priority = 'low' | 'medium' | 'high';
export type TodoStatus = 'active' | 'completed';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: Priority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
}

export interface UpdateTodoRequest {
  title: string;
  description?: string;
  status: TodoStatus;
  priority: Priority;
  dueDate?: string;
}

export interface TodoQueryParameters {
  status?: string;
  priority?: string;
  search?: string;
  sortBy?: string;
  sortDirection?: string;
}

export interface TodoListResponse {
  data: Todo[];
  totalCount: number;
}

export interface BulkDeleteResponse {
  deletedCount: number;
}

export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  errors?: Record<string, string[]>;
}