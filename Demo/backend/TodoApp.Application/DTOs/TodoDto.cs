using TodoApp.Domain.Enums;

namespace TodoApp.Application.DTOs;

public class TodoDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateTodoRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Priority { get; set; } = "medium";
    public DateTime? DueDate { get; set; }
}

public class UpdateTodoRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
}

public class TodoQueryParameters
{
    public string? Status { get; set; }
    public string? Priority { get; set; }
    public string? Search { get; set; }
    public string? SortBy { get; set; }
    public string? SortDirection { get; set; }
}

public class TodoListResponse
{
    public List<TodoDto> Data { get; set; } = new();
    public int TotalCount { get; set; }
}

public class BulkDeleteResponse
{
    public int DeletedCount { get; set; }
}