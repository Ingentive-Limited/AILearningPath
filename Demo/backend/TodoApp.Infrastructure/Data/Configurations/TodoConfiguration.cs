using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TodoApp.Domain.Entities;
using TodoApp.Domain.Enums;

namespace TodoApp.Infrastructure.Data.Configurations;

public class TodoConfiguration : IEntityTypeConfiguration<Todo>
{
    public void Configure(EntityTypeBuilder<Todo> builder)
    {
        builder.HasKey(t => t.Id);
        
        builder.Property(t => t.Id)
            .IsRequired()
            .ValueGeneratedNever();

        builder.Property(t => t.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(t => t.Description)
            .HasMaxLength(1000);

        builder.Property(t => t.Status)
            .IsRequired()
            .HasConversion(
                v => v.ToString().ToLowerInvariant(),
                v => Enum.Parse<TodoStatus>(v, true));

        builder.Property(t => t.Priority)
            .IsRequired()
            .HasConversion(
                v => v.ToString().ToLowerInvariant(),
                v => Enum.Parse<Priority>(v, true));

        builder.Property(t => t.CreatedAt)
            .IsRequired();

        builder.Property(t => t.UpdatedAt)
            .IsRequired();

        // Indexes for better query performance
        builder.HasIndex(t => t.Status)
            .HasDatabaseName("IX_Todos_Status");

        builder.HasIndex(t => t.Priority)
            .HasDatabaseName("IX_Todos_Priority");

        builder.HasIndex(t => t.DueDate)
            .HasDatabaseName("IX_Todos_DueDate");

        builder.HasIndex(t => t.CreatedAt)
            .HasDatabaseName("IX_Todos_CreatedAt");
    }
}