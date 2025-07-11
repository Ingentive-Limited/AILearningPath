# Todo App Backend API

A .NET 8 Web API backend for a todo application built with clean architecture principles.

## Architecture

This project follows Clean Architecture with the following layers:

- **Domain Layer** (`TodoApp.Domain`): Core business entities and enums
- **Application Layer** (`TodoApp.Application`): Business logic, DTOs, interfaces, and validation
- **Infrastructure Layer** (`TodoApp.Infrastructure`): Data access, Entity Framework configuration
- **WebAPI Layer** (`TodoApp.WebAPI`): REST API controllers and configuration

## Features

- Complete CRUD operations for todos
- Clean Architecture with proper dependency injection
- Entity Framework Core with SQLite database
- FluentValidation for input validation
- Swagger/OpenAPI documentation
- Comprehensive error handling and logging
- Filtering, sorting, and pagination support
- Bulk operations (delete multiple todos)

## API Endpoints

### Todos Controller (`/api/todos`)

- `GET /api/todos` - Get all todos with optional filtering and pagination
- `GET /api/todos/{id}` - Get a specific todo by ID
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/{id}` - Update an existing todo
- `DELETE /api/todos/{id}` - Delete a specific todo
- `DELETE /api/todos` - Bulk delete todos by IDs

### Query Parameters for GET /api/todos

- `status` - Filter by todo status (Active, Completed)
- `priority` - Filter by priority (Low, Medium, High)
- `search` - Search in title and description
- `sortBy` - Sort field (Title, CreatedAt, DueDate, Priority)
- `sortOrder` - Sort direction (asc, desc)
- `page` - Page number for pagination
- `pageSize` - Number of items per page

## Getting Started

### Prerequisites

- .NET 8 SDK
- SQLite (included with .NET)

### Running the Application

1. Navigate to the backend directory:
   ```bash
   cd Demo/backend
   ```

2. Restore dependencies:
   ```bash
   dotnet restore
   ```

3. Build the solution:
   ```bash
   dotnet build
   ```

4. Run the application:
   ```bash
   dotnet run --project TodoApp.WebAPI
   ```

5. Open your browser and navigate to:
   - Swagger UI: `https://localhost:7000/swagger` or `http://localhost:5000/swagger`
   - API Base URL: `https://localhost:7000/api` or `http://localhost:5000/api`

### Database

The application uses SQLite with Entity Framework Core. The database file (`todos.db`) will be created automatically when the application starts.

## Project Structure

```
TodoApp.sln
├── TodoApp.Domain/
│   ├── Entities/
│   │   └── Todo.cs
│   └── Enums/
│       ├── Priority.cs
│       └── TodoStatus.cs
├── TodoApp.Application/
│   ├── DTOs/
│   │   └── TodoDto.cs
│   ├── Interfaces/
│   │   ├── ITodoRepository.cs
│   │   └── ITodoService.cs
│   ├── Services/
│   │   └── TodoService.cs
│   └── Validators/
│       ├── CreateTodoRequestValidator.cs
│       └── UpdateTodoRequestValidator.cs
├── TodoApp.Infrastructure/
│   ├── Data/
│   │   ├── TodoDbContext.cs
│   │   └── Configurations/
│   │       └── TodoConfiguration.cs
│   ├── Repositories/
│   │   └── TodoRepository.cs
│   └── Migrations/
└── TodoApp.WebAPI/
    ├── Controllers/
    │   └── TodosController.cs
    ├── Program.cs
    └── appsettings.json
```

## Technologies Used

- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- SQLite
- FluentValidation
- Swashbuckle (Swagger/OpenAPI)

## Configuration

The application can be configured through `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=todos.db"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  },
  "AllowedHosts": "*"
}
```

## Development

### Adding Migrations

To add a new migration after making changes to entities:

```bash
dotnet ef migrations add MigrationName --project TodoApp.Infrastructure --startup-project TodoApp.WebAPI
```

### Updating Database

To apply migrations to the database:

```bash
dotnet ef database update --project TodoApp.Infrastructure --startup-project TodoApp.WebAPI
```

## Testing

The API can be tested using:

1. **Swagger UI** - Interactive API documentation at `/swagger`
2. **HTTP Client** - Use tools like Postman, curl, or the included `TodoApp.WebAPI.http` file
3. **Unit Tests** - (To be implemented)

## Example Requests

### Create a Todo

```http
POST /api/todos
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API documentation",
  "priority": "High",
  "dueDate": "2024-01-15T10:00:00Z"
}
```

### Get Todos with Filtering

```http
GET /api/todos?status=Active&priority=High&sortBy=DueDate&sortOrder=asc&page=1&pageSize=10
```

### Update a Todo

```http
PUT /api/todos/1
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "status": "Completed",
  "priority": "Medium",
  "dueDate": "2024-01-20T15:30:00Z"
}
```

## License

This project is part of the Ingentive AI demo and is intended for educational purposes.