import { TodoData } from '../page-objects/TodoPage';

export const testTodos: Record<string, TodoData> = {
  simple: {
    title: 'Simple Todo',
    description: 'A basic todo item for testing',
    priority: 'medium'
  },
  
  highPriority: {
    title: 'High Priority Task',
    description: 'This is an urgent task that needs immediate attention',
    priority: 'high',
    dueDate: '2025-01-15'
  },
  
  lowPriority: {
    title: 'Low Priority Task',
    description: 'This can wait until later',
    priority: 'low',
    dueDate: '2025-02-01'
  },
  
  withoutDescription: {
    title: 'Todo Without Description',
    priority: 'medium'
  },
  
  longTitle: {
    title: 'This is a very long todo title that should test the character limit and how the UI handles longer text content',
    description: 'Testing with a long title',
    priority: 'low'
  },
  
  longDescription: {
    title: 'Todo with Long Description',
    description: 'This is a very long description that should test how the application handles longer text content in the description field. It should wrap properly and not break the layout. This description is intentionally verbose to test the limits of the text area and ensure proper handling of longer content.',
    priority: 'medium'
  },
  
  dueTomorrow: {
    title: 'Due Tomorrow',
    description: 'Task due tomorrow',
    priority: 'high',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  
  overdue: {
    title: 'Overdue Task',
    description: 'This task is overdue',
    priority: 'high',
    dueDate: '2024-12-01'
  },
  
  shopping: {
    title: 'Buy groceries',
    description: 'Milk, bread, eggs, and vegetables',
    priority: 'medium',
    dueDate: '2025-01-10'
  },
  
  work: {
    title: 'Complete project report',
    description: 'Finish the quarterly project report and submit to manager',
    priority: 'high',
    dueDate: '2025-01-12'
  },
  
  personal: {
    title: 'Call dentist',
    description: 'Schedule annual checkup appointment',
    priority: 'low',
    dueDate: '2025-01-20'
  }
};

export const invalidTodos = {
  emptyTitle: {
    title: '',
    description: 'Todo with empty title',
    priority: 'medium' as const
  },
  
  tooLongTitle: {
    title: 'A'.repeat(201), // Exceeds 200 character limit
    description: 'Title too long',
    priority: 'medium' as const
  },
  
  tooLongDescription: {
    title: 'Valid Title',
    description: 'A'.repeat(1001), // Exceeds 1000 character limit
    priority: 'medium' as const
  },
  
  pastDueDate: {
    title: 'Invalid Due Date',
    description: 'Due date in the past',
    priority: 'medium' as const,
    dueDate: '2020-01-01'
  }
};

export const bulkTestTodos: TodoData[] = [
  {
    title: 'Bulk Todo 1',
    description: 'First bulk todo',
    priority: 'high'
  },
  {
    title: 'Bulk Todo 2',
    description: 'Second bulk todo',
    priority: 'medium'
  },
  {
    title: 'Bulk Todo 3',
    description: 'Third bulk todo',
    priority: 'low'
  },
  {
    title: 'Bulk Todo 4',
    description: 'Fourth bulk todo',
    priority: 'high'
  },
  {
    title: 'Bulk Todo 5',
    description: 'Fifth bulk todo',
    priority: 'medium'
  }
];

export const searchTestData = {
  searchTerm: 'project',
  expectedResults: ['Complete project report'],
  noResultsTerm: 'nonexistent',
  partialMatch: 'call',
  expectedPartialResults: ['Call dentist']
};

export const filterTestData = {
  highPriorityTodos: ['High Priority Task', 'Due Tomorrow', 'Overdue Task', 'Complete project report'],
  mediumPriorityTodos: ['Simple Todo', 'Todo with Long Description', 'Buy groceries'],
  lowPriorityTodos: ['Low Priority Task', 'Call dentist'],
  completedTodos: [] as string[], // Will be populated during tests
  activeTodos: [] as string[] // Will be populated during tests
};