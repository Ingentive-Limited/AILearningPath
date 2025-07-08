using System;
using System.ComponentModel.DataAnnotations;

namespace LegacyShop
{
    // Legacy model with minimal validation - demonstrates anti-patterns
    public class Product
    {
        public int Id { get; set; }
        
        // No validation attributes - poor practice
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public string Category { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsActive { get; set; }
        
        // No navigation properties or relationships defined
        // No business logic encapsulation
        // No validation rules
        
        // Legacy approach - public parameterless constructor only
        public Product()
        {
            CreatedDate = DateTime.Now;
            IsActive = true;
        }
        
        // Business logic mixed in model (anti-pattern)
        public bool IsLowStock()
        {
            var threshold = int.Parse(System.Configuration.ConfigurationManager.AppSettings["LowStockThreshold"] ?? "5");
            return StockQuantity <= threshold;
        }
        
        public decimal GetDiscountedPrice(decimal discountPercentage)
        {
            // No validation of discount percentage
            return Price * (1 - discountPercentage / 100);
        }
        
        public void UpdateStock(int quantity)
        {
            // No validation - can go negative
            StockQuantity += quantity;
        }
    }
}