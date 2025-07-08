namespace LegacyShop
{
    // Legacy order item model - simple but lacks validation
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        
        // Navigation properties without proper configuration
        public virtual Order Order { get; set; }
        public virtual Product Product { get; set; }
        
        // Business logic in model (anti-pattern)
        public decimal GetLineTotal()
        {
            return Quantity * UnitPrice;
        }
        
        public void UpdateQuantity(int newQuantity)
        {
            // No validation - can be negative or zero
            Quantity = newQuantity;
        }
        
        public void UpdatePrice(decimal newPrice)
        {
            // No validation
            UnitPrice = newPrice;
        }
    }
}