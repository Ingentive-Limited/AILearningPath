using TodoApp.Domain.Enums;

namespace TodoApp.Domain.Entities;

public class Todo
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public TodoStatus Status { get; set; }
    public Priority Priority { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Todo()
    {
        Id = Guid.NewGuid();
        Status = TodoStatus.Active;
        Priority = Priority.Medium;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public Todo(string title, string? description = null, Priority priority = Priority.Medium, DateTime? dueDate = null)
        : this()
    {
        Title = title;
        Description = description;
        Priority = priority;
        DueDate = dueDate;
    }

    public void UpdateTitle(string title)
    {
        Title = title;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateDescription(string? description)
    {
        Description = description;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdatePriority(Priority priority)
    {
        Priority = priority;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateDueDate(DateTime? dueDate)
    {
        DueDate = dueDate;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkAsCompleted()
    {
        Status = TodoStatus.Completed;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkAsActive()
    {
        Status = TodoStatus.Active;
        UpdatedAt = DateTime.UtcNow;
    }

    public bool IsOverdue()
    {
        return DueDate.HasValue && DueDate.Value < DateTime.UtcNow && Status == TodoStatus.Active;
    }
}