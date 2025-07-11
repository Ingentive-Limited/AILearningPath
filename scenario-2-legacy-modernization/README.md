# Scenario 2: Modernizing a Legacy .NET Framework Application

**Difficulty Level**: Intermediate  
**Estimated Time**: 60-90 minutes  
**Technologies**: .NET Framework 4.8 → .NET 8, EF6 → EF Core, async patterns, modern C# features

## Overview

This scenario demonstrates AI coding assistant powerful refactoring and modernization capabilities. You'll work with a fictional legacy e-commerce system built on .NET Framework 4.8 and systematically modernize it to .NET 8, experiencing how AI can handle complex, multi-file transformations while maintaining functionality.

## Learning Objectives

By completing this scenario, you will:
- Experience AI-assisted large-scale code analysis and refactoring
- Learn how to modernize legacy applications systematically
- Understand migration strategies from EF6 to EF Core
- See how AI maintains functionality during complex transformations
- Gain experience with automated test generation for legacy code
- Learn performance optimization techniques with AI assistance

## Prerequisites

### Required Software
- Visual Studio 2022 (17.8+) or VS Code with C# extension
- .NET 8 SDK and .NET Framework 4.8 Developer Pack
- SQL Server LocalDB or SQL Server Express
- AI coding assistant (KiloCode, Cursor, Windsurf, or similar) installed and configured

### Required Knowledge
- Solid understanding of C# and .NET Framework
- Basic knowledge of Entity Framework
- Understanding of web applications and MVC patterns
- Familiarity with database concepts

## Scenario Setup

### Step 1: Understanding the Legacy Application

First, let's examine the legacy e-commerce system that you'll be modernizing.

**Prompt for your AI coding assistant**:
```
Create a realistic legacy .NET Framework 4.8 e-commerce application called "LegacyShop" with these characteristics:

1. ASP.NET MVC 5 web application
2. Entity Framework 6 with SQL Server
3. Synchronous operations throughout
4. Old-style dependency injection (if any)
5. Minimal error handling
6. No unit tests
7. Mixed coding styles and patterns

Include these components:
- Product catalog management
- Shopping cart functionality
- Order processing
- User management
- Basic reporting

The code should represent typical legacy patterns:
- Synchronous database calls
- Direct database access in controllers
- Minimal separation of concerns
- Old C# syntax (pre-C# 8)
- Configuration in web.config
- Global.asax for application startup
```

**What to Observe**:
- Legacy patterns and anti-patterns
- Synchronous code throughout
- Tight coupling between layers
- Outdated configuration approaches

### Step 2: Initial Analysis and Planning

**Prompt for your AI coding assistant**:
```
Analyze the LegacyShop application and create a comprehensive modernization plan:

1. Identify all areas that need modernization
2. Assess the current architecture and suggest improvements
3. Create a migration roadmap with priorities
4. Identify potential breaking changes and risks
5. Suggest modern patterns to replace legacy ones
6. Estimate the complexity of each modernization task
7. Recommend testing strategies for the migration

Provide a detailed report with:
- Current state analysis
- Target state architecture
- Step-by-step migration plan
- Risk assessment and mitigation strategies
```

**What to Observe**:
- AI's ability to analyze complex codebases
- Systematic approach to modernization planning
- Risk identification and mitigation strategies
- Prioritization of modernization tasks

### Step 3: Project Structure Modernization

**Prompt for your AI coding assistant**:
```
Modernize the LegacyShop project structure to .NET 8:

1. Convert from .NET Framework 4.8 to .NET 8
2. Update project files to SDK-style format
3. Migrate from ASP.NET MVC 5 to ASP.NET Core 8 MVC
4. Replace web.config with appsettings.json
5. Update Global.asax logic to Program.cs
6. Reorganize folder structure following modern conventions
7. Update all NuGet package references
8. Configure modern dependency injection
9. Set up proper logging with ILogger
10. Add health checks and monitoring

Maintain all existing functionality while modernizing the infrastructure.
```

**What to Observe**:
- Systematic project file transformation
- Configuration migration strategies
- Modern startup patterns
- Dependency injection setup

### Step 4: Data Access Layer Modernization

**Prompt for your AI coding assistant**:
```
Modernize the data access layer from Entity Framework 6 to Entity Framework Core:

1. Convert DbContext from EF6 to EF Core
2. Update all entity configurations to use Fluent API
3. Migrate from synchronous to asynchronous operations
4. Implement repository pattern with dependency injection
5. Add proper connection string management
6. Create migration scripts for database schema
7. Implement proper transaction handling
8. Add connection resilience and retry policies
9. Optimize queries for performance
10. Add database health checks

Ensure all existing data access functionality is preserved while improving performance and maintainability.
```

