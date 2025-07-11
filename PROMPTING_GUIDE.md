# AI-Assisted Development Prompting Guide

A comprehensive guide to effective prompting for AI-assisted development using this demo project as practical examples. Works with KiloCode, Cursor, Windsurf, and other AI coding assistants.

## Table of Contents

1. [Introduction to AI-Assisted Development Prompting](#introduction)
2. [Frontend Development Prompts](#frontend-development-prompts)
3. [Backend Development Prompts](#backend-development-prompts)
4. [Testing and Quality Assurance Prompts](#testing-and-quality-assurance-prompts)
5. [Code Analysis and Refactoring Prompts](#code-analysis-and-refactoring-prompts)
6. [Architecture and Design Prompts](#architecture-and-design-prompts)
7. [Debugging and Troubleshooting Prompts](#debugging-and-troubleshooting-prompts)
8. [Advanced AI Development Techniques](#advanced-ai-development-techniques)

## Introduction to AI-Assisted Development Prompting {#introduction}

Effective AI prompting is crucial for maximizing productivity in modern software development. This guide uses this demo project - a full-stack Todo application with React/TypeScript frontend, .NET Clean Architecture backend, and comprehensive testing - to demonstrate practical prompting techniques that work with various AI coding assistants.

### Key Principles for Effective Prompting

1. **Be Specific and Contextual**: Reference specific files, functions, and patterns
2. **Provide Clear Requirements**: Define expected outcomes and constraints
3. **Use Progressive Complexity**: Start simple, then add complexity
4. **Include Error Handling**: Always consider edge cases and error scenarios
5. **Request Best Practices**: Ask for industry standards and patterns

### Demo Project Structure Overview

```
Demo/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # TodoForm, TodoList, TodoItem, etc.
│   │   ├── hooks/         # useTodos custom hooks
│   │   ├── types/         # TypeScript interfaces
│   │   └── services/      # API client
├── backend/           # .NET Clean Architecture
│   ├── TodoApp.Domain/    # Entities, Enums, Business Logic
│   ├── TodoApp.Application/ # Services, DTOs, Interfaces
│   ├── TodoApp.Infrastructure/ # Data Access, Repositories
│   └── TodoApp.WebAPI/    # Controllers, Program.cs
└── e2e/               # Playwright Testing
    ├── tests/             # E2E test specifications
    ├── page-objects/      # Page Object Model
    └── api-tests/         # HTTP API tests
```

### Understanding the Demo Project Context

The Demo project implements a Todo application with:
- **Frontend**: React with TypeScript, form validation with Zod, state management with TanStack Query
- **Backend**: .NET 9 with Clean Architecture, Entity Framework Core, FluentValidation
- **Testing**: Playwright for E2E testing, comprehensive API testing with HTTP files

## Frontend Development Prompts {#frontend-development-prompts}

### Basic Component Creation

#### ❌ Poor Example
```
Create a todo component
```

#### ✅ Good Example
```
Create a React TypeScript component similar to Demo/frontend/src/components/TodoForm.tsx that:
- Uses react-hook-form with Zod validation like the existing TodoForm
- Follows the same styling patterns with Tailwind CSS and shadcn/ui components
- Implements proper TypeScript interfaces from Demo/frontend/src/types/todo.ts
- Integrates with the useTodos hook pattern from Demo/frontend/src/hooks/useTodos.ts
- Includes proper error handling and loading states with toast notifications
- Uses the same UI components (Dialog, Button, Input, Select) from shadcn/ui
- Follows the same form structure with enhanced styling and animations
```

**Expected AI Response**: The AI should analyze the existing [`TodoForm.tsx`](Demo/frontend/src/components/TodoForm.tsx:1) component structure, understand the validation patterns with Zod schema, styling approach with Tailwind CSS, and create a consistent component that follows the established patterns.

**Tips for Effective Frontend Prompting**:
- Reference existing components for consistency
- Specify TypeScript interfaces and validation requirements
- Mention styling frameworks and UI libraries in use
- Include accessibility and responsive design requirements

### Custom Hook Development

#### ✅ Effective Prompt
```
Analyze Demo/frontend/src/hooks/useTodos.ts and create a similar custom hook for managing user preferences that:
- Uses TanStack Query for caching like the existing useTodos hook (lines 14-21)
- Implements CRUD operations with proper error handling like useCreateTodo (lines 33-48)
- Follows the same mutation pattern with toast notifications using sonner
- Includes optimistic updates for better UX
- Maintains the same query key structure and cache invalidation strategy
- Integrates with the existing API service pattern
- Uses the same staleTime and gcTime configuration for optimal caching
```

**Expected AI Response**: The AI should examine the [`useTodos.ts`](Demo/frontend/src/hooks/useTodos.ts:1) hook patterns, understand the TanStack Query implementation, and create a similar hook with consistent error handling and caching strategies.

### Form Validation Enhancement

#### ✅ Advanced Example
```
Enhance the validation in Demo/frontend/src/components/TodoForm.tsx by:
- Extending the Zod schema (lines 30-36) with custom validation rules
- Adding real-time validation feedback like the title field (lines 152-173)
- Implementing conditional validation based on priority level
- Creating reusable validation components for common patterns
- Maintaining the existing error display styling with animations (lines 168-173)
- Ensuring validation works with the existing form submission flow (lines 95-119)
- Following the same test-id patterns for E2E testing compatibility
```

### State Management Patterns

#### ✅ Complex Scenario
```
Refactor the todo filtering logic to use a more sophisticated state management pattern:
- Analyze how Demo/frontend/src/components/TodoFilters.tsx currently handles filters
- Implement a reducer pattern for complex filter combinations
- Add URL synchronization for filter state persistence
- Maintain compatibility with the existing useTodos hook query parameters
- Include proper TypeScript types from Demo/frontend/src/types/todo.ts (TodoQueryParameters)
- Add debouncing for search input like professional applications
- Ensure the filtering integrates with the existing TodoList component
```

## Backend Development Prompts {#backend-development-prompts}

### Clean Architecture Implementation

#### ✅ Comprehensive Example
```
Following the Clean Architecture pattern demonstrated in the Demo backend:
- Analyze Demo/backend/TodoApp.Domain/Entities/Todo.cs entity structure (lines 5-74)
- Create a new "Category" entity with similar domain methods like UpdateTitle, MarkAsCompleted
- Implement the full layer structure following the TodoService pattern:
  * Domain entity in TodoApp.Domain/Entities/ with business logic methods
  * Repository interface in TodoApp.Application/Interfaces/ like ITodoRepository
  * Service implementation in TodoApp.Application/Services/ following TodoService.cs patterns
  * Repository implementation in TodoApp.Infrastructure/Repositories/ with EF Core
  * Controller in TodoApp.WebAPI/Controllers/ following TodosController.cs structure
- Follow the same validation patterns as Demo/backend/TodoApp.Application/Validators/
- Maintain consistency with existing DTOs and error handling patterns
- Use the same dependency injection configuration from Program.cs
```

**Expected AI Response**: The AI should examine the [`Todo.cs`](Demo/backend/TodoApp.Domain/Entities/Todo.cs:1) entity, understand the Clean Architecture layers, and create a complete implementation following the established patterns.

### API Controller Development

#### ✅ Detailed Prompt
```
Create a new API controller following the pattern in Demo/backend/TodoApp.WebAPI/Controllers/TodosController.cs:
- Implement the same error handling and logging patterns (lines 40-44, 87-91)
- Use FluentValidation like the existing controller (lines 78-82, 102-106)
- Follow the same HTTP status code conventions and response patterns
- Include comprehensive XML documentation comments like the existing methods
- Implement the same async/await patterns throughout
- Add proper dependency injection following the existing constructor pattern (lines 17-27)
- Include the same validation problem details formatting (lines 164-180)
- Use the same route structure and parameter validation patterns
```

### Service Layer Enhancement

#### ✅ Service Pattern Example
```
Enhance Demo/backend/TodoApp.Application/Services/TodoService.cs by adding:
- Bulk operations similar to DeleteCompletedTodosAsync (lines 95-99)
- Advanced filtering with specification pattern while maintaining GetFilteredAsync compatibility
- Caching layer integration while maintaining the existing ITodoService interface
- Audit logging for all CRUD operations following the existing patterns
- Performance optimizations for large datasets
- Maintain the existing DTO mapping patterns (lines 101-114)
- Keep the same error handling and validation approach
- Follow the same async/await patterns and dependency injection
```

### Repository Pattern Extension

#### ✅ Data Access Prompt
```
Extend the repository pattern demonstrated in Demo/backend/TodoApp.Infrastructure/Repositories/TodoRepository.cs:
- Add complex query methods with Entity Framework optimization
- Implement specification pattern for dynamic filtering
- Add bulk operations with proper transaction handling
- Include performance monitoring and logging
- Maintain the existing async patterns and error handling
- Follow the same Entity Framework configuration approach as TodoConfiguration.cs
- Use the same DbContext patterns from TodoDbContext.cs
- Ensure compatibility with existing service layer expectations
```

## Testing and Quality Assurance Prompts {#testing-and-quality-assurance-prompts}

### E2E Test Development

#### ✅ Playwright Testing Example
```
Create comprehensive E2E tests following the pattern in Demo/e2e/tests/todo-crud.spec.ts:
- Use the same Page Object Model structure as Demo/e2e/page-objects/TodoPage.ts
- Implement similar test fixtures as Demo/e2e/fixtures/todoFixtures.ts
- Follow the same test organization with describe blocks (lines 6, 30, 102, 136, 202, 250)
- Include the same setup/teardown patterns with cleanupTodos (lines 18-19, 25-27)
- Add cross-browser testing like the existing integration tests
- Use the same assertion patterns and error handling
- Include accessibility testing and responsive design validation
- Follow the same data-testid patterns for element selection
- Implement the same API cleanup and preparation strategies
```

**Expected AI Response**: The AI should analyze the [`todo-crud.spec.ts`](Demo/e2e/tests/todo-crud.spec.ts:1) test structure, understand the Page Object Model pattern, and create comprehensive tests following the established conventions.

### API Testing Enhancement

#### ✅ HTTP Testing Prompt
```
Expand the API testing in Demo/e2e/api-tests/todos-api.http by:
- Adding comprehensive edge case testing following the validation tests pattern (lines 64-127)
- Including performance testing scenarios
- Adding security testing for authentication endpoints
- Creating data-driven test scenarios using the variable system (lines 4-7)
- Including negative testing for all validation rules like the existing examples
- Adding concurrent request testing
- Following the same variable and request organization pattern
- Including cleanup sections like the existing pattern (lines 375-399)
- Testing Unicode and special character handling (lines 325-356)
```

### Unit Testing Strategy

#### ✅ Backend Unit Testing
```
Create unit tests for the service layer following .NET testing best practices:
- Test Demo/backend/TodoApp.Application/Services/TodoService.cs methods
- Use proper mocking for ITodoRepository dependencies
- Include test data builders for complex scenarios
- Test all validation scenarios and error conditions
- Follow AAA (Arrange, Act, Assert) pattern consistently
- Include integration tests for the full request pipeline
- Test the FluentValidation rules in isolation
- Mock the Entity Framework context appropriately
- Test the DTO mapping logic (MapToDto method lines 101-114)
- Verify the parsing methods (ParseStatus, ParsePriority lines 116-141)
```

### Frontend Testing Patterns

#### ✅ React Testing Example
```
Create comprehensive tests for Demo/frontend/src/components/TodoForm.tsx:
- Use React Testing Library with proper accessibility queries
- Test form validation scenarios with the Zod schema (lines 30-36)
- Mock the useTodos hook for isolated component testing
- Test user interactions and form submission flows (onSubmit lines 95-119)
- Include error state and loading state testing
- Test responsive behavior and keyboard navigation
- Follow the same testing patterns as existing components
- Test the form reset functionality (lines 73-93)
- Verify proper integration with the Dialog component
- Test the priority and status selection components
```

## Code Analysis and Refactoring Prompts {#code-analysis-and-refactoring-prompts}

### Performance Analysis

#### ✅ Performance Optimization Prompt
```
Analyze the performance of Demo/frontend/src/hooks/useTodos.ts and suggest optimizations:
- Review the TanStack Query configuration for optimal caching (staleTime: 30000, gcTime: 300000)
- Identify potential memory leaks in the mutation handlers (lines 36-47, 54-68)
- Suggest improvements for the query invalidation strategy
- Analyze the API call patterns for potential batching opportunities
- Review the error handling for performance impact
- Suggest optimizations for large todo lists
- Maintain the existing functionality while improving performance
- Consider implementing virtual scrolling for large datasets
- Optimize the cache update patterns in mutations
```

### Code Quality Assessment

#### ✅ Quality Review Example
```
Perform a comprehensive code quality review of Demo/backend/TodoApp.WebAPI/Controllers/TodosController.cs:
- Analyze adherence to SOLID principles in the controller design
- Review error handling patterns (lines 40-44, 64-67) and suggest improvements
- Assess the validation approach and recommend enhancements
- Evaluate the logging strategy for production readiness
- Review the async/await usage for potential deadlocks
- Suggest improvements for testability and maintainability
- Ensure compliance with REST API best practices
- Review the dependency injection patterns (lines 17-27)
- Assess the XML documentation completeness
- Evaluate the HTTP status code usage consistency
```

### Refactoring Legacy Patterns

#### ✅ Modernization Prompt
```
Refactor the following code to match the modern patterns used in the Demo project:
- Apply the same Clean Architecture structure as the Demo backend
- Implement the same validation patterns using FluentValidation
- Convert to async/await patterns like Demo controllers
- Add proper dependency injection following Demo's Program.cs
- Implement the same error handling and logging patterns
- Use Entity Framework Core patterns like TodoDbContext.cs
- Follow the same DTO mapping approaches
- Maintain backward compatibility while modernizing the codebase
- Apply the same configuration patterns from appsettings.json
```

## Architecture and Design Prompts {#architecture-and-design-prompts}

### System Architecture Analysis

#### ✅ Architecture Review Prompt
```
Analyze the architecture of the Demo project and suggest improvements for scaling:
- Review the Clean Architecture implementation in the backend layers
- Assess the frontend state management with TanStack Query
- Evaluate the API design for RESTful compliance in TodosController.cs
- Suggest caching strategies for improved performance
- Recommend database optimization strategies for TodoDbContext
- Propose monitoring and logging enhancements
- Consider microservices migration path if needed
- Analyze the separation of concerns between layers
- Review the dependency injection configuration
- Assess the testing strategy across all layers
```

### Design Pattern Implementation

#### ✅ Pattern Application Example
```
Implement the Repository pattern more comprehensively in the Demo project:
- Enhance Demo/backend/TodoApp.Infrastructure/Repositories/TodoRepository.cs
- Add specification pattern for complex queries
- Implement unit of work pattern for transaction management
- Add generic repository base class for code reuse
- Maintain the existing Entity Framework integration
- Follow the same dependency injection patterns
- Include proper error handling and logging
- Ensure compatibility with the existing service layer
- Follow the same async patterns throughout
- Maintain the existing interface contracts
```

### Database Design Enhancement

#### ✅ Data Modeling Prompt
```
Enhance the database design based on Demo/backend/TodoApp.Domain/Entities/Todo.cs:
- Add audit fields and soft delete functionality
- Implement proper indexing strategies for performance
- Add database constraints and relationships
- Design migration strategies for schema evolution
- Implement optimistic concurrency control
- Add database-level validation rules
- Follow the same Entity Framework configuration patterns
- Maintain compatibility with existing queries
- Consider partitioning strategies for large datasets
- Implement proper backup and recovery procedures
```

## Debugging and Troubleshooting Prompts {#debugging-and-troubleshooting-prompts}

### Frontend Debugging

#### ✅ React Debugging Example
```
Debug the following issue in Demo/frontend/src/components/TodoForm.tsx:
- Form submission is not working properly
- Analyze the form validation logic (lines 30-36, 58-67)
- Check the mutation handling in onSubmit (lines 95-119)
- Verify the error handling and toast notifications
- Examine the form reset logic (lines 73-93)
- Debug the TypeScript type issues
- Check the integration with useTodos hooks
- Verify the Dialog component behavior
- Analyze the form state management
- Check for memory leaks in useEffect hooks
```

### Backend Debugging

#### ✅ API Debugging Prompt
```
Debug performance issues in Demo/backend/TodoApp.WebAPI/Controllers/TodosController.cs:
- Analyze slow response times in GetTodos endpoint (lines 32-45)
- Check database query performance in the service layer
- Review the Entity Framework query patterns
- Examine the validation overhead
- Debug memory usage patterns
- Check for N+1 query problems
- Analyze the async/await implementation
- Review the error handling performance impact
- Check the dependency injection configuration
- Examine the logging overhead
```

### Integration Debugging

#### ✅ Full-Stack Debugging Example
```
Debug integration issues between frontend and backend in the Demo project:
- Analyze API communication patterns
- Check CORS configuration and headers
- Debug authentication and authorization flows
- Examine error propagation from backend to frontend
- Check data serialization/deserialization issues
- Debug network request failures
- Analyze state synchronization problems
- Check for race conditions in async operations
- Debug caching issues in TanStack Query
- Examine the error handling chain
```

### Testing Debugging

#### ✅ Test Debugging Prompt
```
Debug failing tests in Demo/e2e/tests/todo-crud.spec.ts:
- Analyze test flakiness and timing issues
- Debug page object interactions
- Check test data setup and cleanup (lines 18-19, 25-27)
- Examine selector reliability
- Debug async operation handling
- Check test isolation problems
- Analyze browser-specific failures
- Debug API mocking issues
- Check test environment configuration
- Examine test data dependencies
```

## Advanced AI Development Techniques {#advanced-ai-development-techniques}

### Progressive Enhancement

#### ✅ Iterative Development Example
```
Start with basic functionality and progressively enhance:

Phase 1: Basic Implementation
- Create a simple todo component following TodoForm.tsx structure
- Implement basic CRUD operations
- Add simple validation

Phase 2: Enhanced Features
- Add advanced validation like the Demo project
- Implement state management with TanStack Query
- Add error handling and loading states

Phase 3: Production Ready
- Add comprehensive testing
- Implement performance optimizations
- Add accessibility features
- Include monitoring and logging
```

### Context-Aware Development

#### ✅ Contextual Prompting
```
Building on the existing Demo project architecture:
- Analyze the current Clean Architecture implementation
- Understand the existing patterns and conventions
- Identify integration points with existing code
- Maintain consistency with established practices
- Consider the impact on existing functionality
- Follow the same coding standards and patterns
- Ensure compatibility with existing tests
- Maintain the same error handling approaches
```

### Multi-Layer Development

#### ✅ Full-Stack Feature Implementation
```
Implement a new feature across all layers of the Demo project:

Frontend Layer:
- Create React components following TodoForm.tsx patterns
- Implement custom hooks like useTodos.ts
- Add TypeScript interfaces to types/todo.ts

Backend Layer:
- Add domain entities following Todo.cs structure
- Implement service layer following TodoService.cs
- Create API controllers following TodosController.cs
- Add repository implementations

Testing Layer:
- Create E2E tests following todo-crud.spec.ts
- Add API tests to todos-api.http
- Implement unit tests for all layers
```

### Code Generation with Context

#### ✅ Intelligent Code Generation
```
Generate code that integrates seamlessly with the Demo project:
- Analyze existing patterns and conventions
- Follow the same architectural principles
- Use consistent naming conventions
- Implement similar error handling patterns
- Follow the same validation approaches
- Use the same dependency injection patterns
- Maintain the same logging and monitoring approaches
- Ensure compatibility with existing infrastructure
```

## Common Pitfalls to Avoid

### 1. Ignoring Existing Patterns
❌ "Create a new component without considering existing patterns"
✅ "Create a component following the patterns in TodoForm.tsx"

### 2. Not Specifying Integration Points
❌ "Add authentication to the app"
✅ "Add authentication that integrates with the existing TodosController.cs and useTodos.ts patterns"

### 3. Overlooking Testing Requirements
❌ "Create a new feature"
✅ "Create a new feature with E2E tests following todo-crud.spec.ts patterns"

### 4. Not Considering Performance
❌ "Add more features"
✅ "Add features while maintaining the performance patterns used in useTodos.ts"

### 5. Ignoring Error Handling
❌ "Implement the happy path"
✅ "Implement with error handling following the patterns in TodosController.cs"

## Best Practices Summary

### Effective Prompting Checklist
- ✅ Reference specific Demo project files and line numbers
- ✅ Specify integration with existing patterns
- ✅ Include error handling and validation requirements
- ✅ Request testing alongside implementation
- ✅ Consider performance implications
- ✅ Maintain architectural consistency
- ✅ Include accessibility and responsive design
- ✅ Follow established naming conventions
- ✅ Consider the full development lifecycle
- ✅ Request explanations for learning

### Progressive Complexity Approach
1. **Start Simple**: Basic functionality following existing patterns
2. **Add Features**: Enhanced capabilities with proper integration
3. **Optimize**: Performance and user experience improvements
4. **Scale**: Production-ready with monitoring and testing
5. **Maintain**: Long-term sustainability and evolution

---

**Remember**: The Demo project serves as your reference implementation. Always analyze existing patterns, understand the architectural decisions, and build upon the established foundation for consistent, maintainable, and scalable solutions.