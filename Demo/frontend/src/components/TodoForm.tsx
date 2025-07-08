import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCreateTodo, useUpdateTodo } from '@/hooks/useTodos';
import type { Todo, Priority, TodoStatus } from '@/types/todo';

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['active', 'completed']).optional(),
  dueDate: z.string().optional(),
});

type TodoFormData = z.infer<typeof todoSchema>;

interface TodoFormProps {
  todo?: Todo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TodoForm({ todo, open, onOpenChange }: TodoFormProps) {
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();
  const isEditing = !!todo;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      status: 'active',
      dueDate: '',
    },
  });

  const watchedPriority = watch('priority');
  const watchedStatus = watch('status');

  // Reset form when dialog opens/closes or todo changes
  useEffect(() => {
    if (open) {
      if (todo) {
        reset({
          title: todo.title,
          description: todo.description || '',
          priority: todo.priority,
          status: todo.status,
          dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
        });
      } else {
        reset({
          title: '',
          description: '',
          priority: 'medium',
          status: 'active',
          dueDate: '',
        });
      }
    }
  }, [open, todo, reset]);

  const onSubmit = async (data: TodoFormData) => {
    try {
      const formattedData = {
        title: data.title,
        description: data.description || undefined,
        priority: data.priority,
        ...(isEditing && { status: data.status! }),
        dueDate: data.dueDate ? `${data.dueDate}T00:00:00Z` : undefined,
      };

      if (isEditing && todo) {
        await updateTodo.mutateAsync({
          id: todo.id,
          todo: formattedData as any,
        });
      } else {
        await createTodo.mutateAsync(formattedData as any);
      }

      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the hooks
      console.error('Form submission error:', error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-card border-border shadow-2xl">
        {/* Enhanced header with gradient */}
        <div className="relative px-6 py-6 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
          <DialogHeader className="relative">
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {isEditing ? 'Edit Todo' : 'Create New Todo'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground/80 mt-2">
              {isEditing
                ? 'Make changes to your todo item.'
                : 'Add a new todo item to your list.'}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Enhanced form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-6">
          {/* Title field with enhanced styling */}
          <div className="space-y-3">
            <Label htmlFor="title" className="text-sm font-semibold text-foreground flex items-center gap-2">
              Title
              <span className="text-destructive text-xs">*</span>
            </Label>
            <div className="relative">
              <Input
                id="title"
                placeholder="Enter a clear, descriptive title..."
                {...register('title')}
                className={cn(
                  'h-11 px-4 text-base transition-all duration-200 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20',
                  errors.title && 'border-destructive/50 focus:border-destructive focus:ring-destructive/20'
                )}
                data-testid="title-input"
              />
              {errors.title && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                </div>
              )}
            </div>
            {errors.title && (
              <p className="text-sm text-destructive flex items-center gap-2 animate-in slide-in-from-left-2" data-testid="title-error">
                <span className="h-1 w-1 rounded-full bg-destructive" />
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description field with enhanced styling */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-semibold text-foreground">
              Description
            </Label>
            <div className="relative">
              <Textarea
                id="description"
                placeholder="Add more details about this todo (optional)..."
                rows={4}
                {...register('description')}
                className={cn(
                  'px-4 py-3 text-base resize-none transition-all duration-200 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20',
                  errors.description && 'border-destructive/50 focus:border-destructive focus:ring-destructive/20'
                )}
                data-testid="description-input"
              />
              {errors.description && (
                <div className="absolute top-3 right-3">
                  <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                </div>
              )}
            </div>
            {errors.description && (
              <p className="text-sm text-destructive flex items-center gap-2 animate-in slide-in-from-left-2">
                <span className="h-1 w-1 rounded-full bg-destructive" />
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Enhanced priority and status grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="priority" className="text-sm font-semibold text-foreground">
                Priority Level
              </Label>
              <Select
                value={watchedPriority}
                onValueChange={(value: Priority) => setValue('priority', value)}
              >
                <SelectTrigger className="h-11 px-4 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20" data-testid="priority-select">
                  <SelectValue placeholder="Choose priority level" />
                </SelectTrigger>
                <SelectContent className="border-border/50">
                  <SelectItem value="low" className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-priority-low" />
                    Low Priority
                  </SelectItem>
                  <SelectItem value="medium" className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-priority-medium" />
                    Medium Priority
                  </SelectItem>
                  <SelectItem value="high" className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-priority-high" />
                    High Priority
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isEditing && (
              <div className="space-y-3">
                <Label htmlFor="status" className="text-sm font-semibold text-foreground">
                  Status
                </Label>
                <Select
                  value={watchedStatus}
                  onValueChange={(value: TodoStatus) => setValue('status', value)}
                >
                  <SelectTrigger className="h-11 px-4 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="border-border/50">
                    <SelectItem value="active" className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      Active
                    </SelectItem>
                    <SelectItem value="completed" className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-success" />
                      Completed
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Enhanced due date */}
          <div className="space-y-3">
            <Label htmlFor="dueDate" className="text-sm font-semibold text-foreground">
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              {...register('dueDate')}
              className={cn(
                'h-11 px-4 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20',
                errors.dueDate && 'border-destructive/50 focus:border-destructive focus:ring-destructive/20'
              )}
              data-testid="due-date-input"
            />
            {errors.dueDate && (
              <p className="text-sm text-destructive flex items-center gap-2 animate-in slide-in-from-left-2">
                <span className="h-1 w-1 rounded-full bg-destructive" />
                {errors.dueDate.message}
              </p>
            )}
          </div>

          {/* Enhanced footer with better button styling */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/30">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="h-10 px-6 font-medium border-border/50 hover:border-border hover:bg-muted/50 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'h-10 px-6 font-medium transition-all duration-200',
                'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary',
                'shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed',
                isSubmitting && 'animate-pulse'
              )}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                isEditing ? 'Update Todo' : 'Create Todo'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}