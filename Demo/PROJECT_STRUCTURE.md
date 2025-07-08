# Project Structure Overview

This document provides a comprehensive overview of the Full-Stack Todo Application's architecture and file organization.

## 📁 High-Level Structure

```
Demo/
├── 📄 README.md                    # Main project documentation
├── 📄 GETTING_STARTED.md          # Setup and installation guide
├── 📄 PROJECT_STRUCTURE.md        # This file - architecture overview
├── 📄 PRD.md                      # Product Requirements Document
├── 🏗️ backend/                    # .NET 9 Web API
├── 🎨 frontend/                   # React 19 + TypeScript
└── 🧪 e2e/                        # End-to-end testing suite
```

## 🏗️ Backend Architecture (.NET 9 Clean Architecture)

### Directory Structure
```
backend/
├── 📄 README.md                   # Backend documentation
├── 📄 TodoApp.sln                 # Visual Studio solution file
├── 🏛️ TodoApp.Domain/             # Domain layer (entities, enums)
├── 🔧 TodoApp.Application/        # Application layer (business logic)
├── 🗄️ TodoApp.Infrastructure/     # Infrastructure layer (data access)
└── 🌐 TodoApp.WebAPI/             # Presentation layer (controllers, API)
```

### Clean Architecture Layers

#### 1. Domain Layer (`TodoApp.Domain/`)
**Purpose**: Core business entities and domain logic
```
TodoApp.Domain/
├── 📁 Entities/
│   └── 📄 Todo.cs                 # Main todo entity
└── 📁 Enums/
    ├── 📄 Priority.cs             # Priority levels (Low, Medium, High)
    └── 📄 TodoStatus.cs           # Status types (Active, Completed)
```

**Key Responsibilities**:
- Define core business entities
- Establish domain rules and constraints
- No dependencies on other layers

#### 2. Application Layer (`TodoApp.Application/`)
**Purpose**: Business logic and use cases
```
TodoApp.Application/
├── 📁 DTOs/
│   └── 📄 TodoDto.cs              # Data transfer objects
├── 📁 Interfaces/
│   ├── 📄 ITodoRepository.cs      # Repository contract
│   └── 📄 ITodoService.cs         # Service contract
├── 📁 Services/
│   └── 📄 TodoService.cs          # Business logic implementation
└── 📁 Validators/
    ├── 📄 CreateTodoRequestValidator.cs  # Create validation rules
    └── 📄 UpdateTodoRequestValidator.cs  # Update validation rules
```

**Key Responsibilities**:
- Implement business use cases
- Define service interfaces
- Handle validation logic
- Coordinate between domain and infrastructure

#### 3. Infrastructure Layer (`TodoApp.Infrastructure/`)
**Purpose**: Data access and external concerns
```
TodoApp.Infrastructure/
├── 📁 Data/
│   ├── 📄 TodoDbContext.cs        # Entity Framework context
│   └── 📁 Configurations/
│       └── 📄 TodoConfiguration.cs # Entity configuration
├── 📁 Repositories/
│   └── 📄 TodoRepository.cs       # Data access implementation
└── 📁 Migrations/                 # EF Core database migrations
    └── (auto-generated files)
```

**Key Responsibilities**:
- Database access via Entity Framework Core
- Repository pattern implementation
- External service integrations
- Data persistence logic

#### 4. WebAPI Layer (`TodoApp.WebAPI/`)
**Purpose**: HTTP API and application entry point
```
TodoApp.WebAPI/
├── 📁 Controllers/
│   └── 📄 TodosController.cs      # REST API endpoints
├── 📁 Properties/
│   └── 📄 launchSettings.json     # Development settings
├── 📄 Program.cs                  # Application startup and DI
├── 📄 appsettings.json           # Configuration settings
├── 📄 appsettings.Development.json # Development overrides
└── 📄 TodoApp.WebAPI.csproj      # Project file
```

**Key Responsibilities**:
- HTTP request/response handling
- Dependency injection configuration
- Middleware pipeline setup
- API documentation (Swagger)

### Technology Stack
- **.NET 9**: Latest framework version
- **Entity Framework Core 9**: ORM for data access
- **SQLite**: Lightweight database
- **FluentValidation**: Input validation
- **Swagger/OpenAPI**: API documentation

## 🎨 Frontend Architecture (React 19 + TypeScript)

### Directory Structure
```
frontend/
├── 📄 README.md                   # Frontend documentation
├── 📄 package.json               # Dependencies and scripts
├── 📄 vite.config.ts             # Vite build configuration
├── 📄 tsconfig.json              # TypeScript configuration
├── 📄 tsconfig.app.json          # App-specific TypeScript config
├── 📄 tailwind.config.js         # Tailwind CSS configuration
├── 📄 postcss.config.js          # PostCSS configuration
├── 📄 eslint.config.js           # ESLint configuration
├── 📁 public/                    # Static assets
├── 📁 src/                       # Source code
└── 📁 dist/                      # Production build output
```