**What to Observe**:
- EF6 to EF Core migration patterns
- Async/await implementation throughout
- Modern data access patterns
- Performance optimization techniques

### Step 5: Business Logic Modernization

**Prompt for your AI coding assistant**:
```
Modernize the business logic layer with these improvements:

1. Extract business logic from controllers into services
2. Implement proper separation of concerns
3. Add comprehensive input validation using FluentValidation
4. Convert all operations to async/await patterns
5. Implement proper error handling and logging
6. Add caching where appropriate
7. Implement modern C# features (pattern matching, nullable reference types, etc.)
8. Add business rule validation
9. Implement domain events for loose coupling
10. Add performance monitoring and metrics

Focus on:
- Clean architecture principles
- SOLID principles implementation
- Modern C# language features
- Comprehensive error handling
```

**What to Observe**:
- Service layer extraction and organization
- Modern C# syntax adoption
- Error handling improvements
- Performance optimization strategies

### Step 6: API Modernization

**Prompt for your AI coding assistant**:
```
Modernize the web layer and add a modern Web API:

1. Update existing MVC controllers to use modern patterns
2. Create a comprehensive Web API alongside the MVC application
3. Implement proper API versioning
4. Add Swagger/OpenAPI documentation
5. Implement JWT authentication and authorization
6. Add rate limiting and throttling
7. Implement proper CORS configuration
8. Add API response caching
9. Implement proper HTTP status code handling
10. Add API health checks and monitoring

Ensure backward compatibility while adding modern API capabilities.
```

**What to Observe**:
- MVC to Web API patterns
- Authentication modernization
- API documentation generation
- Security improvements

### Step 7: Testing Strategy Implementation

**Prompt for your AI coding assistant**:
```
Create a comprehensive testing strategy for the modernized application:

1. Generate unit tests for all business logic services
2. Create integration tests for data access layer
3. Add API integration tests for all endpoints
4. Implement end-to-end tests for critical user journeys
5. Create performance tests for key operations
6. Add database migration tests
7. Implement test data builders and fixtures
8. Set up test database management
9. Add code coverage reporting
10. Create automated testing pipeline

Focus on:
- High test coverage for critical functionality
- Realistic test data scenarios
- Performance regression testing
- Database migration validation
```

**What to Observe**:
- Comprehensive test generation
- Test organization and structure
- Integration test patterns
- Performance testing setup

### Step 8: Performance Optimization

**Prompt for your AI coding assistant**:
```
Optimize the modernized application for performance:

1. Implement response caching strategies
2. Add database query optimization
3. Implement connection pooling
4. Add memory caching for frequently accessed data
5. Optimize async operations and avoid blocking calls
6. Implement lazy loading where appropriate
7. Add compression for API responses
8. Optimize static file serving
9. Implement database indexing strategies
10. Add performance monitoring and alerting

Provide before/after performance comparisons and benchmarks.
```

**What to Observe**:
- Performance optimization techniques
- Caching strategies implementation
- Database optimization approaches
- Monitoring and alerting setup

## Running and Testing the Modernized Application

### Step 1: Database Migration
```bash
# Create and run EF Core migrations
dotnet ef migrations add InitialMigration
dotnet ef database update

# Verify data migration
dotnet run --verify-data-migration
```

### Step 2: Run the Application
```bash
# Run the modernized application
dotnet run

# Run with specific environment
dotnet run --environment Production
```

### Step 3: Comprehensive Testing
```bash
# Run all unit tests
dotnet test --collect:"XPlat Code Coverage"

# Run integration tests
dotnet test --filter Category=Integration

# Run performance tests
dotnet run --project PerformanceTests
```

### Step 4: Performance Comparison
1. **Load test the legacy version** (if available)
2. **Load test the modernized version**
3. **Compare metrics**: Response times, memory usage, throughput
4. **Verify functionality**: Ensure all features work correctly

## Key AI Coding Assistant Capabilities Demonstrated

### 1. Large-Scale Code Analysis
- **What you experienced**: Analysis of entire legacy codebase
- **What your AI assistant did**: Identified patterns, anti-patterns, and modernization opportunities
- **Learning**: AI can understand complex, interconnected codebases and suggest systematic improvements

### 2. Multi-File Coordinated Refactoring
- **What you observed**: Changes across multiple files maintained consistency
- **What your AI assistant did**: Coordinated refactoring while preserving functionality
- **Learning**: AI can handle complex refactoring scenarios that affect multiple components

