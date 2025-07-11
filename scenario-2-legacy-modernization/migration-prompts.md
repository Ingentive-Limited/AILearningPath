# Migration Prompts for Legacy Modernization

This file contains specific prompts for each phase of the legacy modernization process. Use these prompts with your AI coding assistant to systematically modernize the legacy e-commerce application.

## Phase 1: Analysis and Planning

### 1.1 Initial Analysis Prompt

```
Analyze the provided legacy .NET Framework 4.8 e-commerce application (LegacyShop) and create a comprehensive modernization assessment:

1. Code Analysis:
   - Identify all anti-patterns and code smells
   - Document synchronous operations that need async conversion
   - Find tight coupling and separation of concerns issues
   - Identify performance bottlenecks and inefficient queries
   - Locate security vulnerabilities and outdated practices

2. Architecture Assessment:
   - Evaluate current layering and separation of concerns
   - Identify missing patterns (repository, service layer, etc.)
   - Assess error handling and logging approaches
   - Review configuration management approach
   - Analyze testing coverage and quality

3. Technology Stack Review:
   - Document current dependencies and versions
   - Identify obsolete packages and frameworks
   - Assess compatibility with .NET 8
   - Review database access patterns (EF6 vs EF Core)
   - Evaluate authentication and security approaches

Provide a detailed report with prioritized recommendations for modernization.
```

### 1.2 Migration Strategy Planning Prompt

```
Create a comprehensive migration strategy for modernizing the LegacyShop application from .NET Framework 4.8 to .NET 8:

1. Migration Roadmap:
   - Define 8 distinct phases with clear objectives
   - Prioritize changes by risk and business impact
   - Identify dependencies between modernization tasks
   - Estimate effort and timeline for each phase
   - Define rollback strategies for each phase

2. Risk Assessment:
   - Identify potential breaking changes
   - Assess data migration risks
   - Evaluate performance impact during migration
   - Plan for business continuity during transition
   - Define testing strategies to mitigate risks

3. Success Criteria:
   - Define measurable outcomes for each phase
   - Set performance benchmarks
   - Establish code quality metrics
   - Define business functionality validation criteria
   - Plan user acceptance testing approach

Include detailed phase-by-phase implementation plan with specific tasks and deliverables.
```

## Phase 2: Infrastructure Modernization

### 2.1 Project Structure Modernization Prompt

```
Modernize the LegacyShop project structure from .NET Framework 4.8 to .NET 8:

1. Project File Conversion:
   - Convert from packages.config to PackageReference format
   - Update to SDK-style project files
   - Configure target framework to .NET 8
   - Update all NuGet package references to compatible versions
   - Remove obsolete references and configurations

2. Application Startup Modernization:
   - Convert Global.asax.cs logic to Program.cs
   - Implement modern dependency injection container
   - Configure middleware pipeline
   - Set up modern logging with ILogger
   - Configure health checks and monitoring

3. Configuration Migration:
   - Convert web.config to appsettings.json
   - Implement options pattern for configuration
   - Set up environment-specific configurations
   - Configure connection strings management
   - Implement secure configuration for sensitive data

Ensure all existing functionality is preserved while modernizing the infrastructure.
```

### 2.2 Dependency Injection Setup Prompt

```
Implement modern dependency injection for the modernized LegacyShop application:

1. Service Registration:
   - Configure all application services in Program.cs
   - Set up proper service lifetimes (Singleton, Scoped, Transient)
   - Register DbContext with proper configuration
   - Configure logging services and providers
   - Set up health check services

2. Interface Creation:
   - Create interfaces for all business services
   - Define repository interfaces for data access
   - Create abstractions for external dependencies
   - Implement proper dependency inversion
   - Ensure testability through interfaces

3. Service Implementation:
   - Implement service classes with proper constructor injection
   - Configure service dependencies correctly
   - Add proper error handling and logging
   - Implement async patterns throughout
   - Ensure thread safety where required

Include comprehensive configuration and validation of the DI container.
```

## Phase 3: Data Access Modernization

### 3.1 Entity Framework Migration Prompt

```
Migrate the data access layer from Entity Framework 6 to Entity Framework Core:

1. DbContext Modernization:
   - Convert ShopDbContext to use EF Core
   - Update entity configurations to use Fluent API
   - Implement proper connection string management
   - Configure database provider and options
   - Set up proper DbContext lifetime management

2. Model Configuration:
   - Update all entity models for EF Core compatibility
   - Configure relationships using Fluent API
   - Add proper indexing and constraints
   - Implement audit fields and tracking
   - Configure value converters where needed

3. Migration Strategy:
   - Create EF Core migrations from existing schema
   - Ensure data compatibility and integrity
   - Plan for zero-downtime migration
   - Create rollback procedures
   - Test migration with production-like data

Preserve all existing data relationships and ensure no data loss during migration.
```

### 3.2 Async/Await Implementation Prompt

