using TodoApp.Application.DTOs;

namespace TodoApp.Application.Interfaces;

public interface ITodoService
{
    Task<TodoListResponse> GetAllTodosAsync(TodoQueryParameters queryParameters);
    Task<TodoDto?> GetTodoByIdAsync(Guid id);
    Task<TodoDto> CreateTodoAsync(CreateTodoRequest request);
    Task<TodoDto?> UpdateTodoAsync(Guid id, UpdateTodoRequest request);
    Task<bool> DeleteTodoAsync(Guid id);
    Task<BulkDeleteResponse> DeleteCompletedTodosAsync();
}