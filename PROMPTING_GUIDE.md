# KiloCode Prompting Guide

This guide teaches you how to communicate effectively with KiloCode to get the best results for your .NET development projects.

## Understanding AI-Assisted Development

### What KiloCode Does Best
- **Code generation** from natural language descriptions
- **Refactoring and modernization** of existing code
- **Architecture planning** and design recommendations
- **Best practices implementation** automatically
- **Documentation generation** alongside code
- **Test creation** for existing and new code

### What to Keep in Mind
- KiloCode understands context and can maintain consistency across files
- It applies .NET best practices automatically
- It can explain its decisions and recommendations
- It works best with clear, specific requirements
- It can iterate and refine based on your feedback

## Effective Prompting Strategies

### 1. Be Specific and Detailed

#### ❌ Poor Example
```
Create an API for products
```

#### ✅ Good Example
```
Create an ASP.NET Core 8 Web API for product management with these specifications:
- CRUD operations for products (Create, Read, Update, Delete)
- Entity Framework Core with SQL Server
- Product entity with: Id, Name, Description, Price, CategoryId, CreatedDate
- Input validation using Data Annotations
- Async/await patterns throughout
- Swagger documentation
- Error handling with proper HTTP status codes
```

### 2. Provide Context and Constraints

#### ❌ Poor Example
```
Fix this code
```

#### ✅ Good Example
```
Modernize this .NET Framework 4.8 MVC controller to ASP.NET Core 8:
- Convert synchronous operations to async/await
- Replace ViewBag with strongly-typed models
- Add proper dependency injection
- Implement error handling middleware
- Maintain existing functionality for user management
- Follow RESTful API conventions
```

### 3. Specify Technology Stack and Patterns

#### ❌ Poor Example
```
Create a microservice
```

#### ✅ Good Example
```
Create a Product microservice using these technologies:
- ASP.NET Core 8 Web API
- Entity Framework Core with PostgreSQL
- MediatR for CQRS pattern implementation
- FluentValidation for input validation
- Serilog for structured logging
- Health checks for monitoring
- Docker containerization
- Include unit tests with xUnit and Moq
```

## Prompting Patterns for Different Scenarios

### Code Generation Prompts

#### Creating New Projects
```
Create a [project type] called "[name]" with these requirements:
- Technology stack: [specific versions and frameworks]
- Features: [list specific functionality]
- Architecture: [patterns and structure preferences]
- Database: [type and schema requirements]
- Testing: [testing framework and coverage expectations]
- Documentation: [API docs, code comments, README]
```

#### Adding Features
```
Add [feature name] to the existing [project/service] with:
- Integration points: [how it connects to existing code]
- Data requirements: [new entities, properties, relationships]
- Business rules: [validation, processing logic]
- API endpoints: [REST conventions, request/response formats]
- Error handling: [specific error scenarios]
- Testing: [unit and integration test requirements]
```

### Refactoring and Modernization Prompts

#### Legacy Code Modernization
```
Modernize this [language/framework version] code to [target version]:
- Preserve existing functionality: [specific behaviors to maintain]
- Apply modern patterns: [specific patterns to implement]
- Improve performance: [specific optimization goals]
- Add missing features: [logging, error handling, testing]
- Update dependencies: [package upgrades and replacements]
- Maintain backward compatibility: [if required]
```

#### Code Quality Improvements
```
Improve the code quality of [specific component] by:
- Applying SOLID principles: [specific violations to address]
- Implementing design patterns: [which patterns are appropriate]
- Adding error handling: [specific scenarios to handle]
- Improving testability: [dependency injection, mocking points]
- Optimizing performance: [specific bottlenecks identified]
- Adding documentation: [XML comments, README updates]
```

### Architecture and Design Prompts

#### System Architecture
```
Design a [system type] architecture for [business domain] with:
- Scale requirements: [users, transactions, data volume]
- Technology constraints: [required/preferred technologies]
- Integration needs: [external systems, APIs, databases]
- Non-functional requirements: [performance, security, availability]
- Deployment environment: [cloud, on-premise, hybrid]
- Team structure: [development team size and skills]
```

#### Database Design
```
Design a database schema for [domain] with:
- Entities and relationships: [business objects and connections]
- Data volume expectations: [scale and growth projections]
- Query patterns: [common access patterns and performance needs]
- Consistency requirements: [ACID vs eventual consistency]
- Migration strategy: [how to evolve schema over time]
- Backup and recovery: [data protection requirements]
```

## Advanced Prompting Techniques

### Iterative Development

#### Start Simple
```
Create a basic [component] with minimal functionality:
- Core entity with essential properties
- Basic CRUD operations
- Simple validation
- In-memory data storage for now
```

#### Then Enhance
```
Enhance the previous [component] by adding:
- Database persistence with Entity Framework
- Advanced validation rules
- Caching for performance
- Comprehensive error handling
- Unit tests for all operations
```

