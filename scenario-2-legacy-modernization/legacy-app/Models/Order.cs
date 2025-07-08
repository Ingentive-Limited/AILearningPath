using System;
using System.Collections.Generic;
using System.Linq;

namespace LegacyShop
{
    // Legacy order model with poor design patterns
    public class Order
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } // Should be enum
        public string ShippingAddress { get; set; }
        
        // Navigation properties without proper configuration
        public virtual Customer Customer { get; set; }
        public virtual List<OrderItem> OrderItems { get; set; }
        
        public Order()
        {
            OrderDate = DateTime.Now;
            Status = "Pending";
            OrderItems = new List<OrderItem>();
        }
        
        // Business logic mixed in model (anti-pattern)
        public void AddItem(int productId, int quantity, decimal unitPrice)
        {
            // No validation
            var item = new OrderItem
            {
                OrderId = this.Id,
                ProductId = productId,
                Quantity = quantity,
                UnitPrice = unitPrice
            };
            OrderItems.Add(item);
            
            // Recalculate total - should be done in service layer
            RecalculateTotal();
        }
        
        public void RemoveItem(int productId)
        {
            var item = OrderItems.FirstOrDefault(oi => oi.ProductId == productId);
            if (item != null)
            {
                OrderItems.Remove(item);
                RecalculateTotal();
            }
        }
        
        public void RecalculateTotal()
        {
            // Business logic in model
            TotalAmount = OrderItems.Sum(oi => oi.Quantity * oi.UnitPrice);
        }
        
        public bool CanBeCancelled()
        {
            // Hardcoded business rules
            return Status == "Pending" || Status == "Processing";
        }
        
        public void UpdateStatus(string newStatus)
        {
            // No validation of status transitions
            Status = newStatus;
        }
        
        public int GetTotalItemCount()
        {
            return OrderItems.Sum(oi => oi.Quantity);
        }
        
        public bool IsLargeOrder()
        {
            // Magic number - should be configurable
            return GetTotalItemCount() > 10 || TotalAmount > 500;
        }
    }
}