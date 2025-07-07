using FluentValidation;
using TodoApp.Application.DTOs;

namespace TodoApp.Application.Validators;

public class UpdateTodoRequestValidator : AbstractValidator<UpdateTodoRequest>
{
    public UpdateTodoRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("Title is required")
            .Length(1, 200)
            .WithMessage("Title must be between 1 and 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(1000)
            .WithMessage("Description cannot exceed 1000 characters");

        RuleFor(x => x.Status)
            .Must(BeValidStatus)
            .WithMessage("Status must be 'active' or 'completed'");

        RuleFor(x => x.Priority)
            .Must(BeValidPriority)
            .WithMessage("Priority must be 'low', 'medium', or 'high'");

        RuleFor(x => x.DueDate)
            .Must(BeFutureDate)
            .When(x => x.DueDate.HasValue)
            .WithMessage("Due date must be in the future");
    }

    private static bool BeValidStatus(string status)
    {
        var validStatuses = new[] { "active", "completed" };
        return validStatuses.Contains(status.ToLowerInvariant());
    }

    private static bool BeValidPriority(string priority)
    {
        var validPriorities = new[] { "low", "medium", "high" };
        return validPriorities.Contains(priority.ToLowerInvariant());
    }

    private static bool BeFutureDate(DateTime? dueDate)
    {
        return !dueDate.HasValue || dueDate.Value > DateTime.UtcNow;
    }
}