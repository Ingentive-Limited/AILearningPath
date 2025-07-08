using System;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;

namespace LegacyShop.Controllers
{
    // Legacy orders controller with complex business logic mixed in
    public class OrdersController : ApiController
    {
        private LegacyShopContext db = new LegacyShopContext();

        // GET api/orders
        public IHttpActionResult Get()
        {
            try
            {
                // No pagination - loads all orders with related data
                var orders = db.Orders
                    .Include(o => o.Customer)
                    .Include(o => o.OrderItems.Select(oi => oi.Product))
                    .ToList();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error getting orders: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // GET api/orders/5
        public IHttpActionResult Get(int id)
        {
            try
            {
                var order = db.Orders
                    .Include(o => o.Customer)
                    .Include(o => o.OrderItems.Select(oi => oi.Product))
                    .FirstOrDefault(o => o.Id == id);

                if (order == null)
                {
                    return NotFound();
                }

                return Ok(order);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error getting order: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // POST api/orders - Complex order creation with business logic
        public IHttpActionResult Post([FromBody]CreateOrderRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest("Order data is required");
                }

                if (request.CustomerId <= 0)
                {
                    return BadRequest("Valid customer ID is required");
                }

                if (request.Items == null || !request.Items.Any())
                {
                    return BadRequest("Order must contain at least one item");
                }

                // Verify customer exists
                var customer = db.Customers.Find(request.CustomerId);
                if (customer == null)
                {
                    return BadRequest("Customer not found");
                }

                // Business logic mixed in controller - order creation
                var order = new Order
                {
                    CustomerId = request.CustomerId,
                    OrderDate = DateTime.Now,
                    Status = "Pending",
                    ShippingAddress = request.ShippingAddress ?? customer.Address
                };

                decimal totalAmount = 0;

                // Process each order item - complex business logic
                foreach (var itemRequest in request.Items)
                {
                    var product = db.Products.Find(itemRequest.ProductId);
                    if (product == null)
                    {
                        return BadRequest($"Product with ID {itemRequest.ProductId} not found");
                    }

                    if (!product.IsActive)
                    {
                        return BadRequest($"Product '{product.Name}' is not available");
                    }

                    if (product.StockQuantity < itemRequest.Quantity)
                    {
                        return BadRequest($"Insufficient stock for product '{product.Name}'. Available: {product.StockQuantity}, Requested: {itemRequest.Quantity}");
                    }

                    var orderItem = new OrderItem
                    {
                        ProductId = itemRequest.ProductId,
                        Quantity = itemRequest.Quantity,
                        UnitPrice = product.Price // Use current price
                    };

                    order.OrderItems.Add(orderItem);
                    totalAmount += orderItem.Quantity * orderItem.UnitPrice;

                    // Update stock immediately - no transaction management
                    product.StockQuantity -= itemRequest.Quantity;
                }

                order.TotalAmount = totalAmount;

                // Check order limits - business rules in controller
                var maxItems = int.Parse(System.Configuration.ConfigurationManager.AppSettings["MaxOrderItems"] ?? "100");
                if (order.OrderItems.Sum(oi => oi.Quantity) > maxItems)
                {
                    return BadRequest($"Order exceeds maximum item limit of {maxItems}");
                }

                db.Orders.Add(order);
                db.SaveChanges(); // Single save for everything - no proper transaction

                return Created($"api/orders/{order.Id}", order);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error creating order: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // PUT api/orders/5/status
        [HttpPut]
        [Route("api/orders/{id}/status")]
        public IHttpActionResult UpdateStatus(int id, [FromBody]UpdateStatusRequest request)
        {
            try
            {
                if (request == null || string.IsNullOrEmpty(request.Status))
                {
                    return BadRequest("Status is required");
                }

                var order = db.Orders.Find(id);
                if (order == null)
                {
                    return NotFound();
                }

                // Business logic for status transitions - hardcoded rules
                var validStatuses = new[] { "Pending", "Processing", "Shipped", "Delivered", "Cancelled" };
                if (!validStatuses.Contains(request.Status))
                {
                    return BadRequest("Invalid status");
                }

                // Status transition validation - complex business rules
                if (order.Status == "Delivered" || order.Status == "Cancelled")
                {
                    return BadRequest("Cannot change status of completed orders");
                }

                if (order.Status == "Shipped" && request.Status == "Pending")
                {
                    return BadRequest("Cannot revert shipped order to pending");
                }

                // Handle cancellation - restore stock
                if (request.Status == "Cancelled" && order.Status != "Cancelled")
                {
                    var orderItems = db.OrderItems.Where(oi => oi.OrderId == id).Include(oi => oi.Product).ToList();
                    foreach (var item in orderItems)
                    {
                        item.Product.StockQuantity += item.Quantity; // Restore stock
                    }
                }

                order.Status = request.Status;
                db.SaveChanges();

                return Ok(order);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error updating order status: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // GET api/orders/customer/5
        [HttpGet]
        [Route("api/orders/customer/{customerId}")]
        public IHttpActionResult GetByCustomer(int customerId)
        {
            try
            {
                var orders = db.Orders
                    .Where(o => o.CustomerId == customerId)
                    .Include(o => o.OrderItems.Select(oi => oi.Product))
                    .OrderByDescending(o => o.OrderDate)
                    .ToList();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error getting customer orders: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // GET api/orders/stats
        [HttpGet]
        [Route("api/orders/stats")]
        public IHttpActionResult GetOrderStats()
        {
            try
            {
                // Inefficient queries - loads all data
                var allOrders = db.Orders.ToList();
                var today = DateTime.Today;

                var stats = new
                {
                    TotalOrders = allOrders.Count,
                    TotalRevenue = allOrders.Sum(o => o.TotalAmount),
                    AverageOrderValue = allOrders.Any() ? allOrders.Average(o => o.TotalAmount) : 0,
                    OrdersToday = allOrders.Count(o => o.OrderDate.Date == today),
                    RevenueToday = allOrders.Where(o => o.OrderDate.Date == today).Sum(o => o.TotalAmount),
                    PendingOrders = allOrders.Count(o => o.Status == "Pending"),
                    ProcessingOrders = allOrders.Count(o => o.Status == "Processing"),
                    ShippedOrders = allOrders.Count(o => o.Status == "Shipped"),
                    DeliveredOrders = allOrders.Count(o => o.Status == "Delivered"),
                    CancelledOrders = allOrders.Count(o => o.Status == "Cancelled")
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error getting order stats: {ex.Message}");
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

    // Request DTOs - should be in separate files
    public class CreateOrderRequest
    {
        public int CustomerId { get; set; }
        public string ShippingAddress { get; set; }
        public OrderItemRequest[] Items { get; set; }
    }

    public class OrderItemRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class UpdateStatusRequest
    {
        public string Status { get; set; }
    }
}