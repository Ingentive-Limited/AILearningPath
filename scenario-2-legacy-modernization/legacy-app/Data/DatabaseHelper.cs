using System;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;

namespace LegacyShop
{
    // Legacy database helper - demonstrates poor data access patterns
    public static class DatabaseHelper
    {
        // Direct SQL queries - SQL injection risk
        public static void ExecuteRawSql(string sql)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
            
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception ex)
            {
                // Poor error handling - just log and swallow
                System.Diagnostics.Trace.WriteLine($"Database error: {ex.Message}");
            }
        }
        
        // Synchronous operations only
        public static int GetProductCount()
        {
            using (var context = new LegacyShopContext())
            {
                return context.Products.Count();
            }
        }
        
        public static int GetCustomerCount()
        {
            using (var context = new LegacyShopContext())
            {
                return context.Customers.Count();
            }
        }
        
        public static int GetOrderCount()
        {
            using (var context = new LegacyShopContext())
            {
                return context.Orders.Count();
            }
        }
        
        // Inefficient queries - N+1 problem
        public static decimal GetTotalRevenue()
        {
            using (var context = new LegacyShopContext())
            {
                var orders = context.Orders.ToList(); // Loads all orders into memory
                return orders.Sum(o => o.TotalAmount);
            }
        }
        
        // No caching, no optimization
        public static Product GetBestSellingProduct()
        {
            using (var context = new LegacyShopContext())
            {
                var orderItems = context.OrderItems.ToList(); // Loads everything
                var productSales = orderItems
                    .GroupBy(oi => oi.ProductId)
                    .Select(g => new { ProductId = g.Key, TotalSold = g.Sum(oi => oi.Quantity) })
                    .OrderByDescending(x => x.TotalSold)
                    .FirstOrDefault();
                
                if (productSales != null)
                {
                    return context.Products.Find(productSales.ProductId);
                }
                
                return null;
            }
        }
        
        // Direct database manipulation - bypasses EF
        public static void UpdateProductStock(int productId, int newStock)
        {
            var sql = $"UPDATE Products SET StockQuantity = {newStock} WHERE Id = {productId}";
            ExecuteRawSql(sql); // SQL injection vulnerability
        }
        
        // No transaction management
        public static void ProcessOrder(int orderId)
        {
            using (var context = new LegacyShopContext())
            {
                var order = context.Orders.Find(orderId);
                if (order != null)
                {
                    // Multiple database calls without transaction
                    order.Status = "Processing";
                    context.SaveChanges();
                    
                    // Update stock for each item
                    var orderItems = context.OrderItems.Where(oi => oi.OrderId == orderId).ToList();
                    foreach (var item in orderItems)
                    {
                        var product = context.Products.Find(item.ProductId);
                        if (product != null)
                        {
                            product.StockQuantity -= item.Quantity;
                            context.SaveChanges(); // Multiple saves - inefficient
                        }
                    }
                }
            }
        }
        
        // No connection pooling management
        // No retry logic
        // No performance monitoring
        // No proper logging
    }
}