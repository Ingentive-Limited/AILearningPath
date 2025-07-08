import { useState } from 'react';
import { TodoItem } from './TodoItem';
import { TodoForm } from './TodoForm';
import { TodoFilters } from './TodoFilters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, CheckCircle2, Circle, AlertCircle, Trash2 } from 'lucide-react';
import { useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo, useBulkDeleteCompleted } from '@/hooks/useTodos';
import type { Todo, CreateTodoRequest, UpdateTodoRequest } from '@/types/todo';
import { filterTodos, sortTodos } from '@/lib/todo-utils';

export function TodoList() {
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>(undefined);
  const [selectedTodos, setSelectedTodos] = useState<Set<string>>(new Set());
  
  // Filter and sort state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dueDateFilter, setDueDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // API hooks
  const { data: todosResponse, isLoading, error } = useTodos();
  const createTodoMutation = useCreateTodo();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();
  const bulkDeleteMutation = useBulkDeleteCompleted();

  // Extract todos array from response
  const todos = todosResponse?.data || [];

  // Filter and sort todos
  const filteredTodos = filterTodos(todos, {
    search,
    status: statusFilter,
    priority: priorityFilter,
    dueDate: dueDateFilter,
  });

  const sortedTodos = sortTodos(filteredTodos, sortBy, sortDirection);

  // Event handlers
  const handleCreateTodo = async (data: CreateTodoRequest) => {
    try {
      await createTodoMutation.mutateAsync(data);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  const handleUpdateTodo = async (id: string, data: UpdateTodoRequest) => {
    try {
      await updateTodoMutation.mutateAsync({ id, todo: data });
      setEditingTodo(undefined);
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodoMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    const newStatus = todo.status === 'completed' ? 'active' : 'completed';
    await handleUpdateTodo(todo.id, { 
      title: todo.title,
      description: todo.description,
      status: newStatus,
      priority: todo.priority,
      dueDate: todo.dueDate,
    });
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingTodo(undefined);
    setShowForm(false);
  };

  const handleSelectTodo = (todoId: string, selected: boolean) => {
    const newSelected = new Set(selectedTodos);
    if (selected) {
      newSelected.add(todoId);
    } else {
      newSelected.delete(todoId);
    }
    setSelectedTodos(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTodos.size === sortedTodos.length) {
      setSelectedTodos(new Set());
    } else {
      setSelectedTodos(new Set(sortedTodos.map(todo => todo.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTodos.size === 0) return;
    
    try {
      // For now, delete selected todos one by one since we don't have bulk delete by IDs
      for (const todoId of selectedTodos) {
        await deleteTodoMutation.mutateAsync(todoId);
      }
      setSelectedTodos(new Set());
    } catch (error) {
      console.error('Failed to delete todos:', error);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setDueDateFilter('all');
  };

  // Stats
  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo: Todo) => todo.status === 'completed').length;
  const activeTodos = todos.filter((todo: Todo) => todo.status === 'active').length;
  const overdueTodos = todos.filter((todo: Todo) => {
    if (!todo.dueDate || todo.status === 'completed') return false;
    return new Date(todo.dueDate) < new Date();
  }).length;

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load todos. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">My Todos</CardTitle>
            <Button onClick={() => setShowForm(true)} disabled={showForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Todo
            </Button>
          </div>
          
          <div className="flex gap-4 mt-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Circle className="h-3 w-3" />
              {activeTodos} Active
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {completedTodos} Completed
            </Badge>
            {overdueTodos > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {overdueTodos} Overdue
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Todo Form */}
      <TodoForm
        todo={editingTodo}
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) {
            setEditingTodo(undefined);
          }
        }}
      />

      {/* Filters */}
      <TodoFilters
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        priority={priorityFilter}
        onPriorityChange={setPriorityFilter}
        dueDate={dueDateFilter}
        onDueDateChange={setDueDateFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortDirection={sortDirection}
        onSortDirectionChange={(direction: string) => setSortDirection(direction as 'asc' | 'desc')}
        onClearFilters={clearFilters}
        totalCount={totalTodos}
        filteredCount={sortedTodos.length}
      />

      {/* Bulk Actions */}
      {selectedTodos.size > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedTodos.size} todo{selectedTodos.size !== 1 ? 's' : ''} selected
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={deleteTodoMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Todo List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {sortedTodos.length > 0 ? 'Your Todos' : 'No Todos Found'}
            </CardTitle>
            {sortedTodos.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedTodos.size === sortedTodos.length ? 'Deselect All' : 'Select All'}
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : sortedTodos.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {totalTodos === 0 ? (
                <div>
                  <Circle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No todos yet</p>
                  <p>Create your first todo to get started!</p>
                </div>
              ) : (
                <div>
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No todos match your filters</p>
                  <p>Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {sortedTodos.map((todo, index) => (
                <div key={todo.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedTodos.has(todo.id)}
                      onChange={(e) => handleSelectTodo(todo.id, e.target.checked)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <TodoItem
                        todo={todo}
                        onEdit={handleEditTodo}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleComplete(todo)}
                        disabled={updateTodoMutation.isPending}
                      >
                        {todo.status === 'completed' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTodo(todo.id)}
                        disabled={deleteTodoMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                  {index < sortedTodos.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}