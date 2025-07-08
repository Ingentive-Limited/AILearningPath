# Product Requirements Document (PRD)
## Full-Stack Todo Application

**Version:** 1.0  
**Date:** January 2025  
**Status:** Ready for Development  

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [User Stories & Acceptance Criteria](#user-stories--acceptance-criteria)
4. [Technical Architecture](#technical-architecture)
5. [API Specifications](#api-specifications)
6. [Frontend Components](#frontend-components)
7. [Database Schema](#database-schema)
8. [Testing Strategy](#testing-strategy)
9. [Development Phases](#development-phases)
10. [Success Metrics](#success-metrics)
11. [Risks & Mitigations](#risks--mitigations)

---

## Executive Summary

This PRD outlines the requirements for a modern, full-stack todo application built with React TypeScript frontend and .NET backend. The application will demonstrate best practices in software architecture, testing, and user experience design while providing essential task management functionality.

### Key Objectives
- Create a production-ready todo application following industry best practices
- Implement clean architecture principles for maintainability and scalability
- Provide comprehensive testing coverage with E2E and API tests
- Deliver an intuitive, responsive user interface using modern UI components

---

## Project Overview

### Problem Statement
Users need a reliable, fast, and intuitive application to manage their daily tasks and todos. Existing solutions often lack proper architecture, testing, or modern user experience.

### Solution
A full-stack todo application that combines modern frontend technologies with robust backend architecture, providing users with a seamless task management experience.

### Target Users
- **Primary:** Individual users managing personal tasks
- **Secondary:** Small teams needing simple task tracking
- **Tertiary:** Developers learning modern full-stack development

### Project Structure
```
Demo/
├── frontend/          # React TypeScript application
├── backend/           # .NET API with clean architecture
├── e2e/              # End-to-end tests
├── docs/             # Additional documentation
└── PRD.md            # This document
```

---

## User Stories & Acceptance Criteria

### Epic 1: Task Management

#### US-1.1: Create Todo
**As a** user  
**I want to** create new todo items  
**So that** I can track tasks I need to complete  

**Acceptance Criteria:**
- [ ] User can enter a todo title (required, 1-200 characters)
- [ ] User can optionally add a description (0-1000 characters)
- [ ] User can set a due date (optional, must be future date)
- [ ] User can set priority (Low, Medium, High, default: Medium)
- [ ] System assigns unique ID and creation timestamp
- [ ] New todo appears immediately in the list
- [ ] Form validates input before submission
- [ ] User receives confirmation of successful creation

#### US-1.2: View Todo List
**As a** user  
**I want to** see all my todo items  
**So that** I can understand what tasks need attention  

**Acceptance Criteria:**
- [ ] Todos display in a responsive list/grid layout
- [ ] Each todo shows: title, status, priority, due date (if set)
- [ ] Overdue items are visually highlighted
- [ ] List updates in real-time when todos change
- [ ] Empty state shows helpful message when no todos exist
- [ ] List loads within 2 seconds

#### US-1.3: Update Todo
**As a** user  
**I want to** edit existing todo items  
**So that** I can keep information current  

**Acceptance Criteria:**
- [ ] User can edit all todo fields (title, description, due date, priority)
- [ ] User can mark todo as complete/incomplete
- [ ] Changes save automatically or with explicit save action
- [ ] Validation prevents invalid data
- [ ] User sees confirmation of successful update
- [ ] Optimistic UI updates for better UX

#### US-1.4: Delete Todo
**As a** user  
**I want to** remove todo items  
**So that** I can keep my list relevant  

**Acceptance Criteria:**
- [ ] User can delete individual todos
- [ ] Confirmation dialog prevents accidental deletion
- [ ] Deleted items are immediately removed from view
- [ ] Option to bulk delete completed todos
- [ ] Successful deletion shows confirmation message

### Epic 2: Organization & Filtering

#### US-2.1: Filter Todos
**As a** user  
**I want to** filter my todo list  
**So that** I can focus on specific tasks  

**Acceptance Criteria:**
- [ ] Filter by status (All, Active, Completed)
- [ ] Filter by priority (All, High, Medium, Low)
- [ ] Filter by due date (All, Today, This Week, Overdue)
- [ ] Multiple filters can be applied simultaneously
- [ ] Filter state persists during session
- [ ] Clear filters option available

#### US-2.2: Sort Todos
**As a** user  
**I want to** sort my todo list  
**So that** I can prioritize my work  

**Acceptance Criteria:**
- [ ] Sort by due date (ascending/descending)
- [ ] Sort by priority (High to Low, Low to High)
- [ ] Sort by creation date (newest/oldest first)
- [ ] Sort by title (A-Z, Z-A)
- [ ] Sort preference persists during session

#### US-2.3: Search Todos
**As a** user  
**I want to** search through my todos  
**So that** I can quickly find specific tasks  

**Acceptance Criteria:**
- [ ] Search bar prominently displayed
- [ ] Real-time search as user types (with debounce)
- [ ] Search matches title and description
- [ ] Case-insensitive search
- [ ] Clear search functionality
- [ ] Search results highlight matching text

---

## Technical Architecture

### System Architecture
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React Frontend│────▶│   .NET API      │────▶│  SQLite DB      │
│   (TypeScript)  │◀────│   (REST)        │◀────│                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                        │                         │
        ▼                        ▼                         ▼
  Shadcn/ui Components    Clean Architecture        Entity Framework
```

### Technology Stack

#### Frontend
- **Framework:** React 18+
- **Language:** TypeScript 5+
- **UI Library:** Shadcn/ui (with Tailwind CSS)
- **State Management:** React Context API / Zustand
- **HTTP Client:** Axios / Fetch API
- **Build Tool:** Vite
- **Package Manager:** npm/pnpm

#### Backend
- **Framework:** .NET 8
- **Language:** C#
- **Architecture:** Clean Architecture (Domain, Application, Infrastructure, API layers)
- **ORM:** Entity Framework Core
- **Database:** SQLite
- **API Documentation:** Swagger/OpenAPI
- **Validation:** FluentValidation

#### Testing
- **Frontend E2E:** Playwright
- **API Testing:** .http files (REST Client)
- **Unit Testing:** Jest (Frontend), xUnit (.NET)

### Clean Architecture Layers

1. **Domain Layer**
   - Entities: Todo, Priority enum
   - Value Objects: TodoId, DueDate
   - Domain Events: TodoCreated, TodoCompleted

2. **Application Layer**
   - Use Cases: CreateTodo, UpdateTodo, DeleteTodo, GetTodos
   - DTOs: TodoDto, CreateTodoRequest, UpdateTodoRequest
   - Interfaces: ITodoRepository

3. **Infrastructure Layer**
   - Data: EF Core DbContext, Repositories
   - Configurations: Entity configurations
   - Migrations: Database schema updates

4. **API Layer**
   - Controllers: TodosController
   - Middleware: Error handling, CORS
   - Dependency Injection: Service registration

---

## API Specifications

### Base URL
`http://localhost:5000/api`

### Endpoints

#### 1. Get All Todos
```
GET /todos
Query Parameters:
  - status: all|active|completed (optional)
  - priority: all|high|medium|low (optional)
  - search: string (optional)
  - sortBy: dueDate|priority|createdAt|title (optional)
  - sortDirection: asc|desc (optional)

Response: 200 OK
{
  "data": [
    {
      "id": "guid",
      "title": "string",
      "description": "string",
      "status": "active|completed",
      "priority": "low|medium|high",
      "dueDate": "2025-01-15T00:00:00Z",
      "createdAt": "2025-01-07T00:00:00Z",
      "updatedAt": "2025-01-07T00:00:00Z"
    }
  ],
  "totalCount": 42
}
```

#### 2. Get Single Todo
```
GET /todos/{id}

Response: 200 OK
{
  "id": "guid",
  "title": "string",
  "description": "string",
  "status": "active|completed",
  "priority": "low|medium|high",
  "dueDate": "2025-01-15T00:00:00Z",
  "createdAt": "2025-01-07T00:00:00Z",
  "updatedAt": "2025-01-07T00:00:00Z"
}

Response: 404 Not Found
```

#### 3. Create Todo
```
POST /todos
Content-Type: application/json

Request Body:
{
  "title": "string (required, 1-200 chars)",
  "description": "string (optional, max 1000 chars)",
  "priority": "low|medium|high (default: medium)",
  "dueDate": "2025-01-15T00:00:00Z (optional)"
}

Response: 201 Created
Location: /api/todos/{id}
{
  "id": "guid",
  "title": "string",
  "description": "string",
  "status": "active",
  "priority": "medium",
  "dueDate": "2025-01-15T00:00:00Z",
  "createdAt": "2025-01-07T00:00:00Z",
  "updatedAt": "2025-01-07T00:00:00Z"
}

Response: 400 Bad Request
{
  "errors": {
    "title": ["Title is required"],
    "dueDate": ["Due date must be in the future"]
  }
}
```

#### 4. Update Todo
```
PUT /todos/{id}
Content-Type: application/json

Request Body:
{
  "title": "string",
  "description": "string",
  "status": "active|completed",
  "priority": "low|medium|high",
  "dueDate": "2025-01-15T00:00:00Z"
}

Response: 200 OK
{
  "id": "guid",
  "title": "string",
  "description": "string",
  "status": "completed",
  "priority": "high",
  "dueDate": "2025-01-15T00:00:00Z",
  "createdAt": "2025-01-07T00:00:00Z",
  "updatedAt": "2025-01-07T10:00:00Z"
}

Response: 404 Not Found
Response: 400 Bad Request
```

#### 5. Delete Todo
```
DELETE /todos/{id}

Response: 204 No Content
Response: 404 Not Found
```

#### 6. Bulk Delete Completed
```
DELETE /todos/completed

Response: 200 OK
{
  "deletedCount": 5
}
```

### Error Response Format
```json
{
  "type": "https://tools.ietf.org/html/rfc7807",
  "title": "Validation Error",
  "status": 400,
  "detail": "One or more validation errors occurred",
  "instance": "/api/todos",
  "errors": {
    "field": ["error message"]
  }
}
```

---

## Frontend Components

### Component Hierarchy
```
App
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   └── ThemeToggle
│   └── Main
├── TodoPage
│   ├── TodoFilters
│   │   ├── StatusFilter
│   │   ├── PriorityFilter
│   │   └── DateFilter
│   ├── TodoSearch
│   ├── TodoSort
│   ├── TodoList
│   │   ├── TodoItem
│   │   │   ├── TodoCheckbox
│   │   │   ├── TodoTitle
│   │   │   ├── TodoPriority
│   │   │   ├── TodoDueDate
│   │   │   └── TodoActions
│   │   └── EmptyState
│   └── TodoForm (Modal)
│       ├── FormInput
│       ├── FormTextarea
│       ├── FormSelect
│       └── FormDatePicker
└── Common
    ├── Button
    ├── Card
    ├── Dialog
    ├── Badge
    └── Toast
```

### Key Component Specifications

#### TodoItem Component
- Displays todo information in card format
- Checkbox for completion status
- Priority badge with color coding (High: red, Medium: yellow, Low: green)
- Due date with overdue highlighting
- Edit and delete action buttons
- Hover state for better interactivity

#### TodoForm Component
- Modal dialog for create/edit operations
- Form validation with error messages
- Auto-focus on title field
- Date picker with calendar UI
- Priority dropdown with visual indicators
- Cancel and Save buttons

#### TodoFilters Component
- Collapsible filter panel
- Multi-select capabilities
- Active filter indicators
- Clear all filters button
- Responsive layout for mobile

### Design System

#### Colors
```css
--primary: hsl(220, 90%, 56%);
--secondary: hsl(220, 10%, 40%);
--success: hsl(142, 71%, 45%);
--warning: hsl(38, 92%, 50%);
--danger: hsl(0, 84%, 60%);
--muted: hsl(220, 10%, 95%);
```

#### Typography
- Font Family: Inter, system-ui, sans-serif
- Heading: 24px (h1), 20px (h2), 16px (h3)
- Body: 14px
- Small: 12px

#### Spacing
- Base unit: 4px
- Padding: 8px, 12px, 16px, 24px
- Margin: 8px, 16px, 24px, 32px

---

## Database Schema

### Tables

#### Todos Table
```sql
CREATE TABLE Todos (
    Id TEXT PRIMARY KEY,
    Title TEXT NOT NULL,
    Description TEXT,
    Status TEXT NOT NULL CHECK (Status IN ('active', 'completed')),
    Priority TEXT NOT NULL CHECK (Priority IN ('low', 'medium', 'high')),
    DueDate DATETIME,
    CreatedAt DATETIME NOT NULL,
    UpdatedAt DATETIME NOT NULL
);

CREATE INDEX idx_todos_status ON Todos(Status);
CREATE INDEX idx_todos_priority ON Todos(Priority);
CREATE INDEX idx_todos_duedate ON Todos(DueDate);
```

### Entity Framework Configuration
```csharp
public class TodoConfiguration : IEntityTypeConfiguration<Todo>
{
    public void Configure(EntityTypeBuilder<Todo> builder)
    {
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Title).IsRequired().HasMaxLength(200);
        builder.Property(t => t.Description).HasMaxLength(1000);
        builder.Property(t => t.Status).IsRequired().HasConversion<string>();
        builder.Property(t => t.Priority).IsRequired().HasConversion<string>();
        builder.Property(t => t.CreatedAt).IsRequired();
        builder.Property(t => t.UpdatedAt).IsRequired();
    }
}
```

---

## Testing Strategy

### Testing Pyramid
```
         /\
        /  \  E2E Tests (10%)
       /────\
      /      \  Integration Tests (30%)
     /────────\
    /          \  Unit Tests (60%)
   /────────────\
```

### Frontend Testing

#### E2E Tests (Playwright)
- User journey: Create, view, edit, delete todo
- Filter and sort functionality
- Search functionality
- Form validation
- Error handling scenarios

#### Component Tests
- TodoItem interactions
- Form submission and validation
- Filter state management
- Sort functionality

### Backend Testing

#### API Tests (.http files)
```http
### Create Todo
POST http://localhost:5000/api/todos
Content-Type: application/json

{
  "title": "Complete PRD",
  "description": "Finish the product requirements document",
  "priority": "high",
  "dueDate": "2025-01-15T00:00:00Z"
}

### Get All Todos
GET http://localhost:5000/api/todos?status=active&priority=high

### Update Todo
PUT http://localhost:5000/api/todos/{{todoId}}
Content-Type: application/json

{
  "status": "completed"
}

### Delete Todo
DELETE http://localhost:5000/api/todos/{{todoId}}
```

#### Unit Tests
- Use case logic validation
- Entity business rules
- Repository implementations
- Validation rules

### Test Data Strategy
- Seed data for development
- Test fixtures for consistent testing
- Factory pattern for test object creation

---

## Development Phases

### Phase 1: Foundation (Week 1)
**Milestone:** Basic project structure and infrastructure

**Backend Tasks:**
- [ ] Initialize .NET solution with clean architecture
- [ ] Set up Entity Framework with SQLite
- [ ] Create Todo entity and repository
- [ ] Implement basic CRUD endpoints
- [ ] Add Swagger documentation
- [ ] Set up error handling middleware

**Frontend Tasks:**
- [ ] Initialize React TypeScript project with Vite
- [ ] Install and configure Shadcn/ui
- [ ] Create basic layout components
- [ ] Set up routing (if needed)
- [ ] Configure API client
- [ ] Create basic theme configuration

**Git Commits:**
- `chore: Initialize project structure`
- `feat: Add Todo entity and repository`
- `feat: Implement CRUD API endpoints`
- `feat: Set up React frontend with Shadcn/ui`

### Phase 2: Core Features (Week 2)
**Milestone:** Complete CRUD functionality with UI

**Backend Tasks:**
- [ ] Add validation with FluentValidation
- [ ] Implement filtering and sorting
- [ ] Add search functionality
- [ ] Create bulk operations endpoint
- [ ] Optimize queries

**Frontend Tasks:**
- [ ] Create TodoList and TodoItem components
- [ ] Implement TodoForm with validation
- [ ] Add create and edit functionality
- [ ] Implement delete with confirmation
- [ ] Add loading and error states
- [ ] Implement real-time updates

**Git Commits:**
- `feat: Add todo validation rules`
- `feat: Implement filtering and sorting API`
- `feat: Create todo management UI components`
- `feat: Add form validation and error handling`

### Phase 3: Enhanced Features (Week 3)
**Milestone:** Advanced functionality and polish

**Backend Tasks:**
- [ ] Add request/response logging
- [ ] Implement API versioning
- [ ] Add performance monitoring
- [ ] Create database migrations

**Frontend Tasks:**
- [ ] Add filter components
- [ ] Implement sort functionality
- [ ] Create search component
- [ ] Add keyboard shortcuts
- [ ] Implement responsive design
- [ ] Add animations and transitions

**Git Commits:**
- `feat: Add todo filtering UI`
- `feat: Implement search functionality`
- `feat: Add responsive design`
- `perf: Optimize API queries`

### Phase 4: Testing & Documentation (Week 4)
**Milestone:** Comprehensive testing and documentation

**Tasks:**
- [ ] Write E2E tests with Playwright
- [ ] Create API test files (.http)
- [ ] Add unit tests for critical paths
- [ ] Write user documentation
- [ ] Create deployment guide
- [ ] Performance testing

**Git Commits:**
- `test: Add E2E test suite`
- `test: Create API test collection`
- `docs: Add user guide`
- `docs: Create deployment documentation`

---

## Success Metrics

### Performance KPIs
- Page load time < 2 seconds
- API response time < 200ms for list operations
- API response time < 100ms for CRUD operations
- 99.9% uptime

### Quality Metrics
- 80% code coverage for critical paths
- 0 high-severity bugs in production
- All WCAG 2.1 AA accessibility standards met

### User Experience Metrics
- Task completion rate > 95%
- User error rate < 5%
- Time to create todo < 10 seconds
- Time to find specific todo < 5 seconds

### Technical Metrics
- Build time < 30 seconds
- Deployment time < 5 minutes
- Memory usage < 100MB
- Database size growth < 10MB/month for typical usage

---

## Risks & Mitigations

### Technical Risks

**Risk:** SQLite performance with large datasets  
**Mitigation:** Implement pagination, add proper indexes, consider migration path to PostgreSQL

**Risk:** State management complexity as features grow  
**Mitigation:** Start with Context API, prepare architecture for Redux/Zustand if needed

**Risk:** CORS issues during development  
**Mitigation:** Proper CORS configuration, use proxy in development

### Project Risks

**Risk:** Scope creep with additional features  
**Mitigation:** Strict adherence to PRD, future features documented separately

**Risk:** Browser compatibility issues  
**Mitigation:** Test on major browsers, use Browserslist configuration

### Security Considerations
- Input validation on both frontend and backend
- SQL injection prevention via parameterized queries
- XSS prevention with proper React rendering
- HTTPS enforcement in production
- Rate limiting for API endpoints

---

## Appendices

### A. Glossary
- **Todo:** A task or item to be completed
- **Priority:** Importance level assigned to a todo (Low, Medium, High)
- **Status:** Current state of a todo (Active, Completed)
- **Clean Architecture:** Software design philosophy that separates concerns into layers

### B. References
- [React Documentation](https://react.dev)
- [.NET Documentation](https://docs.microsoft.com/dotnet)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [Clean Architecture Principles](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

### C. Version History
- v1.0 (2025-01-07): Initial PRD creation

---

**Document Status:** This PRD is ready for development team review and implementation.