using Microsoft.EntityFrameworkCore;
using FluentValidation;
using TodoApp.Application.DTOs;
using TodoApp.Application.Interfaces;
using TodoApp.Application.Services;
using TodoApp.Application.Validators;
using TodoApp.Infrastructure.Data;
using TodoApp.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Add Entity Framework
builder.Services.AddDbContext<TodoDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? 
                     "Data Source=todos.db"));

// Add repositories
builder.Services.AddScoped<ITodoRepository, TodoRepository>();

// Add services
builder.Services.AddScoped<ITodoService, TodoService>();

// Add validators
builder.Services.AddScoped<IValidator<CreateTodoRequest>, CreateTodoRequestValidator>();
builder.Services.AddScoped<IValidator<UpdateTodoRequest>, UpdateTodoRequestValidator>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173", "http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { 
        Title = "Todo API", 
        Version = "v1",
        Description = "A simple Todo API built with Clean Architecture"
    });
    
    // Include XML comments if available
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

// Add logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Todo API V1");
        c.RoutePrefix = string.Empty; // Serve Swagger UI at root
    });
}

// Global error handling middleware
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        
        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        logger.LogError("An unhandled exception occurred");
        
        await context.Response.WriteAsync("""
            {
                "type": "https://tools.ietf.org/html/rfc7807",
                "title": "Internal Server Error",
                "status": 500,
                "detail": "An unexpected error occurred"
            }
            """);
    });
});

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<TodoDbContext>();
    context.Database.EnsureCreated();
}

app.Run();