### Context Building

#### Provide Background
```
I'm working on a [project type] for [business domain]. The system needs to:
- [Business requirement 1]
- [Business requirement 2]
- [Technical constraint 1]
- [Technical constraint 2]

Now, create [specific component] that fits into this context...
```

#### Reference Previous Work
```
Building on the [previous component] we created, now add [new functionality] that:
- Integrates with the existing [component]
- Follows the same patterns and conventions
- Maintains consistency with the current architecture
- [Specific new requirements]
```

### Asking for Explanations

#### Understanding Decisions
```
Create [component] and explain:
- Why you chose this architecture pattern
- How this approach handles [specific concern]
- What alternatives were considered
- What trade-offs were made
- How this fits with .NET best practices
```

#### Learning Opportunities
```
Show me how to implement [pattern/technique] in .NET 8:
- Provide a complete working example
- Explain the benefits and drawbacks
- Show common pitfalls to avoid
- Include testing strategies
- Suggest when to use this approach
```

## Scenario-Specific Prompting Tips

### Scenario 1: Weather API (Beginner)
- **Focus on**: Clear requirements, step-by-step building
- **Ask for**: Explanations of patterns and best practices
- **Example**: "Create a weather API and explain why you chose this structure"

### Scenario 2: Legacy Modernization (Intermediate)
- **Focus on**: Preservation of functionality, systematic approach
- **Ask for**: Migration strategies and risk mitigation
- **Example**: "Modernize this code while maintaining all existing behavior"

### Scenario 3: Microservices (Advanced)
- **Focus on**: Architecture decisions, integration patterns
- **Ask for**: Design rationale and alternative approaches
- **Example**: "Design a microservices architecture and explain the service boundaries"

## Common Prompting Mistakes to Avoid

### 1. Being Too Vague
❌ "Make it better"
✅ "Improve performance by implementing caching and optimizing database queries"

### 2. Asking for Everything at Once
❌ "Create a complete e-commerce system with all features"
✅ "Create a product catalog service, then we'll add shopping cart functionality"

### 3. Not Providing Context
❌ "Add authentication"
✅ "Add JWT authentication to this Web API that integrates with our existing user database"

### 4. Ignoring Constraints
❌ "Use the latest technologies"
✅ "Modernize this code while maintaining compatibility with .NET 8 and SQL Server 2019"

### 5. Not Asking for Explanations
❌ Just accepting generated code without understanding
✅ "Explain why you used this pattern and what benefits it provides"

## Troubleshooting Prompts

### When Results Aren't What You Expected

#### Clarify Requirements
```
The previous code doesn't quite meet my needs. I need:
- [Specific requirement that wasn't met]
- [Additional constraint or preference]
- [Different approach or pattern]
Can you modify it accordingly?
```

#### Request Alternatives
```
Show me 2-3 different approaches for [requirement]:
- Approach 1: [specific pattern or technology]
- Approach 2: [alternative pattern or technology]
- Approach 3: [another alternative]
Explain the pros and cons of each.
```

#### Ask for Refinement
```
The generated code is close but needs these adjustments:
- [Specific change 1]
- [Specific change 2]
- [Specific change 3]
Please update the code with these modifications.
```

## Best Practices Summary

### Do's
- ✅ Be specific about requirements and constraints
- ✅ Provide context about your project and goals
- ✅ Ask for explanations to learn from the AI
- ✅ Build complexity gradually through iteration
- ✅ Specify technology versions and preferences
- ✅ Request tests and documentation alongside code
- ✅ Ask about best practices and alternatives

### Don'ts
- ❌ Use vague or ambiguous language
- ❌ Ask for everything in a single prompt
- ❌ Ignore the generated explanations
- ❌ Accept code without understanding it
- ❌ Forget to specify important constraints
- ❌ Skip testing and validation steps
- ❌ Assume the AI knows your specific context

## Example Prompting Session

Here's an example of effective prompting for a real scenario:

### Initial Request
```
Create an ASP.NET Core 8 Web API for a task management system with:
- Task entity: Id, Title, Description, DueDate, IsCompleted, Priority (enum)
- CRUD operations with proper HTTP verbs
- Entity Framework Core with SQL Server
- Input validation and error handling
- Swagger documentation
- Async/await throughout
```

### Follow-up Enhancement
```
Enhance the task API by adding:
- User authentication with JWT tokens
- Tasks are associated with specific users
- Users can only see/modify their own tasks
- Add filtering by completion status and priority
- Include audit fields (CreatedDate, ModifiedDate)
```

### Testing Request
```
Create comprehensive tests for the task API:
- Unit tests for the TaskController with mocked dependencies
- Integration tests for the complete API endpoints
- Test data builders for creating test tasks and users
- Verify authentication and authorization work correctly
```

---

**Remember**: Effective prompting is a skill that improves with practice. Start with clear, specific requests and iterate based on the results!