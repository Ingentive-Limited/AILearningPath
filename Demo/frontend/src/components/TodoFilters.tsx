import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface TodoFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  priority: string;
  onPriorityChange: (priority: string) => void;
  dueDate: string;
  onDueDateChange: (dueDate: string) => void;
  sortBy: string;
  onSortByChange: (sortBy: string) => void;
  sortDirection: string;
  onSortDirectionChange: (direction: string) => void;
  onClearFilters: () => void;
  totalCount?: number;
  filteredCount?: number;
}

export function TodoFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  dueDate,
  onDueDateChange,
  sortBy,
  onSortByChange,
  sortDirection,
  onSortDirectionChange,
  onClearFilters,
  totalCount = 0,
  filteredCount = 0,
}: TodoFiltersProps) {
  const hasActiveFilters = 
    search || 
    status !== 'all' || 
    priority !== 'all' || 
    dueDate !== 'all';

  const getActiveFiltersCount = () => {
    let count = 0;
    if (search) count++;
    if (status !== 'all') count++;
    if (priority !== 'all') count++;
    if (dueDate !== 'all') count++;
    return count;
  };

  return (
    <div className="glass-card p-6 space-y-6 border border-border/50 bg-gradient-to-br from-background/95 via-background to-muted/10">
      {/* Enhanced search section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Search className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Search & Filter</h3>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <Input
            placeholder="Search todos by title or description..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 pr-12 h-11 text-base border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            data-testid="search-input"
          />
          {search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-muted/50 transition-colors duration-200"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      <Separator className="bg-border/30" />

      {/* Enhanced filters section */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          Filter Options
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Enhanced Status Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Status</label>
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger className="h-10 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20" data-testid="status-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border/50">
                <SelectItem value="all">All Statuses</SelectItem>
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

          {/* Enhanced Priority Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Priority</label>
            <Select value={priority} onValueChange={onPriorityChange}>
              <SelectTrigger className="h-10 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20" data-testid="priority-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border/50">
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high" className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-priority-high" />
                  High Priority
                </SelectItem>
                <SelectItem value="medium" className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-priority-medium" />
                  Medium Priority
                </SelectItem>
                <SelectItem value="low" className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-priority-low" />
                  Low Priority
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Enhanced Due Date Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Due Date</label>
            <Select value={dueDate} onValueChange={onDueDateChange}>
              <SelectTrigger className="h-10 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20" data-testid="date-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border/50">
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Due Today</SelectItem>
                <SelectItem value="thisWeek">Due This Week</SelectItem>
                <SelectItem value="overdue" className="text-danger">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator className="bg-border/30" />

      {/* Enhanced sorting section */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-foreground">Sort Options</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Sort By</label>
            <Select value={sortBy} onValueChange={onSortByChange}>
              <SelectTrigger className="h-10 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20" data-testid="sort-dropdown">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border/50">
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="updatedAt">Updated Date</SelectItem>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Direction</label>
            <Select value={sortDirection} onValueChange={onSortDirectionChange}>
              <SelectTrigger className="h-10 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border/50">
                <SelectItem value="asc">Ascending ↑</SelectItem>
                <SelectItem value="desc">Descending ↓</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Enhanced filter summary and clear */}
      <div className="flex items-center justify-between pt-4 border-t border-border/30">
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredCount}</span> of{' '}
            <span className="font-semibold text-foreground">{totalCount}</span> todos
          </div>
          {hasActiveFilters && (
            <Badge
              variant="secondary"
              className="text-xs font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors duration-200"
            >
              <Filter className="h-3 w-3 mr-1" />
              {getActiveFiltersCount()} active filter{getActiveFiltersCount() !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="h-8 px-3 text-xs font-medium border-border/50 hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive transition-all duration-200"
            data-testid="clear-filters-button"
          >
            <X className="h-3 w-3 mr-1.5" />
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
}