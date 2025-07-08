import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { todoApi } from '@/services/api';
import type {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  TodoQueryParameters,
} from '@/types/todo';

const TODOS_QUERY_KEY = 'todos';

// Hook for fetching todos with filtering and sorting
export const useTodos = (params?: TodoQueryParameters) => {
  return useQuery({
    queryKey: [TODOS_QUERY_KEY, params],
    queryFn: () => todoApi.getTodos(params),
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
  });
};

// Hook for fetching a single todo
export const useTodo = (id: string) => {
  return useQuery({
    queryKey: [TODOS_QUERY_KEY, id],
    queryFn: () => todoApi.getTodo(id),
    enabled: !!id,
  });
};

// Hook for creating a new todo
export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (todo: CreateTodoRequest) => todoApi.createTodo(todo),
    onSuccess: (newTodo) => {
      // Invalidate and refetch todos list
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
      toast.success('Todo created successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to create todo';
      toast.error(message);
    },
  });
};

// Hook for updating a todo
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, todo }: { id: string; todo: UpdateTodoRequest }) =>
      todoApi.updateTodo(id, todo),
    onSuccess: (updatedTodo) => {
      // Update the specific todo in cache
      queryClient.setQueryData([TODOS_QUERY_KEY, updatedTodo.id], updatedTodo);
      // Invalidate todos list to ensure consistency
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
      toast.success('Todo updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to update todo';
      toast.error(message);
    },
  });
};

// Hook for deleting a todo
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => todoApi.deleteTodo(id),
    onSuccess: (_, deletedId) => {
      // Remove the todo from cache
      queryClient.removeQueries({ queryKey: [TODOS_QUERY_KEY, deletedId] });
      // Invalidate todos list
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
      toast.success('Todo deleted successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to delete todo';
      toast.error(message);
    },
  });
};

// Hook for bulk deleting completed todos
export const useBulkDeleteCompleted = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => todoApi.bulkDeleteCompleted(),
    onSuccess: (result) => {
      // Invalidate todos list
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
      toast.success(`${result.deletedCount} completed todos deleted!`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to delete completed todos';
      toast.error(message);
    },
  });
};

// Hook for toggling todo completion status
export const useToggleTodo = () => {
  const updateTodo = useUpdateTodo();

  return useMutation({
    mutationFn: (todo: Todo) => {
      const updatedTodo: UpdateTodoRequest = {
        title: todo.title,
        description: todo.description,
        status: todo.status === 'active' ? 'completed' : 'active',
        priority: todo.priority,
        dueDate: todo.dueDate,
      };
      return updateTodo.mutateAsync({ id: todo.id, todo: updatedTodo });
    },
  });
};