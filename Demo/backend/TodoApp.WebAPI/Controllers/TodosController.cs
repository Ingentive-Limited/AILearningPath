using Microsoft.AspNetCore.Mvc;
using FluentValidation;
using TodoApp.Application.DTOs;
using TodoApp.Application.Interfaces;

namespace TodoApp.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    private readonly ITodoService _todoService;
    private readonly IValidator<CreateTodoRequest> _createValidator;
    private readonly IValidator<UpdateTodoRequest> _updateValidator;
    private readonly ILogger<TodosController> _logger;

    public TodosController(
        ITodoService todoService,
        IValidator<CreateTodoRequest> createValidator,
        IValidator<UpdateTodoRequest> updateValidator,
        ILogger<TodosController> logger)
    {
        _todoService = todoService;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _logger = logger;
    }

    /// <summary>
    /// Get all todos with optional filtering and sorting
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<TodoListResponse>> GetTodos([FromQuery] TodoQueryParameters queryParameters)
    {
        try
        {
            var result = await _todoService.GetAllTodosAsync(queryParameters);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving todos");
            return StatusCode(500, "An error occurred while retrieving todos");
        }
    }

    /// <summary>
    /// Get a specific todo by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TodoDto>> GetTodo(Guid id)
    {
        try
        {
            var todo = await _todoService.GetTodoByIdAsync(id);
            if (todo == null)
            {
                return NotFound();
            }

            return Ok(todo);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving todo {TodoId}", id);
            return StatusCode(500, "An error occurred while retrieving the todo");
        }
    }

    /// <summary>
    /// Create a new todo
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TodoDto>> CreateTodo([FromBody] CreateTodoRequest request)
    {
        try
        {
            var validationResult = await _createValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return BadRequest(CreateValidationProblem(validationResult));
            }

            var todo = await _todoService.CreateTodoAsync(request);
            return CreatedAtAction(nameof(GetTodo), new { id = todo.Id }, todo);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating todo");
            return StatusCode(500, "An error occurred while creating the todo");
        }
    }

    /// <summary>
    /// Update an existing todo
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TodoDto>> UpdateTodo(Guid id, [FromBody] UpdateTodoRequest request)
    {
        try
        {
            var validationResult = await _updateValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return BadRequest(CreateValidationProblem(validationResult));
            }

            var todo = await _todoService.UpdateTodoAsync(id, request);
            if (todo == null)
            {
                return NotFound();
            }

            return Ok(todo);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating todo {TodoId}", id);
            return StatusCode(500, "An error occurred while updating the todo");
        }
    }

    /// <summary>
    /// Delete a specific todo
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteTodo(Guid id)
    {
        try
        {
            var deleted = await _todoService.DeleteTodoAsync(id);
            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting todo {TodoId}", id);
            return StatusCode(500, "An error occurred while deleting the todo");
        }
    }

    /// <summary>
    /// Delete all completed todos
    /// </summary>
    [HttpDelete("completed")]
    public async Task<ActionResult<BulkDeleteResponse>> DeleteCompletedTodos()
    {
        try
        {
            var result = await _todoService.DeleteCompletedTodosAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting completed todos");
            return StatusCode(500, "An error occurred while deleting completed todos");
        }
    }

    private static ValidationProblemDetails CreateValidationProblem(FluentValidation.Results.ValidationResult validationResult)
    {
        var errors = validationResult.Errors
            .GroupBy(e => e.PropertyName)
            .ToDictionary(
                g => g.Key,
                g => g.Select(e => e.ErrorMessage).ToArray()
            );

        return new ValidationProblemDetails(errors)
        {
            Type = "https://tools.ietf.org/html/rfc7807",
            Title = "Validation Error",
            Status = 400,
            Detail = "One or more validation errors occurred"
        };
    }
}