```
Convert all synchronous database operations to async/await patterns:

1. Repository Pattern Implementation:
   - Create async repository interfaces
   - Implement async repository classes
   - Add proper cancellation token support
   - Configure dependency injection for repositories
   - Implement unit of work pattern if needed

2. Service Layer Async Conversion:
   - Convert all service methods to async
   - Implement proper async/await patterns
   - Add cancellation token propagation
   - Handle async exceptions properly
   - Optimize async operation performance

3. Controller Modernization:
   - Update all controller actions to async
   - Implement proper async action results
   - Add timeout and cancellation support
   - Configure async model binding
   - Test async operation performance

Ensure no blocking calls and proper async patterns throughout the application.
```

## Phase 4: Business Logic Modernization

### 4.1 Service Layer Extraction Prompt

```
Extract business logic from controllers into a proper service layer:

1. Service Interface Design:
   - Create interfaces for all business operations
   - Define clear service boundaries and responsibilities
   - Implement proper input/output models (DTOs)
   - Add comprehensive validation interfaces
   - Design for testability and maintainability

2. Service Implementation:
   - Extract all business logic from controllers
   - Implement proper error handling and logging
   - Add comprehensive input validation
   - Implement business rule validation
   - Add performance monitoring and metrics

3. Controller Refactoring:
   - Refactor controllers to use services only
   - Implement proper HTTP status code handling
   - Add comprehensive error handling
   - Implement proper model validation
   - Add API documentation and examples

Ensure clean separation of concerns and proper layering architecture.
```

### 4.2 Modern C# Features Implementation Prompt

```
Modernize the codebase to use latest C# language features:

1. Language Feature Updates:
   - Implement nullable reference types throughout
   - Use pattern matching where appropriate
   - Apply record types for DTOs and value objects
   - Use init-only properties for immutable objects
   - Implement proper exception handling with modern patterns

2. Code Quality Improvements:
   - Apply SOLID principles throughout the codebase
   - Implement proper encapsulation and data hiding
   - Use expression-bodied members where appropriate
   - Apply async enumerable patterns where beneficial
   - Implement proper resource disposal patterns

3. Performance Optimizations:
   - Use Span<T> and Memory<T> for performance-critical code
   - Implement proper string handling and interpolation
   - Use collection expressions and LINQ optimizations
   - Apply memory-efficient patterns
   - Implement proper caching strategies

Ensure code maintainability and performance while using modern C# features.
```

## Phase 5: API Modernization

### 5.1 Web API Implementation Prompt

```
Create a modern Web API alongside the existing MVC application:

1. API Controller Design:
   - Create RESTful API controllers for all entities
   - Implement proper HTTP verb usage and status codes
   - Add comprehensive input validation and error handling
   - Implement proper async patterns throughout
   - Add API versioning support

2. Documentation and Discovery:
   - Configure Swagger/OpenAPI documentation
   - Add comprehensive XML documentation comments
   - Create example requests and responses
   - Implement API health checks
   - Add API metrics and monitoring

3. Security Implementation:
   - Implement JWT authentication
   - Add role-based authorization
   - Configure CORS properly
   - Implement rate limiting and throttling
   - Add security headers and validation

Ensure backward compatibility while providing modern API capabilities.
```

### 5.2 Authentication Modernization Prompt

```
Modernize authentication and authorization from Forms Authentication to JWT:

1. JWT Implementation:
   - Configure JWT authentication middleware
   - Implement token generation and validation
   - Add refresh token functionality
   - Configure token expiration and security
   - Implement proper token storage and management

2. Authorization Enhancement:
   - Implement role-based authorization
   - Add policy-based authorization where appropriate
   - Configure authorization middleware
   - Implement proper permission checking
   - Add audit logging for security events

3. Security Hardening:
   - Implement secure password hashing
   - Add multi-factor authentication support
   - Configure account lockout and security policies
   - Implement proper session management
   - Add security monitoring and alerting

Ensure security best practices and compliance with modern standards.
```

## Phase 6: Testing Implementation

### 6.1 Unit Testing Creation Prompt

```
Create comprehensive unit tests for the modernized application:

1. Service Layer Testing:
   - Create unit tests for all business services
   - Implement proper mocking for dependencies
   - Add test data builders and fixtures
   - Test all business logic scenarios
   - Achieve minimum 80% code coverage

2. Controller Testing:
   - Create unit tests for all API controllers
   - Mock service dependencies properly
   - Test all HTTP status code scenarios
   - Validate input validation and error handling
   - Test authentication and authorization

3. Repository Testing:
   - Create unit tests for repository implementations
   - Use in-memory database for testing
   - Test all CRUD operations
   - Validate query logic and performance
   - Test error scenarios and edge cases

Include comprehensive test organization and maintainable test code.
```

### 6.2 Integration Testing Prompt

