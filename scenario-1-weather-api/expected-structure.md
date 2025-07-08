# Expected Project Structure - Weather API

This document shows what your final project structure should look like after completing the Weather API scenario.

## Solution Structure

```
WeatherTracker/
├── WeatherTracker.sln
├── src/
│   └── WeatherTracker/
│       ├── WeatherTracker.csproj
│       ├── Program.cs
│       ├── appsettings.json
│       ├── appsettings.Development.json
│       ├── Controllers/
│       │   └── WeatherController.cs
│       ├── Models/
│       │   ├── WeatherReading.cs
│       │   └── DTOs/
│       │       ├── WeatherReadingDto.cs
│       │       ├── CreateWeatherReadingDto.cs
│       │       ├── UpdateWeatherReadingDto.cs
│       │       └── WeatherSummaryDto.cs
│       ├── Data/
│       │   ├── WeatherDbContext.cs
│       │   └── SeedData.cs
│       ├── Services/
│       │   ├── IWeatherService.cs
│       │   ├── WeatherService.cs
│       │   └── BackgroundServices/
│       │       └── WeatherDataGeneratorService.cs
│       ├── Middleware/
│       │   └── RequestResponseLoggingMiddleware.cs
│       └── Extensions/
│           └── ServiceCollectionExtensions.cs
├── tests/
│   ├── WeatherTracker.UnitTests/
│   │   ├── WeatherTracker.UnitTests.csproj
│   │   ├── Controllers/
│   │   │   └── WeatherControllerTests.cs
│   │   ├── Services/
│   │   │   └── WeatherServiceTests.cs
│   │   └── TestHelpers/
│   │       ├── WeatherReadingBuilder.cs
│   │       └── TestDbContextFactory.cs
│   └── WeatherTracker.IntegrationTests/
│       ├── WeatherTracker.IntegrationTests.csproj
│       ├── WeatherApiTests.cs
│       └── TestFixtures/
│           └── WebApplicationFactory.cs
└── docs/
    ├── api-documentation.md
    └── postman-collection.json
```

## Key Files and Their Purpose

### Core Application Files

#### `Program.cs`
- Application startup and configuration
- Service registration and dependency injection
- Middleware pipeline configuration
- Database context setup
- Swagger/OpenAPI configuration

#### `WeatherController.cs`
- RESTful API endpoints for weather data
- Input validation and error handling
- Async/await patterns throughout
- Proper HTTP status codes
- XML documentation comments

#### `WeatherReading.cs` (Model)
```csharp
public class WeatherReading
{
    public int Id { get; set; }
    public string Location { get; set; }
    public decimal Temperature { get; set; }
    public int Humidity { get; set; }
    public decimal Pressure { get; set; }
    public string Description { get; set; }
    public DateTime Timestamp { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

#### `WeatherDbContext.cs`
- Entity Framework Core context
- Entity configurations
- Seed data setup
- Connection string management

### Service Layer

#### `WeatherService.cs`
- Business logic for weather operations
- Data access abstraction
- Caching implementation
- Error handling and logging

#### `WeatherDataGeneratorService.cs`
- Background service for generating sample data
- Runs every 30 seconds
- Creates realistic weather data

### DTOs (Data Transfer Objects)

#### `WeatherReadingDto.cs`
- Response model for API endpoints
- Clean separation from entity models

#### `CreateWeatherReadingDto.cs`
- Input model for creating weather readings
- Validation attributes

#### `UpdateWeatherReadingDto.cs`
- Input model for updating weather readings
- Validation attributes

### Testing Structure

#### Unit Tests
- Controller tests with mocked dependencies
- Service layer tests
- Model validation tests
- Test data builders for consistent test data

#### Integration Tests
- End-to-end API testing
- Database integration testing
- Custom WebApplicationFactory for test setup

## Expected Features

### API Endpoints
- `GET /api/weather` - List all weather readings
- `GET /api/weather/{id}` - Get specific reading
- `POST /api/weather` - Create new reading
- `PUT /api/weather/{id}` - Update existing reading
- `DELETE /api/weather/{id}` - Delete reading
- `GET /api/weather/location/{city}` - Get latest for city
- `GET /api/weather/summary` - Get summary statistics

### Advanced Features
- **Caching**: Redis or in-memory caching for frequently accessed data
- **Background Service**: Automatic weather data generation
- **Logging**: Structured logging with Serilog
- **Health Checks**: Database and API health monitoring
- **Rate Limiting**: API abuse prevention
- **API Versioning**: Support for multiple API versions
- **Swagger Documentation**: Interactive API documentation

### Configuration Files

#### `appsettings.json`
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=weather.db"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "WeatherSettings": {
    "CacheExpirationMinutes": 15,
    "DataGenerationIntervalSeconds": 30
  }
}
```

## Package Dependencies

### Main Project
- `Microsoft.AspNetCore.OpenApi`
- `Microsoft.EntityFrameworkCore.Sqlite`
- `Microsoft.EntityFrameworkCore.Tools`
- `Swashbuckle.AspNetCore`
- `Serilog.AspNetCore`
- `Microsoft.Extensions.Caching.Memory`
- `AspNetCoreRateLimit`

### Test Projects
- `Microsoft.NET.Test.Sdk`
- `xunit`
- `xunit.runner.visualstudio`
- `Microsoft.AspNetCore.Mvc.Testing`
- `Microsoft.EntityFrameworkCore.InMemory`
- `Moq`
- `FluentAssertions`

## Database Schema

### WeatherReadings Table
```sql
CREATE TABLE WeatherReadings (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Location NVARCHAR(100) NOT NULL,
    Temperature DECIMAL(5,2) NOT NULL,
    Humidity INTEGER NOT NULL,
    Pressure DECIMAL(7,2) NOT NULL,
    Description NVARCHAR(200),
    Timestamp DATETIME NOT NULL,
    CreatedAt DATETIME NOT NULL
);
```

## Verification Checklist

After completing the scenario, verify you have:

- [ ] Complete project structure as shown above
- [ ] All API endpoints working and documented
- [ ] Database with seed data
- [ ] Background service generating data
- [ ] Caching implemented and working
- [ ] Comprehensive test suite with good coverage
- [ ] Swagger UI accessible at `/swagger`
- [ ] Health checks accessible at `/health`
- [ ] Proper error handling and logging
- [ ] Rate limiting configured
- [ ] API versioning implemented

## Performance Expectations

Your completed API should demonstrate:
- Response times under 100ms for cached data
- Proper async/await usage throughout
- Efficient database queries
- Memory usage optimization
- Proper connection pooling