### 3. Migration Assistance
- **What you experienced**: Systematic migration from old to new technologies
- **What your AI assistant did**: Provided step-by-step migration guidance and code transformation
- **Learning**: AI can guide complex technology migrations with minimal risk

### 4. Test Generation for Legacy Code
- **What you saw**: Comprehensive tests generated for existing functionality
- **What your AI assistant did**: Created tests that validate current behavior before refactoring
- **Learning**: AI can create safety nets for legacy code modernization

### 5. Performance Optimization
- **What you experienced**: Systematic performance improvements
- **What your AI assistant did**: Identified bottlenecks and implemented optimizations
- **Learning**: AI can analyze and improve application performance systematically

## Expected Outcomes

After completing this scenario, you should have:

### Modernized Application
- Complete .NET 8 application with modern patterns
- Async/await throughout the application
- Modern dependency injection and configuration
- EF Core with optimized data access
- Comprehensive API with documentation
- Modern authentication and authorization

### Testing Suite
- Unit tests with high coverage
- Integration tests for all major components
- Performance tests and benchmarks
- End-to-end test scenarios
- Automated test pipeline

### Performance Improvements
- Significantly improved response times
- Better memory utilization
- Enhanced scalability
- Improved error handling and resilience

### Skills Gained
- Systematic approach to legacy modernization
- Understanding of migration strategies
- Experience with modern .NET patterns
- Knowledge of performance optimization techniques

## Troubleshooting

### Common Migration Issues

#### Issue: "Breaking changes during migration"
**Solution**:
- Review your AI assistant's migration plan carefully
- Test each migration step incrementally
- Use feature flags to enable gradual rollout
- Maintain backward compatibility where possible

#### Issue: "Performance regression after migration"
**Solution**:
- Run performance benchmarks before and after
- Use your AI assistant to identify performance bottlenecks
- Implement caching and optimization strategies
- Monitor application metrics continuously

#### Issue: "Database migration failures"
**Solution**:
- Test migrations on a copy of production data
- Use your AI assistant to generate rollback scripts
- Implement migration validation tests
- Plan for zero-downtime deployment strategies

#### Issue: "Test failures after refactoring"
**Solution**:
- Review test expectations vs. new behavior
- Update tests to match modernized patterns
- Use your AI assistant to generate additional test scenarios
- Implement integration tests for critical paths

### Advanced Troubleshooting Tips

1. **Use incremental migration**: Don't try to modernize everything at once
2. **Maintain feature parity**: Ensure all original functionality is preserved
3. **Monitor continuously**: Set up monitoring before and after migration
4. **Plan rollback strategies**: Always have a way to revert changes

## Best Practices for Legacy Modernization

### Effective Prompting for Complex Refactoring

**Good Practices**:
- Break down large refactoring tasks into smaller, manageable chunks
- Specify which functionality must be preserved
- Request step-by-step migration plans
- Ask for risk assessment and mitigation strategies

**Example Effective Prompt**:
```
Modernize the ProductService class from synchronous EF6 operations to async EF Core operations. 
Preserve all existing functionality including:
- Product search with filtering
- Inventory management
- Price calculations
- Audit logging

Provide:
1. Step-by-step migration plan
2. Before/after code comparison
3. Unit tests for the modernized service
4. Performance optimization suggestions
```

### Migration Strategy Recommendations

1. **Start with infrastructure**: Project files, configuration, dependencies
2. **Modernize data access**: Database layer and entity framework
3. **Update business logic**: Services and domain logic
4. **Enhance presentation layer**: Controllers and APIs
5. **Add comprehensive testing**: Unit, integration, and performance tests
6. **Optimize performance**: Caching, async operations, and monitoring

## Next Steps

Excellent work! You've successfully modernized a legacy application with AI assistance. You're now ready to:

1. **Apply to real projects**: Use these techniques on your own legacy applications
2. **Move to Scenario 3**: Ready for enterprise-scale challenges? Try the [Microservices Architecture scenario](../scenario-3-microservices/)
3. **Explore advanced patterns**: Experiment with more complex modernization scenarios

## Additional Resources

- [.NET Upgrade Assistant](https://docs.microsoft.com/en-us/dotnet/core/porting/upgrade-assistant-overview)
- [EF6 to EF Core Migration Guide](https://docs.microsoft.com/en-us/ef/efcore-and-ef6/porting/)
- [ASP.NET Core Migration Guide](https://docs.microsoft.com/en-us/aspnet/core/migration/mvc)
- [Performance Best Practices](https://docs.microsoft.com/en-us/aspnet/core/performance/performance-best-practices)

---