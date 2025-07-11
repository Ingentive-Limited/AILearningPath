# Scenario 1: Building a Weather API with Entity Framework Core

**Difficulty Level**: Beginner  
**Estimated Time**: 30-45 minutes  
**Technologies**: ASP.NET Core 8, Entity Framework Core, SQLite, Swagger

## Overview

In this scenario, you'll experience how AI coding assistants can transform a simple natural language description into a complete, production-ready weather tracking API. This is perfect for developers new to AI-assisted development who want to see immediate, tangible results.

## Learning Objectives

By completing this scenario, you will:
- Understand how to communicate effectively with AI for code generation
- Experience intelligent code completion and error detection
- Learn how AI applies .NET best practices automatically
- See how documentation can be generated alongside code
- Gain confidence in AI-assisted development workflows

## Prerequisites

### Required Software
- Visual Studio 2022 (17.8+) or VS Code with C# extension
- .NET 8 SDK (latest version)
- AI coding assistant (KiloCode, Cursor, Windsurf, or similar) installed and configured

### Required Knowledge
- Basic understanding of C# and .NET
- Familiarity with REST APIs (helpful but not required)
- Basic command line usage

## Scenario Setup

### Step 1: Create the Project Structure

1. **Open your terminal/command prompt** and navigate to the scenario folder:
   ```bash
   cd scenario-1-weather-api
   ```

2. **Use your AI coding assistant to create the project**. Open your AI assistant and use this prompt:

   ```
   Create a new ASP.NET Core 8 Web API project called "WeatherTracker" with the following requirements:
   - Use Entity Framework Core with SQLite
   - Include Swagger/OpenAPI documentation
   - Set up proper project structure with controllers, models, and data context
   - Configure dependency injection
   - Include development and production appsettings
   ```

   **Expected Result**: Your AI assistant should generate the basic project structure with all necessary files.

### Step 2: Define the Data Model

**Prompt for your AI coding assistant**:
```
Create a comprehensive weather data model for the WeatherTracker API with these specifications:

1. WeatherReading entity with properties:
   - Id (primary key)
   - Location (city name)
   - Temperature (decimal, Celsius)
   - Humidity (percentage)
   - Pressure (decimal, hPa)
   - Description (weather condition)
   - Timestamp (when reading was taken)
   - CreatedAt (when record was created)

2. Create the DbContext class with proper configuration
3. Add data annotations for validation
4. Include seed data with sample weather readings for 5 different cities
```

**What to Observe**:
- How your AI assistant creates proper entity relationships
- Automatic validation attributes
- DbContext configuration best practices
- Seed data generation

### Step 3: Build the API Controllers

**Prompt for your AI coding assistant**:
```
Create a comprehensive WeatherController for the WeatherTracker API with these endpoints:

1. GET /api/weather - Get all weather readings with optional filtering by location
2. GET /api/weather/{id} - Get specific weather reading by ID
3. POST /api/weather - Create new weather reading with validation
4. PUT /api/weather/{id} - Update existing weather reading
5. DELETE /api/weather/{id} - Delete weather reading
6. GET /api/weather/location/{city} - Get latest reading for specific city
7. GET /api/weather/summary - Get weather summary statistics

Include:
- Proper HTTP status codes
- Input validation and error handling
- Async/await patterns
- XML documentation comments
- DTO classes for requests/responses
```

**What to Observe**:
- RESTful API design patterns
- Proper error handling implementation
- Async programming best practices
- Automatic documentation generation

### Step 4: Add Advanced Features

**Prompt for your AI coding assistant**:
```
Enhance the WeatherTracker API with these advanced features:

1. Add a background service that generates random weather data every 30 seconds
2. Implement caching for frequently accessed weather data
3. Add logging throughout the application
4. Create custom middleware for request/response logging
5. Add health checks for the database and API
6. Implement API versioning
7. Add rate limiting to prevent API abuse
```

**What to Observe**:
- Background service implementation
- Caching strategies
- Middleware creation
- Health check configuration
- API versioning setup

### Step 5: Testing and Documentation

**Prompt for your AI coding assistant**:
```
Create comprehensive testing and documentation for the WeatherTracker API:

1. Generate unit tests for the WeatherController using xUnit
2. Create integration tests for the API endpoints
3. Add test data builders and fixtures
4. Generate detailed API documentation with examples
5. Create a Postman collection for manual testing
6. Add performance benchmarks using BenchmarkDotNet
```

