# Todo App Frontend

A modern React TypeScript frontend for the Todo application, built with cutting-edge web technologies and best practices.

## 🚀 Features

- **Modern React 19** with TypeScript for type safety
- **Vite** for lightning-fast development and optimized builds
- **Shadcn/ui** component library with Tailwind CSS v4
- **TanStack Query** for efficient API state management
- **React Hook Form** with Zod validation
- **Responsive design** with mobile-first approach
- **Real-time search and filtering**
- **Optimistic UI updates**
- **Toast notifications**
- **Loading states and error handling**

## 🛠 Tech Stack

- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5.6** - Type-safe development
- **Vite 6.0** - Next-generation frontend tooling
- **Tailwind CSS v4** - Utility-first CSS framework
- **Shadcn/ui** - High-quality component library
- **TanStack Query v5** - Powerful data synchronization
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **Axios** - Promise-based HTTP client
- **Date-fns** - Modern JavaScript date utility library
- **Sonner** - Beautiful toast notifications

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Shadcn/ui base components
│   ├── TodoForm.tsx    # Todo creation/editing form
│   ├── TodoItem.tsx    # Individual todo item display
│   ├── TodoList.tsx    # Main todo list container
│   └── TodoFilters.tsx # Search and filtering controls
├── hooks/              # Custom React hooks
│   └── useTodos.ts     # Todo-related API hooks
├── lib/                # Utility libraries
│   ├── utils.ts        # General utilities
│   └── todo-utils.ts   # Todo-specific utilities
├── services/           # API services
│   └── api.ts          # Axios-based API client
├── types/              # TypeScript type definitions
│   └── todo.ts         # Todo-related types
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## 🎯 Key Components

### TodoList
Main container component that orchestrates the entire todo management experience:
- Displays todo statistics (active, completed, overdue)
- Manages form state for creating/editing todos
- Handles bulk operations and selection
- Integrates filtering and sorting functionality

### TodoForm
Modal dialog for creating and editing todos:
- React Hook Form with Zod validation
- Date picker for due dates
- Priority selection
- Status management for editing
- Optimistic updates with error handling

### TodoItem
Individual todo display component:
- Checkbox for completion toggle
- Priority badges with color coding
- Due date display with overdue indicators
- Edit and delete actions
- Responsive layout

### TodoFilters
Comprehensive filtering and search interface:
- Real-time search across todo titles and descriptions
- Status filtering (all, active, completed)
- Priority filtering (all, low, medium, high)
- Due date filtering (all, today, this week, overdue)
- Sorting options (date, priority, title)
- Filter summary and clear functionality

## 🔧 API Integration

The frontend integrates with a .NET Core Web API backend:

- **Base URL**: `http://localhost:5000/api`
- **Endpoints**:
  - `GET /todos` - Fetch all todos
  - `GET /todos/{id}` - Fetch single todo
  - `POST /todos` - Create new todo
  - `PUT /todos/{id}` - Update existing todo
  - `DELETE /todos/{id}` - Delete todo
  - `DELETE /todos/completed` - Bulk delete completed todos

### API Features
- Automatic retry logic for failed requests
- Request/response interceptors for error handling
- Optimistic updates with rollback on failure
- Caching and background refetching
- Loading states and error boundaries

## 🎨 Design System

Built with Shadcn/ui and Tailwind CSS v4:

### Color Scheme
- **Primary**: Blue-based palette for actions and highlights
- **Secondary**: Gray-based palette for secondary elements
- **Success**: Green for completed todos and success states
- **Warning**: Yellow for due soon indicators
- **Destructive**: Red for overdue items and delete actions

### Typography
- **Headings**: Inter font family with appropriate weights
- **Body**: System font stack for optimal readability
- **Code**: Monospace for technical elements

### Spacing & Layout
- **Container**: Max-width with responsive padding
- **Grid**: CSS Grid and Flexbox for layouts
- **Spacing**: Consistent 4px-based spacing scale

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- .NET Core backend running on port 5000

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

### Environment Setup

The application expects the backend API to be running on `http://localhost:5000`. If your backend runs on a different port, update the `baseURL` in `src/services/api.ts`.

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px - Single column layout
- **Tablet**: 768px - 1024px - Optimized for touch
- **Desktop**: > 1024px - Full feature layout

### Mobile Features
- Touch-friendly buttons and inputs
- Swipe gestures for actions
- Optimized form layouts
- Collapsible filters

## 🔍 Search & Filtering

Advanced filtering capabilities:

### Search
- Real-time search across todo titles and descriptions
- Debounced input for performance
- Highlight matching terms

### Filters
- **Status**: All, Active, Completed
- **Priority**: All, Low, Medium, High  
- **Due Date**: All, Due Today, Due This Week, Overdue
- **Sorting**: Created Date, Updated Date, Due Date, Priority, Title
- **Direction**: Ascending, Descending

### Filter Persistence
- Filters persist during the session
- Clear all filters functionality
- Filter count indicators

## 🎭 State Management

Using TanStack Query for server state:

### Query Keys
- `['todos']` - All todos list
- `['todos', id]` - Individual todo
- `['todos', params]` - Filtered todos

### Caching Strategy
- **Stale Time**: 30 seconds for todos list
- **Cache Time**: 5 minutes for unused data
- **Background Refetch**: On window focus
- **Retry Logic**: 3 attempts with exponential backoff

### Optimistic Updates
- Immediate UI updates for better UX
- Automatic rollback on API failures
- Loading states during mutations

## 🧪 Testing Strategy

### Unit Tests
- Component rendering tests
- Hook behavior tests
- Utility function tests
- API service tests

### Integration Tests
- User interaction flows
- Form submission tests
- API integration tests
- Error handling tests

### E2E Tests
- Complete user journeys
- Cross-browser compatibility
- Mobile responsiveness
- Performance benchmarks

## 🚀 Performance Optimizations

### Code Splitting
- Route-based code splitting
- Component lazy loading
- Dynamic imports for heavy libraries

### Bundle Optimization
- Tree shaking for unused code
- Asset optimization
- Compression and minification

### Runtime Performance
- React.memo for expensive components
- useMemo and useCallback for computations
- Virtual scrolling for large lists
- Debounced search inputs

## 🔒 Security Considerations

### Input Validation
- Client-side validation with Zod schemas
- XSS prevention through proper escaping
- CSRF protection via HTTP-only cookies

### API Security
- Request timeout configurations
- Error message sanitization
- Secure HTTP headers

## 🌐 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 📈 Future Enhancements

### Planned Features
- **Offline Support**: PWA with service workers
- **Real-time Updates**: WebSocket integration
- **Drag & Drop**: Reorder todos and priority changes
- **Categories/Tags**: Organize todos with labels
- **Collaboration**: Share todos with other users
- **Dark Mode**: Theme switching capability
- **Keyboard Shortcuts**: Power user features
- **Export/Import**: Data portability

### Technical Improvements
- **Virtualization**: Handle thousands of todos
- **Advanced Caching**: Persistent cache with IndexedDB
- **Micro-frontends**: Modular architecture
- **GraphQL**: More efficient data fetching
- **Web Workers**: Background processing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Use conventional commit messages
- Write tests for new features
- Update documentation
- Follow ESLint and Prettier rules

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Shadcn/ui** for the beautiful component library
- **TanStack Query** for excellent state management
- **Tailwind CSS** for the utility-first approach
- **React Team** for the amazing framework
- **Vite Team** for the blazing-fast tooling

---

Built with ❤️ using modern web technologies
