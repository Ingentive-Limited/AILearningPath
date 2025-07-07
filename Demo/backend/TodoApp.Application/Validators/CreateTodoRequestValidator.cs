using FluentValidation;
using TodoApp.Application.DTOs;

namespace TodoApp.Application.Validators;

public class CreateTodoRequestValidator : AbstractValidator<CreateTodoRequest>
{
    public CreateTodoRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("Title is required")
            .Length(1, 200)
            .WithMessage("Title must be between 1 and 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(1000)
            .WithMessage("Description cannot exceed 1000 characters");

        RuleFor(x => x.Priority)
            .Must(BeValidPriority)
            .WithMessage("Priority must be 'low', 'medium', or 'high'");

        RuleFor(x => x.DueDate)
            .Must(BeFutureDate)
            .When(x => x.DueDate.HasValue)
            .WithMessage("Due date must be in the future");
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