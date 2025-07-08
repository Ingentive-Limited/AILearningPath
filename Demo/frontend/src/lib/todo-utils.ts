import { format, isAfter, isBefore, isToday, isThisWeek, parseISO } from 'date-fns';
import type { Todo, Priority } from '@/types/todo';

// Format date for display
export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy');
  } catch {
    return 'Invalid date';
  }
};

// Format date with time for display
export const formatDateTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
  } catch {
    return 'Invalid date';
  }
};

// Check if a todo is overdue
export const isOverdue = (todo: Todo): boolean => {
  if (!todo.dueDate || todo.status === 'completed') {
    return false;
  }
  
  try {
    const dueDate = parseISO(todo.dueDate);
    return isBefore(dueDate, new Date());
  } catch {
    return false;
  }
};

// Check if a todo is due today
export const isDueToday = (todo: Todo): boolean => {
  if (!todo.dueDate) {
    return false;
  }
  
  try {
    const dueDate = parseISO(todo.dueDate);
    return isToday(dueDate);
  } catch {
    return false;
  }
};

// Check if a todo is due this week
export const isDueThisWeek = (todo: Todo): boolean => {
  if (!todo.dueDate) {
    return false;
  }
  
  try {
    const dueDate = parseISO(todo.dueDate);
    return isThisWeek(dueDate);
  } catch {
    return false;
  }
};

// Get priority color class
export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case 'high':
      return 'priority-high';
    case 'medium':
      return 'priority-medium';
    case 'low':
      return 'priority-low';
    default:
      return 'priority-medium';
  }
};

// Get priority badge variant
export const getPriorityVariant = (priority: Priority): 'destructive' | 'default' | 'secondary' => {
  switch (priority) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'default';
    case 'low':
      return 'secondary';
    default:
      return 'default';
  }
};

// Sort todos by various criteria
export const sortTodos = (todos: Todo[], sortBy: string, sortDirection: 'asc' | 'desc' = 'asc'): Todo[] => {
  const sorted = [...todos].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'updatedAt':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'desc' ? -comparison : comparison;
  });
  
  return sorted;
};

// Filter todos by various criteria
export const filterTodos = (todos: Todo[], filters: {
  status?: string;
  priority?: string;
  search?: string;
  dueDate?: string;
}): Todo[] => {
  return todos.filter(todo => {
    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (todo.status !== filters.status) return false;
    }
    
    // Priority filter
    if (filters.priority && filters.priority !== 'all') {
      if (todo.priority !== filters.priority) return false;
    }
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = todo.title.toLowerCase().includes(searchLower);
      const descriptionMatch = todo.description?.toLowerCase().includes(searchLower) || false;
      if (!titleMatch && !descriptionMatch) return false;
    }
    
    // Due date filter
    if (filters.dueDate && filters.dueDate !== 'all') {
      switch (filters.dueDate) {
        case 'today':
          if (!isDueToday(todo)) return false;
          break;
        case 'thisWeek':
          if (!isDueThisWeek(todo)) return false;
          break;
        case 'overdue':
          if (!isOverdue(todo)) return false;
          break;
      }
    }
    
    return true;
  });
};

// Get relative time string
export const getRelativeTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return formatDate(dateString);
    }
  } catch {
    return 'Unknown';
  }
};