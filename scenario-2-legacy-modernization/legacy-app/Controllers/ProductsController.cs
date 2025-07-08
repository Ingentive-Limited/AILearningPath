using System;
using System.Configuration;
using System.Linq;
using System.Web.Http;

namespace LegacyShop.Controllers
{
    // Legacy Web API controller - demonstrates anti-patterns
    public class ProductsController : ApiController
    {
        // Direct database access in controller (anti-pattern)
        private LegacyShopContext db = new LegacyShopContext();

        // GET api/products - synchronous operation
        public IHttpActionResult Get()
        {
            try
            {
                // No pagination - loads all products
                var products = db.Products.Where(p => p.IsActive).ToList();
                return Ok(products);
            }
            catch (Exception ex)
            {
                // Poor error handling
                System.Diagnostics.Trace.WriteLine($"Error getting products: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // GET api/products/5
        public IHttpActionResult Get(int id)
        {
            try
            {
                var product = db.Products.Find(id);
                if (product == null || !product.IsActive)
                {
                    return NotFound();
                }
                return Ok(product);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error getting product {id}: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // GET api/products/search?term=laptop
        [HttpGet]
        [Route("api/products/search")]
        public IHttpActionResult Search(string term = "")
        {
            try
            {
                if (string.IsNullOrEmpty(term))
                {
                    return BadRequest("Search term is required");
                }

                // Inefficient LIKE query - no full-text search
                var products = db.Products
                    .Where(p => p.IsActive && 
                               (p.Name.Contains(term) || 
                                p.Description.Contains(term) || 
                                p.Category.Contains(term)))
                    .ToList();

                return Ok(products);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error searching products: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // GET api/products/category/Electronics
        [HttpGet]
        [Route("api/products/category/{category}")]
        public IHttpActionResult GetByCategory(string category)
        {
            try
            {
                var products = db.Products
                    .Where(p => p.IsActive && p.Category.Equals(category, StringComparison.OrdinalIgnoreCase))
                    .ToList();

                return Ok(products);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error getting products by category: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // POST api/products
        public IHttpActionResult Post([FromBody]Product product)
        {
            try
            {
                // Minimal validation
                if (product == null)
                {
                    return BadRequest("Product data is required");
                }

                if (string.IsNullOrEmpty(product.Name))
                {
                    return BadRequest("Product name is required");
                }

                if (product.Price <= 0)
                {
                    return BadRequest("Product price must be greater than zero");
                }

                // Business logic in controller (anti-pattern)
                product.CreatedDate = DateTime.Now;
                product.IsActive = true;

                db.Products.Add(product);
                db.SaveChanges(); // Synchronous save

                return Created($"api/products/{product.Id}", product);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error creating product: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // PUT api/products/5
        public IHttpActionResult Put(int id, [FromBody]Product product)
        {
            try
            {
                if (product == null || id != product.Id)
                {
                    return BadRequest("Invalid product data");
                }

                var existingProduct = db.Products.Find(id);
                if (existingProduct == null)
                {
                    return NotFound();
                }

                // Manual property mapping - no AutoMapper
                existingProduct.Name = product.Name;
                existingProduct.Description = product.Description;
                existingProduct.Price = product.Price;
                existingProduct.StockQuantity = product.StockQuantity;
                existingProduct.Category = product.Category;
                existingProduct.IsActive = product.IsActive;

                db.SaveChanges(); // Synchronous save

                return Ok(existingProduct);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error updating product: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // DELETE api/products/5
        public IHttpActionResult Delete(int id)
        {
            try
            {
                var product = db.Products.Find(id);
                if (product == null)
                {
                    return NotFound();
                }

                // Soft delete - just mark as inactive
                product.IsActive = false;
                db.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error deleting product: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // GET api/products/lowstock
        [HttpGet]
        [Route("api/products/lowstock")]
        public IHttpActionResult GetLowStockProducts()
        {
            try
            {
                var threshold = int.Parse(ConfigurationManager.AppSettings["LowStockThreshold"] ?? "5");
                
                var lowStockProducts = db.Products
                    .Where(p => p.IsActive && p.StockQuantity <= threshold)
                    .ToList();

                return Ok(lowStockProducts);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine($"Error getting low stock products: {ex.Message}");
                return InternalServerError(ex);
            }
        }

        // No proper disposal pattern
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