```
Create comprehensive integration tests for the modernized application:

1. API Integration Tests:
   - Create end-to-end API tests for all endpoints
   - Test complete request/response cycles
   - Validate database integration
   - Test authentication and authorization flows
   - Test error handling and edge cases

2. Database Integration Tests:
   - Test EF Core migrations and schema
   - Validate data access patterns
   - Test transaction handling
   - Validate query performance
   - Test connection resilience

3. Performance Testing:
   - Create load tests for critical endpoints
   - Test concurrent user scenarios
   - Validate caching effectiveness
   - Test database performance under load
   - Monitor memory usage and resource consumption

Include automated test execution and reporting.
```

## Phase 7: Performance Optimization

### 7.1 Caching Implementation Prompt

```
Implement comprehensive caching strategy for the modernized application:

1. In-Memory Caching:
   - Implement IMemoryCache for frequently accessed data
   - Configure cache expiration policies
   - Add cache invalidation strategies
   - Monitor cache hit/miss ratios
   - Optimize cache key strategies

2. Distributed Caching:
   - Configure Redis for distributed caching
   - Implement cache-aside pattern
   - Add cache warming strategies
   - Configure cache serialization
   - Implement cache failover and resilience

3. Response Caching:
   - Configure HTTP response caching
   - Implement conditional requests (ETags)
   - Add compression middleware
   - Configure static file caching
   - Monitor caching effectiveness

Include performance benchmarks and monitoring for all caching strategies.
```

### 7.2 Performance Optimization Prompt

```
Optimize the modernized application for performance:

1. Database Optimization:
   - Optimize all database queries
   - Add proper indexing strategies
   - Implement connection pooling
   - Configure query timeout and retry policies
   - Add database performance monitoring

2. Application Performance:
   - Optimize async operations and avoid blocking
   - Implement lazy loading where appropriate
   - Optimize memory usage and garbage collection
   - Add performance counters and metrics
   - Configure application warm-up strategies

3. Network Optimization:
   - Implement response compression
   - Optimize JSON serialization
   - Configure HTTP/2 support
   - Implement CDN integration for static content
   - Add network performance monitoring

Provide before/after performance comparisons and benchmarks.
```

## Phase 8: Deployment and DevOps

### 8.1 Containerization Prompt

```
Containerize the modernized application for deployment:

1. Docker Configuration:
   - Create optimized Dockerfile with multi-stage builds
   - Configure proper base images and security
   - Implement health checks in containers
   - Configure environment variables and secrets
   - Optimize container size and startup time

2. Docker Compose Setup:
   - Create docker-compose for local development
   - Configure service dependencies and networking
   - Set up database and cache containers
   - Configure volume management
   - Add development debugging support

3. Production Deployment:
   - Configure production-ready container settings
   - Implement proper logging and monitoring
   - Configure resource limits and scaling
   - Set up container orchestration (Kubernetes)
   - Plan deployment and rollback strategies

Include comprehensive documentation and deployment guides.
```

### 8.2 CI/CD Pipeline Prompt

```
Create comprehensive CI/CD pipeline for the modernized application:

1. Build Pipeline:
   - Configure automated build process
   - Add code quality analysis (SonarQube)
   - Implement security scanning (SAST/DAST)
   - Run all unit and integration tests
   - Generate code coverage reports

2. Deployment Pipeline:
   - Configure environment-specific deployments
   - Implement database migration automation
   - Add smoke testing and validation
   - Configure blue-green deployment strategy
   - Implement automated rollback procedures

3. Monitoring and Alerting:
   - Set up application performance monitoring
   - Configure error tracking and alerting
   - Implement health check monitoring
   - Add deployment success/failure notifications
   - Create operational dashboards

Include comprehensive pipeline documentation and troubleshooting guides.
```

## Tips for Using These Prompts

### Before Starting Each Phase
1. Review the checklist items for the phase
2. Ensure previous phase is completed and tested
3. Back up your current progress
4. Read the prompt carefully and understand the objectives

### While Working with Your AI Coding Assistant
1. Use prompts in the order provided
2. Wait for each prompt to complete before proceeding
3. Review and test the generated code thoroughly
4. Ask for explanations if the approach isn't clear
5. Customize prompts based on your specific needs

### After Each Phase
1. Test all functionality thoroughly
2. Update the checklist with completed items
3. Document any issues or deviations
4. Commit your progress to version control
5. Plan the next phase based on results

### Troubleshooting Tips
- If a prompt generates unexpected results, try breaking it into smaller, more specific prompts
- Ask your AI assistant to explain its decisions and recommendations
- Request alternative approaches if the first attempt doesn't meet your needs
- Use the modernization checklist to verify completeness
- Test incrementally rather than waiting until the end

### Customization Guidelines
- Adapt prompts to match your specific legacy application structure
- Add domain-specific requirements to the prompts
- Include your organization's coding standards and practices
- Modify technology choices based on your infrastructure
- Adjust timelines and priorities based on business needs