import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Edit, Trash2, CheckCircle2, Circle } from 'lucide-react';
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
    <div
      className={cn(
        'relative transition-all duration-300 ease-in-out',
        isCompleted && 'completed',
        isTaskOverdue && !isCompleted && 'overdue',
        isDeleting && 'opacity-50 pointer-events-none scale-95'
      )}
    >
      {/* Priority indicator bar */}
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-1 rounded-l-lg transition-all duration-200',
          todo.priority === 'high' && 'bg-gradient-to-b from-priority-high to-priority-high/70',
          todo.priority === 'medium' && 'bg-gradient-to-b from-priority-medium to-priority-medium/70',
          todo.priority === 'low' && 'bg-gradient-to-b from-priority-low to-priority-low/70'
        )}
      />

      <div className="pl-4">
        {/* Title and Priority */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3
            className={cn(
              'font-semibold text-lg leading-6 text-foreground transition-all duration-200',
              isCompleted && 'text-muted-foreground'
            )}
          >
            {todo.title}
          </h3>
          <Badge
            className={cn(
              'flex-shrink-0 text-xs font-bold px-3 py-1 transition-all duration-200',
              `priority-${todo.priority}`
            )}
          >
            {todo.priority.toUpperCase()}
          </Badge>
        </div>

        {/* Description */}
        {todo.description && (
          <p
            className={cn(
              'text-muted-foreground mb-4 leading-relaxed transition-all duration-200',
              isCompleted && 'line-through opacity-70'
            )}
          >
            {todo.description}
          </p>
        )}

        {/* Enhanced metadata section */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {todo.dueDate && (
            <div
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                isTaskOverdue && !isCompleted
                  ? 'bg-danger/10 text-danger border border-danger/20'
                  : 'bg-muted/50 text-muted-foreground border border-border/50'
              )}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Due {formatDate(todo.dueDate)}</span>
              {isTaskOverdue && !isCompleted && (
                <span className="text-danger font-bold">(Overdue)</span>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/30 text-xs text-muted-foreground border border-border/30">
            <Clock className="h-3.5 w-3.5" />
            <span>Created {formatDate(todo.createdAt)}</span>
          </div>

          {/* Status indicator */}
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border',
              isCompleted
                ? 'bg-success/10 text-success border-success/20'
                : 'bg-primary/10 text-primary border-primary/20'
            )}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <Circle className="h-3.5 w-3.5" />
            )}
            <span>{isCompleted ? 'Completed' : 'Active'}</span>
          </div>
        </div>

        {/* Enhanced actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            disabled={isDeleting}
            className="btn-hover h-9 px-4 text-xs font-medium border-border/50 hover:border-primary/50 hover:bg-primary/5"
          >
            <Edit className="h-3.5 w-3.5 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggle}
            disabled={toggleTodo.isPending || isDeleting}
            className={cn(
              'btn-hover h-9 px-4 text-xs font-medium transition-all duration-200',
              isCompleted
                ? 'border-warning/50 hover:border-warning hover:bg-warning/5 text-warning'
                : 'border-success/50 hover:border-success hover:bg-success/5 text-success'
            )}
          >
            {isCompleted ? (
              <>
                <Circle className="h-3.5 w-3.5 mr-2" />
                Reactivate
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                Complete
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting || deleteTodo.isPending}
            className="btn-hover h-9 px-4 text-xs font-medium border-destructive/30 hover:border-destructive hover:bg-destructive/5 text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5 mr-2" />
            {isDeleting || deleteTodo.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
}