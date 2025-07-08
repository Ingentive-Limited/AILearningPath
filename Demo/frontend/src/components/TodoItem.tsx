import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToggleTodo, useDeleteTodo } from '@/hooks/useTodos';
import { isOverdue, formatDate, getPriorityVariant } from '@/lib/todo-utils';
import { cn } from '@/lib/utils';
import type { Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

export function TodoItem({ todo, onEdit }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();

  const handleToggle = () => {
    toggleTodo.mutate(todo);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      setIsDeleting(true);
      try {
        await deleteTodo.mutateAsync(todo.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = () => {
    onEdit(todo);
  };

  const isCompleted = todo.status === 'completed';
  const isTaskOverdue = isOverdue(todo);

  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:shadow-md',
        isCompleted && 'opacity-60',
        isTaskOverdue && !isCompleted && 'border-red-200 bg-red-50',
        isDeleting && 'opacity-50 pointer-events-none'
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <div className="flex-shrink-0 mt-1">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={handleToggle}
              disabled={toggleTodo.isPending}
              className="h-5 w-5"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title and Priority */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3
                className={cn(
                  'font-medium text-sm leading-5',
                  isCompleted && 'line-through text-muted-foreground'
                )}
              >
                {todo.title}
              </h3>
              <Badge
                variant={getPriorityVariant(todo.priority)}
                className="flex-shrink-0 text-xs"
              >
                {todo.priority}
              </Badge>
            </div>

            {/* Description */}
            {todo.description && (
              <p
                className={cn(
                  'text-sm text-muted-foreground mb-3 line-clamp-2',
                  isCompleted && 'line-through'
                )}
              >
                {todo.description}
              </p>
            )}

            {/* Due Date and Timestamps */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-3">
              {todo.dueDate && (
                <div
                  className={cn(
                    'flex items-center gap-1',
                    isTaskOverdue && !isCompleted && 'text-red-600 font-medium'
                  )}
                >
                  <Calendar className="h-3 w-3" />
                  <span>Due {formatDate(todo.dueDate)}</span>
                  {isTaskOverdue && !isCompleted && (
                    <span className="text-red-600">(Overdue)</span>
                  )}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Created {formatDate(todo.createdAt)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                disabled={isDeleting}
                className="h-8 px-2 text-xs"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting || deleteTodo.isPending}
                className="h-8 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                {isDeleting || deleteTodo.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}