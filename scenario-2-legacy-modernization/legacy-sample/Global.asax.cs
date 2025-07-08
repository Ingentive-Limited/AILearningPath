using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace LegacyShop
{
    // Legacy Global.asax.cs file representing old application startup patterns
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            // Old-style application initialization
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            
            // Initialize database (poor practice)
            InitializeDatabase();
            
            // Set up logging (basic implementation)
            SetupLogging();
        }

        private void InitializeDatabase()
        {
            try
            {
                using (var context = new ShopDbContext())
                {
                    // Force database creation if it doesn't exist
                    context.Database.CreateIfNotExists();
                    
                    // Seed data if tables are empty
                    if (!context.Products.Any())
                    {
                        SeedData(context);
                    }
                }
            }
            catch (Exception ex)
            {
                // Poor error handling
                System.Diagnostics.Trace.WriteLine("Database initialization failed: " + ex.Message);
            }
        }

        private void SeedData(ShopDbContext context)
        {
            // Hardcoded seed data
            var products = new[]
            {
                new Product { Name = "Laptop", Description = "Gaming laptop", Price = 1299.99m, StockQuantity = 10, Category = "Electronics", CreatedDate = DateTime.Now, IsActive = true },
                new Product { Name = "Mouse", Description = "Wireless mouse", Price = 29.99m, StockQuantity = 50, Category = "Electronics", CreatedDate = DateTime.Now, IsActive = true },
                new Product { Name = "Keyboard", Description = "Mechanical keyboard", Price = 89.99m, StockQuantity = 25, Category = "Electronics", CreatedDate = DateTime.Now, IsActive = true },
                new Product { Name = "Monitor", Description = "4K monitor", Price = 399.99m, StockQuantity = 15, Category = "Electronics", CreatedDate = DateTime.Now, IsActive = true },
                new Product { Name = "Headphones", Description = "Noise-cancelling headphones", Price = 199.99m, StockQuantity = 30, Category = "Electronics", CreatedDate = DateTime.Now, IsActive = true }
            };

            context.Products.AddRange(products);

            var customers = new[]
            {
                new Customer { FirstName = "John", LastName = "Doe", Email = "john.doe@email.com", Phone = "555-0101", Address = "123 Main St, City, State", RegisteredDate = DateTime.Now.AddDays(-30) },
                new Customer { FirstName = "Jane", LastName = "Smith", Email = "jane.smith@email.com", Phone = "555-0102", Address = "456 Oak Ave, City, State", RegisteredDate = DateTime.Now.AddDays(-25) },
                new Customer { FirstName = "Bob", LastName = "Johnson", Email = "bob.johnson@email.com", Phone = "555-0103", Address = "789 Pine Rd, City, State", RegisteredDate = DateTime.Now.AddDays(-20) }
            };

            context.Customers.AddRange(customers);
            context.SaveChanges();
        }

        private void SetupLogging()
        {
            // Basic logging setup
            var enableLogging = System.Configuration.ConfigurationManager.AppSettings["EnableLogging"];
            if (bool.TryParse(enableLogging, out bool isEnabled) && isEnabled)
            {
                // Simple trace logging
                System.Diagnostics.Trace.WriteLine("Application started at: " + DateTime.Now);
            }
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            // Poor error handling
            Exception exception = Server.GetLastError();
            if (exception != null)
            {
                // Log to trace (not ideal)
                System.Diagnostics.Trace.WriteLine("Application Error: " + exception.ToString());
                
                // Clear the error
                Server.ClearError();
                
                // Redirect to error page
                Response.Redirect("~/Error");
            }
        }

        protected void Session_Start(object sender, EventArgs e)
        {
            // Initialize session variables
            Session["CartItems"] = new List<int>();
            Session["UserId"] = null;
        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            // Log all requests (inefficient)
            var logLevel = System.Configuration.ConfigurationManager.AppSettings["LogLevel"];
            if (logLevel == "Debug")
            {
                System.Diagnostics.Trace.WriteLine($"Request: {Request.HttpMethod} {Request.Url}");
            }
        }

        protected void Application_EndRequest(object sender, EventArgs e)
        {
            // Log response status (inefficient)
            var logLevel = System.Configuration.ConfigurationManager.AppSettings["LogLevel"];
            if (logLevel == "Debug")
            {
                System.Diagnostics.Trace.WriteLine($"Response: {Response.StatusCode}");
            }
        }

        protected void Session_End(object sender, EventArgs e)
        {
            // Session cleanup
            Session.Clear();
        }

        protected void Application_End(object sender, EventArgs e)
        {
            // Application shutdown
            System.Diagnostics.Trace.WriteLine("Application ended at: " + DateTime.Now);
        }
    }

    // Legacy configuration classes
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

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
            filters.Add(new HandleErrorAttribute());
        }
    }

    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));
        }
    }
}