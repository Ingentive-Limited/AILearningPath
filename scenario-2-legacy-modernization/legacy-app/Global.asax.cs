using System;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Linq;

namespace LegacyShop
{
    // Legacy Global.asax.cs - demonstrates old application startup patterns
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            // Old-style application initialization - no dependency injection
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            
            // Initialize database synchronously (poor practice)
            InitializeDatabase();
            
            // Basic logging setup
            SetupLogging();
        }

        private void InitializeDatabase()
        {
            try
            {
                // Direct database initialization in Global.asax (anti-pattern)
                using (var context = new LegacyShopContext())
                {
                    // Force database creation - blocking operation
                    context.Database.CreateIfNotExists();
                    
                    // Seed data if empty
                    if (!context.Products.Any())
                    {
                        SeedInitialData(context);
                    }
                }
            }
            catch (Exception ex)
            {
                // Poor error handling - just log and continue
                System.Diagnostics.Trace.WriteLine("Database initialization failed: " + ex.Message);
            }
        }

        private void SeedInitialData(LegacyShopContext context)
        {
            // Hardcoded seed data - no configuration
            var products = new[]
            {
                new Product 
                { 
                    Name = "Gaming Laptop", 
                    Description = "High-performance gaming laptop with RTX graphics", 
                    Price = 1599.99m, 
                    StockQuantity = 15, 
                    Category = "Electronics", 
                    CreatedDate = DateTime.Now, 
                    IsActive = true 
                },
                new Product 
                { 
                    Name = "Wireless Mouse", 
                    Description = "Ergonomic wireless mouse with RGB lighting", 
                    Price = 49.99m, 
                    StockQuantity = 100, 
                    Category = "Accessories", 
                    CreatedDate = DateTime.Now, 
                    IsActive = true 
                },
                new Product 
                { 
                    Name = "Mechanical Keyboard", 
                    Description = "Cherry MX Blue mechanical keyboard", 
                    Price = 129.99m, 
                    StockQuantity = 50, 
                    Category = "Accessories", 
                    CreatedDate = DateTime.Now, 
                    IsActive = true 
                },
                new Product 
                { 
                    Name = "4K Monitor", 
                    Description = "27-inch 4K IPS monitor with HDR support", 
                    Price = 449.99m, 
                    StockQuantity = 25, 
                    Category = "Monitors", 
                    CreatedDate = DateTime.Now, 
                    IsActive = true 
                },
                new Product 
                { 
                    Name = "USB-C Hub", 
                    Description = "Multi-port USB-C hub with HDMI and Ethernet", 
                    Price = 79.99m, 
                    StockQuantity = 75, 
                    Category = "Accessories", 
                    CreatedDate = DateTime.Now, 
                    IsActive = true 
                }
            };

            context.Products.AddRange(products);

            var customers = new[]
            {
                new Customer 
                { 
                    FirstName = "John", 
                    LastName = "Smith", 
                    Email = "john.smith@email.com", 
                    Phone = "555-0101", 
                    Address = "123 Main Street, Anytown, ST 12345", 
                    RegisteredDate = DateTime.Now.AddDays(-45) 
                },
                new Customer 
                { 
                    FirstName = "Sarah", 
                    LastName = "Johnson", 
                    Email = "sarah.johnson@email.com", 
                    Phone = "555-0102", 
                    Address = "456 Oak Avenue, Somewhere, ST 67890", 
                    RegisteredDate = DateTime.Now.AddDays(-30) 
                },
                new Customer 
                { 
                    FirstName = "Mike", 
                    LastName = "Davis", 
                    Email = "mike.davis@email.com", 
                    Phone = "555-0103", 
                    Address = "789 Pine Road, Elsewhere, ST 54321", 
                    RegisteredDate = DateTime.Now.AddDays(-15) 
                }
            };

            context.Customers.AddRange(customers);
            
            // Synchronous save - blocking operation
            context.SaveChanges();
        }

        private void SetupLogging()
        {
            // Basic trace logging setup
            var enableDetailedErrors = System.Configuration.ConfigurationManager.AppSettings["EnableDetailedErrors"];
            if (bool.TryParse(enableDetailedErrors, out bool isEnabled) && isEnabled)
            {
                System.Diagnostics.Trace.WriteLine($"LegacyShop application started at: {DateTime.Now}");
            }
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            // Poor global error handling
            Exception exception = Server.GetLastError();
            if (exception != null)
            {
                // Just log to trace - no structured logging
                System.Diagnostics.Trace.WriteLine($"Unhandled exception: {exception}");
                
                // Clear error and continue
                Server.ClearError();
                
                // Simple redirect - loses error context
                Response.Redirect("~/Error");
            }
        }

        protected void Session_Start(object sender, EventArgs e)
        {
            // Initialize session state - old approach
            Session["CartItems"] = new System.Collections.Generic.List<int>();
            Session["UserId"] = null;
            Session["LastActivity"] = DateTime.Now;
        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            // Log every request - inefficient
            var enableDetailedErrors = System.Configuration.ConfigurationManager.AppSettings["EnableDetailedErrors"];
            if (bool.TryParse(enableDetailedErrors, out bool isEnabled) && isEnabled)
            {
                System.Diagnostics.Trace.WriteLine($"Request: {Request.HttpMethod} {Request.Url}");
            }
        }

        protected void Application_EndRequest(object sender, EventArgs e)
        {
            // Log response status - inefficient
            var enableDetailedErrors = System.Configuration.ConfigurationManager.AppSettings["EnableDetailedErrors"];
            if (bool.TryParse(enableDetailedErrors, out bool isEnabled) && isEnabled)
            {
                System.Diagnostics.Trace.WriteLine($"Response: {Response.StatusCode} for {Request.Url}");
            }
        }

        protected void Session_End(object sender, EventArgs e)
        {
            // Session cleanup
            Session.Clear();
        }

        protected void Application_End(object sender, EventArgs e)
        {
            // Application shutdown logging
            System.Diagnostics.Trace.WriteLine($"LegacyShop application ended at: {DateTime.Now}");
        }
    }

    // Legacy configuration classes - should be in separate files
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            // Default MVC route
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }

    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            // Basic error handling filter
            filters.Add(new HandleErrorAttribute());
        }
    }

    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            // Basic bundling configuration
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));
        }
    }
}