### Source Code Structure (`src/`)
```
src/
├── 📄 main.tsx                   # Application entry point
├── 📄 App.tsx                    # Root component
├── 📄 index.css                  # Global styles and Tailwind imports
├── 📁 components/                # React components
│   ├── 📁 ui/                    # Shadcn/ui base components
│   ├── 📄 TodoForm.tsx           # Todo creation/editing form
│   ├── 📄 TodoItem.tsx           # Individual todo display
│   ├── 📄 TodoList.tsx           # Main todo list container
│   └── 📄 TodoFilters.tsx        # Search and filtering controls
├── 📁 hooks/                     # Custom React hooks
│   └── 📄 useTodos.ts            # Todo-related API hooks
├── 📁 lib/                       # Utility libraries
│   ├── 📄 utils.ts               # General utilities (cn, etc.)
│   └── 📄 todo-utils.ts          # Todo-specific utilities
├── 📁 services/                  # API services
│   └── 📄 api.ts                 # Axios-based API client
└── 📁 types/                     # TypeScript type definitions
    └── 📄 todo.ts                # Todo-related types
```

### Component Architecture

#### Core Components
- **`App.tsx`**: Root application component with providers
- **`TodoList.tsx`**: Main container managing todo state and operations
- **`TodoItem.tsx`**: Individual todo display with actions
- **`TodoForm.tsx`**: Modal form for creating/editing todos
- **`TodoFilters.tsx`**: Search, filter, and sort controls

#### UI Components (`components/ui/`)
Shadcn/ui components for consistent design:
- Button, Card, Dialog, Input, Select, Badge, etc.

#### Custom Hooks (`hooks/`)
- **`useTodos.ts`**: TanStack Query hooks for API operations
  - `useGetTodos()`: Fetch todos with filtering
  - `useCreateTodo()`: Create new todo
  - `useUpdateTodo()`: Update existing todo
  - `useDeleteTodo()`: Delete todo
  - `useBulkDeleteTodos()`: Bulk delete operations

### Technology Stack
- **React 19**: Latest React with concurrent features
- **TypeScript 5.8**: Type-safe development
- **Vite 7**: Build tool and dev server
- **Tailwind CSS 4**: Utility-first styling
- **Shadcn/ui**: High-quality component library
- **TanStack Query 5**: Server state management
- **React Hook Form**: Form handling
- **Zod**: Schema validation
- **Axios**: HTTP client

## 🧪 Testing Architecture (Playwright + API Tests)

### Directory Structure
```
e2e/
├── 📄 README.md                  # Testing documentation
├── 📄 package.json              # Test dependencies and scripts
├── 📄 playwright.config.ts      # Playwright configuration
├── 📄 tsconfig.json             # TypeScript configuration for tests
├── 📁 tests/                    # Frontend E2E tests
│   ├── 📄 todo-crud.spec.ts     # CRUD operations tests
│   ├── 📄 todo-search-filter.spec.ts # Search and filter tests
│   ├── 📄 todo-sort-responsive.spec.ts # Sorting and responsive tests
│   └── 📄 integration.spec.ts   # Integration test scenarios
├── 📁 api-tests/                # Backend API tests
│   ├── 📄 todos-api.http        # Main API test suite
│   ├── 📄 performance-tests.http # Performance and load tests
│   └── 📄 error-handling.http   # Error scenarios and edge cases
├── 📁 page-objects/             # Page Object Model classes
│   ├── 📄 BasePage.ts           # Base page object
│   └── 📄 TodoPage.ts           # Todo page object
├── 📁 fixtures/                 # Test data and fixtures
│   └── 📄 todoFixtures.ts       # Todo test data
├── 📁 utils/                    # Test utilities and helpers
│   └── 📄 testHelpers.ts        # Test helper functions
├── 📁 test-results/             # Test execution results
└── 📁 playwright-report/        # HTML test reports
```

### Test Coverage
- **CRUD Operations**: Create, read, update, delete todos
- **Search & Filter**: Real-time search and filtering functionality
- **Responsive Design**: Mobile, tablet, desktop layouts
- **API Endpoints**: All REST endpoints with edge cases
- **Performance**: Load testing and response time benchmarks
- **Error Handling**: Network errors and validation scenarios

### Technology Stack
- **Playwright 1.48**: End-to-end testing framework
- **TypeScript 5.6**: Type-safe test development
- **REST Client**: VS Code extension for API testing

## 🔧 Configuration Files

### Backend Configuration
- **`appsettings.json`**: Production configuration
- **`appsettings.Development.json`**: Development overrides
- **`launchSettings.json`**: Development server settings
- **`*.csproj`**: Project files with dependencies

### Frontend Configuration
- **`vite.config.ts`**: Build tool configuration
- **`tsconfig.json`**: TypeScript compiler options
- **`tailwind.config.js`**: CSS framework configuration
- **`eslint.config.js`**: Code linting rules
- **`package.json`**: Dependencies and scripts

