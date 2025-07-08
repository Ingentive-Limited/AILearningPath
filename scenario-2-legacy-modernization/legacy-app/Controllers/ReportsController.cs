using System;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;

namespace LegacyShop.Controllers
{
    // Legacy reports controller with inefficient queries and business logic
    public class ReportsController : ApiController
    {
        private LegacyShopContext db = new LegacyShopContext();

        // GET api/reports/sales
        [HttpGet]
        [Route("api/reports/sales")]
        public IHttpActionResult GetSalesReport()
        {
            try
            {
                // Inefficient - loads all orders into memory
                var allOrders = db.Orders.Include(o => o.OrderItems.Select(oi => oi.Product)).ToList();
                
                var report = new
                {
                    TotalSales = allOrders.Sum(o => o.TotalAmount),
                    TotalOrders = allOrders.Count,
                    AverageOrderValue = allOrders.Any() ? allOrders.Average(o => o.TotalAmount) : 0,
                    
                    // Complex calculations in controller
                    SalesByStatus = allOrders
                        .GroupBy(o => o.Status)
                        .Select(g => new { Status = g.Key, Count = g.Count(), Revenue = g.Sum(o => o.TotalAmount) })
                        .ToList(),
                    
                    // Inefficient product analysis
                    TopSellingProducts = allOrders
                        .SelectMany(o => o.OrderItems)
                        .GroupBy(oi => new { oi.ProductId, oi.Product.Name })
                        .Select(g => new 
                        { 
                            ProductId = g.Key.ProductId,
                            ProductName = g.Key.Name,
                            TotalQuantitySold = g.Sum(oi => oi.Quantity),
                            TotalRevenue = g.Sum(oi => oi.Quantity * oi.UnitPrice)
                        })
                        .OrderByDescending(x => x.TotalQuantitySold)
                        .Take(10)
                        .ToList(),
                    
                    // Date-based analysis - no proper date handling
                    SalesThisMonth = allOrders
                        .Where(o => o.OrderDate.Month == DateTime.Now.Month && o.OrderDate.Year == DateTime.Now.Year)
                        .Sum(o => o.TotalAmount),
                    
                    SalesLastMonth = allOrders
                        .Where(o => o.OrderDate.Month == DateTime.Now.AddMonths(-1).Month && 
                                   o.OrderDate.Year == DateTime.Now.AddMonths(-1).Year)
                        .Sum(o => o.TotalAmount)
                };

                return Ok(report);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error generating sales report: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // GET api/reports/inventory
        [HttpGet]
        [Route("api/reports/inventory")]
        public IHttpActionResult GetInventoryReport()
        {
            try
            {
                // Load all products - no filtering
                var allProducts = db.Products.ToList();
                var lowStockThreshold = int.Parse(System.Configuration.ConfigurationManager.AppSettings["LowStockThreshold"] ?? "5");

                var report = new
                {
                    TotalProducts = allProducts.Count,
                    ActiveProducts = allProducts.Count(p => p.IsActive),
                    InactiveProducts = allProducts.Count(p => !p.IsActive),
                    
                    LowStockProducts = allProducts
                        .Where(p => p.IsActive && p.StockQuantity <= lowStockThreshold)
                        .Select(p => new { p.Id, p.Name, p.StockQuantity, p.Category })
                        .ToList(),
                    
                    OutOfStockProducts = allProducts
                        .Where(p => p.IsActive && p.StockQuantity == 0)
                        .Select(p => new { p.Id, p.Name, p.Category })
                        .ToList(),
                    
                    // Category analysis
                    ProductsByCategory = allProducts
                        .Where(p => p.IsActive)
                        .GroupBy(p => p.Category)
                        .Select(g => new 
                        { 
                            Category = g.Key, 
                            Count = g.Count(), 
                            TotalValue = g.Sum(p => p.Price * p.StockQuantity),
                            AveragePrice = g.Average(p => p.Price)
                        })
                        .ToList(),
                    
                    TotalInventoryValue = allProducts
                        .Where(p => p.IsActive)
                        .Sum(p => p.Price * p.StockQuantity)
                };

                return Ok(report);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error generating inventory report: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // GET api/reports/customers
        [HttpGet]
        [Route("api/reports/customers")]
        public IHttpActionResult GetCustomerReport()
        {
            try
            {
                // Multiple inefficient queries
                var allCustomers = db.Customers.ToList();
                var allOrders = db.Orders.ToList();

                var report = new
                {
                    TotalCustomers = allCustomers.Count,
                    
                    // N+1 query problem - calculating for each customer
                    TopCustomers = allCustomers
                        .Select(c => new
                        {
                            Customer = c,
                            OrderCount = allOrders.Count(o => o.CustomerId == c.Id),
                            TotalSpent = allOrders.Where(o => o.CustomerId == c.Id).Sum(o => o.TotalAmount)
                        })
                        .Where(x => x.OrderCount > 0)
                        .OrderByDescending(x => x.TotalSpent)
                        .Take(10)
                        .ToList(),
                    
                    CustomersWithOrders = allOrders.Select(o => o.CustomerId).Distinct().Count(),
                    CustomersWithoutOrders = allCustomers.Count - allOrders.Select(o => o.CustomerId).Distinct().Count(),
                    
                    // Date calculations without proper timezone handling
                    NewCustomersThisMonth = allCustomers.Count(c => 
                        c.RegisteredDate.Month == DateTime.Now.Month && 
                        c.RegisteredDate.Year == DateTime.Now.Year),
                    
                    NewCustomersLastMonth = allCustomers.Count(c => 
                        c.RegisteredDate.Month == DateTime.Now.AddMonths(-1).Month && 
                        c.RegisteredDate.Year == DateTime.Now.AddMonths(-1).Year),
                    
                    AverageOrdersPerCustomer = allOrders.Any() ? 
                        (double)allOrders.Count / allOrders.Select(o => o.CustomerId).Distinct().Count() : 0,
                    
                    AverageSpendPerCustomer = allOrders.Any() ? 
                        allOrders.GroupBy(o => o.CustomerId).Average(g => g.Sum(o => o.TotalAmount)) : 0
                };

                return Ok(report);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error generating customer report: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // GET api/reports/performance
        [HttpGet]
        [Route("api/reports/performance")]
        public IHttpActionResult GetPerformanceReport()
        {
            try
            {
                // Very inefficient - multiple database calls
                var totalProducts = DatabaseHelper.GetProductCount();
                var totalCustomers = DatabaseHelper.GetCustomerCount();
                var totalOrders = DatabaseHelper.GetOrderCount();
                var totalRevenue = DatabaseHelper.GetTotalRevenue();
                var bestSellingProduct = DatabaseHelper.GetBestSellingProduct();

                // Manual date calculations
                var today = DateTime.Today;
                var thisWeekStart = today.AddDays(-(int)today.DayOfWeek);
                var thisMonthStart = new DateTime(today.Year, today.Month, 1);

                // More inefficient queries
                var ordersToday = db.Orders.Count(o => o.OrderDate.Date == today);
                var ordersThisWeek = db.Orders.Count(o => o.OrderDate >= thisWeekStart);
                var ordersThisMonth = db.Orders.Count(o => o.OrderDate >= thisMonthStart);

                var revenueToday = db.Orders.Where(o => o.OrderDate.Date == today).Sum(o => (decimal?)o.TotalAmount) ?? 0;
                var revenueThisWeek = db.Orders.Where(o => o.OrderDate >= thisWeekStart).Sum(o => (decimal?)o.TotalAmount) ?? 0;
                var revenueThisMonth = db.Orders.Where(o => o.OrderDate >= thisMonthStart).Sum(o => (decimal?)o.TotalAmount) ?? 0;

                var report = new
                {
                    Overview = new
                    {
                        TotalProducts = totalProducts,
                        TotalCustomers = totalCustomers,
                        TotalOrders = totalOrders,
                        TotalRevenue = totalRevenue,
                        BestSellingProduct = bestSellingProduct?.Name ?? "N/A"
                    },
                    
                    DailyMetrics = new
                    {
                        OrdersToday = ordersToday,
                        RevenueToday = revenueToday
                    },
                    
                    WeeklyMetrics = new
                    {
                        OrdersThisWeek = ordersThisWeek,
                        RevenueThisWeek = revenueThisWeek
                    },
                    
                    MonthlyMetrics = new
                    {
                        OrdersThisMonth = ordersThisMonth,
                        RevenueThisMonth = revenueThisMonth
                    }
                };

                return Ok(report);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error generating performance report: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db?.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}