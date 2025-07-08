// Legacy E-commerce Application - .NET Framework 4.8 Style
// This represents typical legacy patterns that need modernization

using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;
using System.ComponentModel.DataAnnotations;

namespace LegacyShop
{
    // Legacy Entity Framework 6 DbContext
    public class ShopDbContext : DbContext
    {
        public ShopDbContext() : base("DefaultConnection")
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            // Old-style configuration
            modelBuilder.Entity<Product>().ToTable("Products");
            modelBuilder.Entity<Order>().ToTable("Orders");
            modelBuilder.Entity<Customer>().ToTable("Customers");
            modelBuilder.Entity<OrderItem>().ToTable("OrderItems");
        }
    }

    // Legacy Models with minimal validation
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public string Category { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsActive { get; set; }
    }

    public class Customer
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public DateTime RegisteredDate { get; set; }
    }

    public class Order
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        public string ShippingAddress { get; set; }
        
        public virtual Customer Customer { get; set; }
        public virtual List<OrderItem> OrderItems { get; set; }
    }

    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        
        public virtual Order Order { get; set; }
        public virtual Product Product { get; set; }
    }

    // Legacy Controller with anti-patterns
    public class ProductController : Controller
    {
        private ShopDbContext db = new ShopDbContext();

        // Synchronous operations, direct DB access in controller
        public ActionResult Index()
        {
            var products = db.Products.Where(p => p.IsActive).ToList();
            return View(products);
        }

        public ActionResult Details(int id)
        {
            var product = db.Products.Find(id);
            if (product == null)
            {
                return HttpNotFound();
            }
            return View(product);
        }

        [HttpPost]
        public ActionResult Create(Product product)
        {
            // Minimal validation, no error handling
            if (ModelState.IsValid)
            {
                product.CreatedDate = DateTime.Now;
                product.IsActive = true;
                db.Products.Add(product);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(product);
        }

        [HttpPost]
        public ActionResult Edit(Product product)
        {
            if (ModelState.IsValid)
            {
                db.Entry(product).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(product);
        }

        public ActionResult Delete(int id)
        {
            var product = db.Products.Find(id);
            if (product != null)
            {
                db.Products.Remove(product);
                db.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        // No proper disposal
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }

    // Legacy Order Controller with business logic mixed in
    public class OrderController : Controller
    {
        private ShopDbContext db = new ShopDbContext();

        public ActionResult Index()
        {
            var orders = db.Orders.Include(o => o.Customer).ToList();
            return View(orders);
        }

        [HttpPost]
        public ActionResult Create(int customerId, List<int> productIds, List<int> quantities)
        {
            try
            {
                var customer = db.Customers.Find(customerId);
                if (customer == null)
                {
                    return HttpNotFound("Customer not found");
                }

                var order = new Order
                {
                    CustomerId = customerId,
                    OrderDate = DateTime.Now,
                    Status = "Pending",
                    ShippingAddress = customer.Address,
                    OrderItems = new List<OrderItem>()
                };

                decimal totalAmount = 0;

                // Business logic mixed with data access
                for (int i = 0; i < productIds.Count; i++)
                {
                    var product = db.Products.Find(productIds[i]);
                    if (product != null && product.StockQuantity >= quantities[i])
                    {
                        var orderItem = new OrderItem
                        {
                            ProductId = productIds[i],
                            Quantity = quantities[i],
                            UnitPrice = product.Price
                        };

                        order.OrderItems.Add(orderItem);
                        totalAmount += product.Price * quantities[i];

                        // Update stock synchronously
                        product.StockQuantity -= quantities[i];
                    }
                }

                order.TotalAmount = totalAmount;
                db.Orders.Add(order);
                db.SaveChanges();

                return RedirectToAction("Details", new { id = order.Id });
            }
            catch (Exception ex)
            {
                // Poor error handling
                ViewBag.Error = "An error occurred: " + ex.Message;
                return View();
            }
        }

        public ActionResult Details(int id)
        {
            var order = db.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderItems.Select(oi => oi.Product))
                .FirstOrDefault(o => o.Id == id);

            if (order == null)
            {
                return HttpNotFound();
            }

            return View(order);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }

    // Legacy Customer Controller
    public class CustomerController : Controller
    {
        private ShopDbContext db = new ShopDbContext();

        public ActionResult Index()
        {
            return View(db.Customers.ToList());
        }

        public ActionResult Details(int id)
        {
            var customer = db.Customers.Find(id);
            if (customer == null)
            {
                return HttpNotFound();
            }

            // N+1 query problem
            var customerOrders = db.Orders.Where(o => o.CustomerId == id).ToList();
            ViewBag.Orders = customerOrders;

            return View(customer);
        }

        [HttpPost]
        public ActionResult Register(Customer customer)
        {
            // No validation, no duplicate checking
            customer.RegisteredDate = DateTime.Now;
            db.Customers.Add(customer);
            db.SaveChanges();

            return RedirectToAction("Details", new { id = customer.Id });
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }

    // Legacy reporting with inefficient queries
    public class ReportController : Controller
    {
        private ShopDbContext db = new ShopDbContext();

        public ActionResult SalesReport()
        {
            // Inefficient query - loads all data into memory
            var allOrders = db.Orders.Include(o => o.OrderItems).ToList();
            
            var report = new
            {
                TotalSales = allOrders.Sum(o => o.TotalAmount),
                TotalOrders = allOrders.Count,
                AverageOrderValue = allOrders.Average(o => o.TotalAmount),
                TopProducts = allOrders
                    .SelectMany(o => o.OrderItems)
                    .GroupBy(oi => oi.ProductId)
                    .Select(g => new { ProductId = g.Key, TotalSold = g.Sum(oi => oi.Quantity) })
                    .OrderByDescending(x => x.TotalSold)
                    .Take(10)
                    .ToList()
            };

            return View(report);
        }

        public ActionResult CustomerReport()
        {
            // Another inefficient query
            var customers = db.Customers.ToList();
            var customerData = customers.Select(c => new
            {
                Customer = c,
                OrderCount = db.Orders.Count(o => o.CustomerId == c.Id),
                TotalSpent = db.Orders.Where(o => o.CustomerId == c.Id).Sum(o => o.TotalAmount)
            }).ToList();

            return View(customerData);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}