### Testing Configuration
- **`playwright.config.ts`**: E2E test configuration
- **`tsconfig.json`**: TypeScript for tests

## 🗄️ Database Schema

### SQLite Database Structure
```sql
-- Todos table
CREATE TABLE Todos (
    Id TEXT PRIMARY KEY,              -- GUID identifier
    Title TEXT NOT NULL,              -- Todo title (1-200 chars)
    Description TEXT,                 -- Optional description (max 1000 chars)
    Status TEXT NOT NULL,             -- 'Active' or 'Completed'
    Priority TEXT NOT NULL,           -- 'Low', 'Medium', or 'High'
    DueDate DATETIME,                 -- Optional due date
    CreatedAt DATETIME NOT NULL,      -- Creation timestamp
    UpdatedAt DATETIME NOT NULL       -- Last update timestamp
);

-- Indexes for performance
CREATE INDEX idx_todos_status ON Todos(Status);
CREATE INDEX idx_todos_priority ON Todos(Priority);
CREATE INDEX idx_todos_duedate ON Todos(DueDate);
```

## 🌐 API Architecture

### REST Endpoints
```
Base URL: http://localhost:5000/api

GET    /todos              # Get all todos (with filtering)
GET    /todos/{id}         # Get specific todo
POST   /todos              # Create new todo
PUT    /todos/{id}         # Update existing todo
DELETE /todos/{id}         # Delete specific todo
DELETE /todos/completed    # Bulk delete completed todos
```

### Request/Response Flow
```
Frontend → API Client → Controller → Service → Repository → Database
    ↓         ↓           ↓           ↓         ↓          ↓
Browser ← JSON Response ← DTO ← Business Logic ← Entity ← SQLite
```

## 🔄 Data Flow

### Create Todo Flow
1. **Frontend**: User fills form, validates with Zod
2. **API Client**: Sends POST request to `/api/todos`
3. **Controller**: Receives request, validates with FluentValidation
4. **Service**: Applies business logic, creates domain entity
5. **Repository**: Persists to database via Entity Framework
6. **Response**: Returns created todo with generated ID
7. **Frontend**: Updates UI optimistically, shows success

### Read Todos Flow
1. **Frontend**: Component mounts, triggers `useGetTodos()`
2. **TanStack Query**: Checks cache, makes API request if needed
3. **API**: Applies filtering, sorting, pagination
4. **Database**: Executes optimized query with indexes
5. **Response**: Returns paginated todo list
6. **Frontend**: Renders todos, caches for future use

## 🚀 Build and Deployment

### Development Build
```bash
# Backend
cd backend
dotnet build

# Frontend
cd frontend
npm run dev
```

### Production Build
```bash
# Backend
cd backend
dotnet publish --configuration Release --output ./publish

# Frontend
cd frontend
npm run build  # Creates dist/ folder
```

### Deployment Structure
```
Production/
├── backend/
│   └── publish/           # .NET published output
├── frontend/
│   └── dist/             # Vite build output
└── database/
    └── todos.db          # SQLite database file
```

## 📊 Performance Considerations

### Backend Optimizations
- **Database Indexes**: On frequently queried columns
- **Connection Pooling**: Efficient database connections
- **Async/Await**: Non-blocking operations
- **Caching**: Response caching for read operations

### Frontend Optimizations
- **Code Splitting**: Route-based lazy loading
- **Bundle Optimization**: Tree shaking and minification
- **State Management**: Efficient re-renders with TanStack Query
- **Image Optimization**: Compressed assets

### Testing Optimizations
- **Parallel Execution**: Multiple test workers
- **Smart Retries**: Automatic retry on flaky tests
- **Test Isolation**: Independent test scenarios

## 🔒 Security Architecture

### Backend Security
- **Input Validation**: FluentValidation for all inputs
- **SQL Injection Prevention**: Entity Framework parameterized queries
- **CORS Configuration**: Controlled cross-origin requests
- **Error Handling**: Sanitized error responses

### Frontend Security
- **XSS Prevention**: React's built-in escaping
- **Type Safety**: TypeScript prevents runtime errors
- **Input Sanitization**: Zod schema validation
- **Secure HTTP**: HTTPS in production

## 📈 Scalability Considerations

### Current Architecture Supports
- **Horizontal Scaling**: Stateless API design
- **Database Scaling**: SQLite suitable for moderate loads
- **Caching**: TanStack Query for client-side caching
- **CDN Ready**: Static frontend assets

### Future Scaling Options
- **Database Migration**: PostgreSQL/SQL Server for larger datasets
- **Microservices**: Split into focused services
- **Load Balancing**: Multiple API instances
- **Real-time Features**: SignalR for live updates

---

*This document provides a comprehensive overview of the project structure. For specific implementation details, refer to the component-specific README files in each directory.*

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: KiloCode Development Team