using Microsoft.EntityFrameworkCore;
using TodoApp.Application.Interfaces;
using TodoApp.Domain.Entities;
using TodoApp.Domain.Enums;
using TodoApp.Infrastructure.Data;

namespace TodoApp.Infrastructure.Repositories;

public class TodoRepository : ITodoRepository
{
    private readonly TodoDbContext _context;

    public TodoRepository(TodoDbContext context)
    {
        _context = context;
    }

    public async Task<Todo?> GetByIdAsync(Guid id)
    {
        return await _context.Todos.FindAsync(id);
    }

    public async Task<List<Todo>> GetAllAsync()
    {
        return await _context.Todos
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Todo>> GetFilteredAsync(
        TodoStatus? status = null,
        Priority? priority = null,
        string? search = null,
        string? sortBy = null,
        bool sortDescending = false)
    {
        var query = _context.Todos.AsQueryable();

        // Apply filters
        if (status.HasValue)
        {
            query = query.Where(t => t.Status == status.Value);
        }

        if (priority.HasValue)
        {
            query = query.Where(t => t.Priority == priority.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.ToLowerInvariant();
            query = query.Where(t => 
                t.Title.ToLower().Contains(searchLower) ||
                (t.Description != null && t.Description.ToLower().Contains(searchLower)));
        }

        // Apply sorting
        query = sortBy?.ToLowerInvariant() switch
        {
            "title" => sortDescending 
                ? query.OrderByDescending(t => t.Title)
                : query.OrderBy(t => t.Title),
            "priority" => sortDescending
                ? query.OrderByDescending(t => t.Priority)
                : query.OrderBy(t => t.Priority),
            "duedate" => sortDescending
                ? query.OrderByDescending(t => t.DueDate)
                : query.OrderBy(t => t.DueDate),
            "createdat" => sortDescending
                ? query.OrderByDescending(t => t.CreatedAt)
                : query.OrderBy(t => t.CreatedAt),
            _ => query.OrderByDescending(t => t.CreatedAt) // Default sort
        };

        return await query.ToListAsync();
    }

    public async Task<Todo> CreateAsync(Todo todo)
    {
        _context.Todos.Add(todo);
        await _context.SaveChangesAsync();
        return todo;
    }

    public async Task<Todo> UpdateAsync(Todo todo)
    {
        _context.Todos.Update(todo);
        await _context.SaveChangesAsync();
        return todo;
    }

    public async Task DeleteAsync(Guid id)
    {
        var todo = await _context.Todos.FindAsync(id);
        if (todo != null)
        {
            _context.Todos.Remove(todo);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<int> DeleteCompletedAsync()
    {
        var completedTodos = await _context.Todos
            .Where(t => t.Status == TodoStatus.Completed)
            .ToListAsync();

        _context.Todos.RemoveRange(completedTodos);
        await _context.SaveChangesAsync();

        return completedTodos.Count;
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Todos.AnyAsync(t => t.Id == id);
    }
}