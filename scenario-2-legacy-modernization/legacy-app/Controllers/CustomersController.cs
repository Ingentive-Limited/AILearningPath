using System;
using System.Linq;
using System.Web.Http;

namespace LegacyShop.Controllers
{
    // Legacy customers controller with poor patterns
    public class CustomersController : ApiController
    {
        // Direct database access - no dependency injection
        private LegacyShopContext db = new LegacyShopContext();

        // GET api/customers
        public IHttpActionResult Get()
        {
            try
            {
                // No pagination - loads all customers
                var customers = db.Customers.ToList();
                return Ok(customers);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error getting customers: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // GET api/customers/5
        public IHttpActionResult Get(int id)
        {
            try
            {
                var customer = db.Customers.Find(id);
                if (customer == null)
                {
                    return NotFound();
                }

                // N+1 query problem - loads orders separately
                var customerOrders = db.Orders.Where(o => o.CustomerId == id).ToList();
                
                // Manually building response object (should use DTOs)
                var response = new
                {
                    Customer = customer,
                    Orders = customerOrders,
                    TotalOrders = customerOrders.Count,
                    TotalSpent = customerOrders.Sum(o => o.TotalAmount)
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error getting customer: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // POST api/customers
        public IHttpActionResult Post([FromBody]Customer customer)
        {
            try
            {
                // Minimal validation
                if (customer == null)
                {
                    return BadRequest("Customer data is required");
                }

                if (string.IsNullOrEmpty(customer.FirstName) || string.IsNullOrEmpty(customer.LastName))
                {
                    return BadRequest("First name and last name are required");
                }

                if (string.IsNullOrEmpty(customer.Email))
                {
                    return BadRequest("Email is required");
                }

                // Basic email validation (primitive)
                if (!customer.Email.Contains("@"))
                {
                    return BadRequest("Invalid email format");
                }

                // Check for duplicate email - inefficient query
                var existingCustomer = db.Customers.FirstOrDefault(c => c.Email == customer.Email);
                if (existingCustomer != null)
                {
                    return BadRequest("Customer with this email already exists");
                }

                // Business logic in controller
                customer.RegisteredDate = DateTime.Now;

                db.Customers.Add(customer);
                db.SaveChanges(); // Synchronous save

                return Created($"api/customers/{customer.Id}", customer);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error creating customer: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // PUT api/customers/5
        public IHttpActionResult Put(int id, [FromBody]Customer customer)
        {
            try
            {
                if (customer == null || id != customer.Id)
                {
                    return BadRequest("Invalid customer data");
                }

                var existingCustomer = db.Customers.Find(id);
                if (existingCustomer == null)
                {
                    return NotFound();
                }

                // Check for duplicate email (excluding current customer)
                var duplicateEmail = db.Customers.FirstOrDefault(c => c.Email == customer.Email && c.Id != id);
                if (duplicateEmail != null)
                {
                    return BadRequest("Another customer with this email already exists");
                }

                // Manual property mapping
                existingCustomer.FirstName = customer.FirstName;
                existingCustomer.LastName = customer.LastName;
                existingCustomer.Email = customer.Email;
                existingCustomer.Phone = customer.Phone;
                existingCustomer.Address = customer.Address;

                db.SaveChanges();

                return Ok(existingCustomer);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error updating customer: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // DELETE api/customers/5
        public IHttpActionResult Delete(int id)
        {
            try
            {
                var customer = db.Customers.Find(id);
                if (customer == null)
                {
                    return NotFound();
                }

                // Check if customer has orders - business logic in controller
                var hasOrders = db.Orders.Any(o => o.CustomerId == id);
                if (hasOrders)
                {
                    return BadRequest("Cannot delete customer with existing orders");
                }

                db.Customers.Remove(customer);
                db.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error deleting customer: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // GET api/customers/search?email=john@email.com
        [HttpGet]
        [Route("api/customers/search")]
        public IHttpActionResult SearchByEmail(string email)
        {
            try
            {
                if (string.IsNullOrEmpty(email))
                {
                    return BadRequest("Email parameter is required");
                }

                var customer = db.Customers.FirstOrDefault(c => c.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
                if (customer == null)
                {
                    return NotFound();
                }

                return Ok(customer);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error searching customer by email: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // GET api/customers/stats
        [HttpGet]
        [Route("api/customers/stats")]
        public IHttpActionResult GetCustomerStats()
        {
            try
            {
                // Inefficient queries - loads all data into memory
                var allCustomers = db.Customers.ToList();
                var allOrders = db.Orders.ToList();

                var stats = new
                {
                    TotalCustomers = allCustomers.Count,
                    CustomersWithOrders = allOrders.Select(o => o.CustomerId).Distinct().Count(),
                    CustomersWithoutOrders = allCustomers.Count - allOrders.Select(o => o.CustomerId).Distinct().Count(),
                    AverageOrdersPerCustomer = allOrders.Count > 0 ? (double)allOrders.Count / allOrders.Select(o => o.CustomerId).Distinct().Count() : 0,
                    NewCustomersThisMonth = allCustomers.Count(c => c.RegisteredDate >= DateTime.Now.AddMonths(-1))
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error getting customer stats: {ex.Message}");
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