**What to Observe**:
- Test structure and organization
- Mocking strategies
- Integration test setup
- Documentation quality

## Running and Testing the Application

### Step 1: Database Setup
```bash
# Run EF Core migrations
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Step 2: Run the Application
```bash
dotnet run
```

### Step 3: Test the API
1. **Open Swagger UI**: Navigate to `https://localhost:7xxx/swagger`
2. **Test endpoints**: Use the interactive Swagger interface
3. **Verify data**: Check that seed data is loaded correctly
4. **Test validation**: Try invalid inputs to see error handling

## Key AI Coding Assistant Capabilities Demonstrated

### 1. Natural Language to Code Translation
- **What you did**: Described requirements in plain English
- **What your AI assistant did**: Generated complete, working C# code
- **Learning**: AI can understand complex requirements and translate them into proper code structure

### 2. Best Practices Implementation
- **What you observed**: Proper async/await usage, dependency injection, error handling
- **What your AI assistant did**: Automatically applied .NET best practices
- **Learning**: AI incorporates industry standards without explicit instruction

### 3. Intelligent Code Completion
- **What you experienced**: Context-aware suggestions while typing
- **What your AI assistant did**: Predicted your intent and offered relevant completions
- **Learning**: AI understands code context and patterns

### 4. Error Detection and Fixes
- **What you saw**: Automatic detection of potential issues
- **What your AI assistant did**: Suggested fixes and improvements
- **Learning**: AI can identify and resolve common coding problems

## Expected Outcomes

After completing this scenario, you should have:

### Generated Files
- Complete ASP.NET Core 8 Web API project
- Entity Framework models and DbContext
- RESTful API controllers with full CRUD operations
- Unit and integration tests
- Comprehensive documentation
- Configuration files for different environments

### Working Features
- Fully functional weather tracking API
- Swagger documentation interface
- Database with seed data
- Background data generation service
- Caching and performance optimizations
- Health checks and monitoring

### Skills Gained
- Confidence in AI-assisted development
- Understanding of effective prompting techniques
- Knowledge of .NET 8 and EF Core best practices
- Experience with modern API development patterns

## Troubleshooting

### Common Issues and Solutions

#### Issue: "AI assistant generated code doesn't compile"
**Solution**: 
- Check that all NuGet packages are installed
- Verify .NET 8 SDK is properly installed
- Try regenerating the problematic section with a more specific prompt

#### Issue: "Database connection errors"
**Solution**:
- Ensure SQLite package is installed
- Check connection string in appsettings.json
- Run `dotnet ef database update` to create the database

#### Issue: "Swagger UI not loading"
**Solution**:
- Verify Swagger is configured in Program.cs
- Check that the application is running in Development mode
- Ensure the correct URL is being used

#### Issue: "Tests are failing"
**Solution**:
- Check that test database is properly configured
- Verify all test dependencies are installed
- Review test setup and teardown methods

### Getting Better Results from Your AI Assistant

#### Effective Prompting Tips
1. **Be specific about requirements**: Instead of "create an API," specify endpoints, data models, and business rules
2. **Mention technology preferences**: Specify frameworks, libraries, and patterns you want to use
3. **Request explanations**: Ask your AI assistant to explain its decisions and recommendations
4. **Iterate incrementally**: Start with basic functionality and add complexity gradually

#### Example of Good vs. Poor Prompts

**Poor Prompt**: "Make a weather app"

**Good Prompt**: "Create an ASP.NET Core 8 Web API for weather tracking with Entity Framework Core, SQLite database, CRUD operations for weather readings, input validation, async patterns, and Swagger documentation"

## Next Steps

Congratulations! You've completed Scenario 1 and experienced the power of AI-assisted development. You're now ready to:

1. **Experiment further**: Try modifying the generated code and see how your AI assistant helps
2. **Move to Scenario 2**: Ready for more complex challenges? Try the [Legacy Modernization scenario](../scenario-2-legacy-modernization/)
3. **Apply to your projects**: Use the techniques learned here in your own development work

## Additional Resources

- [ASP.NET Core 8 Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core Guide](https://docs.microsoft.com/en-us/ef/core/)
- [Swagger/OpenAPI Documentation](https://swagger.io/docs/)
- [xUnit Testing Framework](https://xunit.net/docs/getting-started/netcore/cmdline)

---

**Ready for the next challenge?** Move on to [Scenario 2: Legacy Modernization](../scenario-2-legacy-modernization/) to experience AI-assisted refactoring and migration!