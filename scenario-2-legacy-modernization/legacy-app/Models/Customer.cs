using System;
using System.Collections.Generic;

namespace LegacyShop
{
    // Legacy customer model - demonstrates poor design patterns
    public class Customer
    {
        public int Id { get; set; }
        
        // No validation or constraints
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public DateTime RegisteredDate { get; set; }
        
        // No navigation properties properly configured
        public virtual List<Order> Orders { get; set; }
        
        public Customer()
        {
            RegisteredDate = DateTime.Now;
            Orders = new List<Order>();
        }
        
        // Business logic in model (anti-pattern)
        public string GetFullName()
        {
            return $"{FirstName} {LastName}";
        }
        
        public bool IsValidEmail()
        {
            // Primitive email validation
            return !string.IsNullOrEmpty(Email) && Email.Contains("@");
        }
        
        public decimal GetTotalSpent()
        {
            // N+1 query problem - should be calculated in service layer
            decimal total = 0;
            if (Orders != null)
            {
                foreach (var order in Orders)
                {
                    total += order.TotalAmount;
                }
            }
            return total;
        }
        
        public int GetOrderCount()
        {
            return Orders?.Count ?? 0;
        }
        
        // No proper encapsulation
        public void UpdateContactInfo(string email, string phone, string address)
        {
            // No validation
            Email = email;
            Phone = phone;
            Address = address;
        }
    }
}