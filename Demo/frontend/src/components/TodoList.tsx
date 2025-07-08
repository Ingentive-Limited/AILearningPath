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
    <div className="space-y-8 fade-in">
      {/* Enhanced Header with Stats */}
      <Card className="gradient-border shadow-medium">
        <CardHeader className="pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-gradient">
                My Todos
              </CardTitle>
              <p className="text-muted-foreground">
                Stay organized and productive
              </p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              disabled={showForm}
              className="btn-hover shadow-soft bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-6 py-2.5"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Todo
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <Badge
              variant="secondary"
              className="status-active flex items-center gap-2 px-4 py-2 text-sm font-semibold"
            >
              <Circle className="h-4 w-4" />
              {activeTodos} Active
            </Badge>
            <Badge
              variant="secondary"
              className="status-completed flex items-center gap-2 px-4 py-2 text-sm font-semibold"
            >
              <CheckCircle2 className="h-4 w-4" />
              {completedTodos} Completed
            </Badge>
            {overdueTodos > 0 && (
              <Badge
                variant="destructive"
                className="status-overdue flex items-center gap-2 px-4 py-2 text-sm font-semibold animate-pulse"
              >
                <AlertCircle className="h-4 w-4" />
                {overdueTodos} Overdue
              </Badge>
            )}
            <Badge
              variant="outline"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border-dashed"
            >
              Total: {totalTodos}
            </Badge>
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

      {/* Enhanced Bulk Actions */}
      {selectedTodos.size > 0 && (
        <Card className="slide-in border-primary/20 bg-primary/5 shadow-medium">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {selectedTodos.size} todo{selectedTodos.size !== 1 ? 's' : ''} selected
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Choose an action to perform on selected items
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTodos(new Set())}
                  className="btn-hover"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={deleteTodoMutation.isPending}
                  className="btn-hover shadow-soft"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deleteTodoMutation.isPending ? 'Deleting...' : 'Delete Selected'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Todo List */}
      <Card className="shadow-medium">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold">
                {sortedTodos.length > 0 ? 'Your Todos' : 'No Todos Found'}
              </CardTitle>
              {sortedTodos.length > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  {sortedTodos.length} of {totalTodos} todos shown
                </p>
              )}
            </div>
            {sortedTodos.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="btn-hover"
              >
                {selectedTodos.size === sortedTodos.length ? 'Deselect All' : 'Select All'}
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3 loading-pulse">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-5 w-5 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedTodos.length === 0 ? (
            <div className="p-12 text-center">
              {totalTodos === 0 ? (
                <div className="fade-in">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/30 flex items-center justify-center">
                    <Circle className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">No todos yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Start organizing your tasks by creating your first todo.
                    Click the "Add Todo" button above to get started!
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="btn-hover shadow-soft"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Todo
                  </Button>
                </div>
              ) : (
                <div className="fade-in">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-warning/10 flex items-center justify-center">
                    <AlertCircle className="h-10 w-10 text-warning" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">No todos match your filters</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Try adjusting your search terms or filter criteria to find what you're looking for.
                  </p>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="btn-hover"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {sortedTodos.map((todo, index) => (
                <div
                  key={todo.id}
                  className="p-6 card-hover transition-all duration-200 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <input
                        type="checkbox"
                        checked={selectedTodos.has(todo.id)}
                        onChange={(e) => handleSelectTodo(todo.id, e.target.checked)}
                        className="w-4 h-4 text-primary bg-background border-2 border-border rounded focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <TodoItem
                        todo={todo}
                        onEdit={handleEditTodo}
                      />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleComplete(todo)}
                        disabled={updateTodoMutation.isPending}
                        className="btn-hover h-8 w-8 p-0"
                        title={todo.status === 'completed' ? 'Mark as active' : 'Mark as completed'}
                      >
                        {todo.status === 'completed' ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground hover:text-success" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTodo(todo.id)}
                        disabled={deleteTodoMutation.isPending}
                        className="btn-hover h-8 w-8 p-0 hover:bg-destructive/10"
                        title="Delete todo"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}