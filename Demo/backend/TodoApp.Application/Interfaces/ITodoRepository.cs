using TodoApp.Domain.Entities;
using TodoApp.Domain.Enums;

namespace TodoApp.Application.Interfaces;

public interface ITodoRepository
{
    Task<Todo?> GetByIdAsync(Guid id);
    Task<List<Todo>> GetAllAsync();
    Task<List<Todo>> GetFilteredAsync(
        TodoStatus? status = null,
        Priority? priority = null,
        string? search = null,
        string? sortBy = null,
        bool sortDescending = false);
    Task<Todo> CreateAsync(Todo todo);
    Task<Todo> UpdateAsync(Todo todo);
    Task DeleteAsync(Guid id);
    Task<int> DeleteCompletedAsync();
    Task<bool> ExistsAsync(Guid id);
}