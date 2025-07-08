import axios from 'axios';
import type {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  TodoQueryParameters,
  TodoListResponse,
  BulkDeleteResponse,
} from '@/types/todo';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const todoApi = {
  // Get all todos with optional filtering and sorting
  getTodos: async (params?: TodoQueryParameters): Promise<TodoListResponse> => {
    const response = await api.get<TodoListResponse>('/todos', { params });
    return response.data;
  },

  // Get a single todo by ID
  getTodo: async (id: string): Promise<Todo> => {
    const response = await api.get<Todo>(`/todos/${id}`);
    return response.data;
  },

  // Create a new todo
  createTodo: async (todo: CreateTodoRequest): Promise<Todo> => {
    const response = await api.post<Todo>('/todos', todo);
    return response.data;
  },

  // Update an existing todo
  updateTodo: async (id: string, todo: UpdateTodoRequest): Promise<Todo> => {
    const response = await api.put<Todo>(`/todos/${id}`, todo);
    return response.data;
  },

  // Delete a todo
  deleteTodo: async (id: string): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },

  // Bulk delete completed todos
  bulkDeleteCompleted: async (): Promise<BulkDeleteResponse> => {
    const response = await api.delete<BulkDeleteResponse>('/todos/completed');
    return response.data;
  },
};

export default api;