using TodoApp.Application.DTOs;
using TodoApp.Application.Interfaces;
using TodoApp.Domain.Entities;
using TodoApp.Domain.Enums;

namespace TodoApp.Application.Services;

public class TodoService : ITodoService
{
    private readonly ITodoRepository _todoRepository;

    public TodoService(ITodoRepository todoRepository)
    {
        _todoRepository = todoRepository;
    }

    public async Task<TodoListResponse> GetAllTodosAsync(TodoQueryParameters queryParameters)
    {
        var status = ParseStatus(queryParameters.Status);
        var priority = ParsePriority(queryParameters.Priority);
        var sortDescending = queryParameters.SortDirection?.ToLowerInvariant() == "desc";

        var todos = await _todoRepository.GetFilteredAsync(
            status,
            priority,
            queryParameters.Search,
            queryParameters.SortBy,
            sortDescending);

        return new TodoListResponse
        {
            Data = todos.Select(MapToDto).ToList(),
            TotalCount = todos.Count
        };
    }

    public async Task<TodoDto?> GetTodoByIdAsync(Guid id)
    {
        var todo = await _todoRepository.GetByIdAsync(id);
        return todo != null ? MapToDto(todo) : null;
    }

    public async Task<TodoDto> CreateTodoAsync(CreateTodoRequest request)
    {
        var priority = ParsePriority(request.Priority) ?? Priority.Medium;
        
        var todo = new Todo(
            request.Title,
            request.Description,
            priority,
            request.DueDate);

        var createdTodo = await _todoRepository.CreateAsync(todo);
        return MapToDto(createdTodo);
    }

    public async Task<TodoDto?> UpdateTodoAsync(Guid id, UpdateTodoRequest request)
    {
        var existingTodo = await _todoRepository.GetByIdAsync(id);
        if (existingTodo == null)
            return null;

        existingTodo.UpdateTitle(request.Title);
        existingTodo.UpdateDescription(request.Description);
        
        var status = ParseStatus(request.Status);
        if (status.HasValue)
        {
            if (status == TodoStatus.Completed)
                existingTodo.MarkAsCompleted();
            else
                existingTodo.MarkAsActive();
        }

        var priority = ParsePriority(request.Priority);
        if (priority.HasValue)
            existingTodo.UpdatePriority(priority.Value);

        existingTodo.UpdateDueDate(request.DueDate);

        var updatedTodo = await _todoRepository.UpdateAsync(existingTodo);
        return MapToDto(updatedTodo);
    }

    public async Task<bool> DeleteTodoAsync(Guid id)
    {
        var exists = await _todoRepository.ExistsAsync(id);
        if (!exists)
            return false;

        await _todoRepository.DeleteAsync(id);
        return true;
    }

    public async Task<BulkDeleteResponse> DeleteCompletedTodosAsync()
    {
        var deletedCount = await _todoRepository.DeleteCompletedAsync();
        return new BulkDeleteResponse { DeletedCount = deletedCount };
    }

    private static TodoDto MapToDto(Todo todo)
    {
        return new TodoDto
        {
            Id = todo.Id,
            Title = todo.Title,
            Description = todo.Description,
            Status = todo.Status.ToString().ToLowerInvariant(),
            Priority = todo.Priority.ToString().ToLowerInvariant(),
            DueDate = todo.DueDate,
            CreatedAt = todo.CreatedAt,
            UpdatedAt = todo.UpdatedAt
        };
    }

    private static TodoStatus? ParseStatus(string? status)
    {
        if (string.IsNullOrWhiteSpace(status) || status.ToLowerInvariant() == "all")
            return null;

        return status.ToLowerInvariant() switch
        {
            "active" => TodoStatus.Active,
            "completed" => TodoStatus.Completed,
            _ => null
        };
    }

    private static Priority? ParsePriority(string? priority)
    {
        if (string.IsNullOrWhiteSpace(priority) || priority.ToLowerInvariant() == "all")
            return null;

        return priority.ToLowerInvariant() switch
        {
            "low" => Priority.Low,
            "medium" => Priority.Medium,
            "high" => Priority.High,
            _ => null
        };
    }
}