# Starter Prompts for Weather API Scenario

This file contains the exact prompts you should use with your AI coding assistant to complete the Weather API scenario. Copy and paste these prompts in order for the best results.

## 1. Project Creation Prompt

```
Create a new ASP.NET Core 8 Web API project called "WeatherTracker" with the following requirements:
- Use Entity Framework Core with SQLite
- Include Swagger/OpenAPI documentation
- Set up proper project structure with controllers, models, and data context
- Configure dependency injection
- Include development and production appsettings
```

**Expected Result**: Complete project structure with Program.cs, appsettings files, and basic configuration.

---

## 2. Data Model Creation Prompt

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

**Expected Result**: WeatherReading model, WeatherDbContext, and seed data configuration.

---

## 3. API Controller Creation Prompt

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

**Expected Result**: Complete WeatherController with all CRUD operations and DTOs.

---

## 4. Advanced Features Prompt

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

**Expected Result**: Background service, caching, middleware, health checks, and rate limiting.

---

## 5. Testing and Documentation Prompt

```
Create comprehensive testing and documentation for the WeatherTracker API:

1. Generate unit tests for the WeatherController using xUnit
2. Create integration tests for the API endpoints
3. Add test data builders and fixtures
4. Generate detailed API documentation with examples
5. Create a Postman collection for manual testing
6. Add performance benchmarks using BenchmarkDotNet
```

**Expected Result**: Complete test suite, documentation, and performance benchmarks.

---

## Tips for Success

### Before You Start
- Ensure you have .NET 8 SDK installed
- Have Visual Studio 2022 or VS Code ready
- Make sure your AI coding assistant extension is active

### While Working
- Use each prompt in sequence - don't skip ahead
- Wait for each prompt to complete before moving to the next
- Review the generated code to understand the patterns
- Test the application after each major step

### If Something Goes Wrong
- Check the troubleshooting section in the main README
- Try rephrasing the prompt with more specific requirements
- Ask your AI assistant to explain its decisions if unclear
- Don't hesitate to ask for code explanations

### Customization Ideas
Once you complete the basic scenario, try these variations:
- Add weather forecasting capabilities
- Implement user authentication
- Add weather alerts and notifications
- Create a simple web UI
- Add external weather API integration