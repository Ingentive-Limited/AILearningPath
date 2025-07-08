using System.Data.Entity;

namespace LegacyShop
{
    // Legacy Entity Framework 6 DbContext - demonstrates old patterns
    public class LegacyShopContext : DbContext
    {
        // Constructor using connection string name from web.config
        public LegacyShopContext() : base("DefaultConnection")
        {
            // Legacy configuration - synchronous operations
            Database.SetInitializer<LegacyShopContext>(new CreateDatabaseIfNotExists<LegacyShopContext>());
            
            // Disable lazy loading (but inconsistently applied)
            Configuration.LazyLoadingEnabled = false;
            Configuration.ProxyCreationEnabled = true;
        }

        // DbSets without proper configuration
        public DbSet<Product> Products { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            // Legacy model configuration - minimal and inconsistent
            
            // Product configuration
            modelBuilder.Entity<Product>()
                .ToTable("Products")
                .HasKey(p => p.Id);
            
            modelBuilder.Entity<Product>()
                .Property(p => p.Name)
                .HasMaxLength(100); // Some validation, but not comprehensive
            
            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasPrecision(18, 2);

            // Customer configuration - minimal
            modelBuilder.Entity<Customer>()
                .ToTable("Customers")
                .HasKey(c => c.Id);
            
            // No proper email validation or constraints
            modelBuilder.Entity<Customer>()
                .Property(c => c.Email)
                .HasMaxLength(255);

            // Order configuration
            modelBuilder.Entity<Order>()
                .ToTable("Orders")
                .HasKey(o => o.Id);
            
            modelBuilder.Entity<Order>()
                .Property(o => o.TotalAmount)
                .HasPrecision(18, 2);
            
            // Foreign key relationship - basic configuration
            modelBuilder.Entity<Order>()
                .HasRequired(o => o.Customer)
                .WithMany(c => c.Orders)
                .HasForeignKey(o => o.CustomerId);

            // OrderItem configuration
            modelBuilder.Entity<OrderItem>()
                .ToTable("OrderItems")
                .HasKey(oi => oi.Id);
            
            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.UnitPrice)
                .HasPrecision(18, 2);
            
            // Relationships
            modelBuilder.Entity<OrderItem>()
                .HasRequired(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId);
            
            modelBuilder.Entity<OrderItem>()
                .HasRequired(oi => oi.Product)
                .WithMany()
                .HasForeignKey(oi => oi.ProductId);

            base.OnModelCreating(modelBuilder);
        }
        
        // No proper disposal pattern
        // No connection management
        // No retry policies
        // No performance monitoring
    }
}