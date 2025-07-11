# LegacyShop - Legacy .NET Framework 4.8 E-commerce Application

This is a **legacy e-commerce application** built with .NET Framework 4.8 that demonstrates common anti-patterns and outdated practices found in real-world legacy systems. It's designed for educational purposes to practice modernizing legacy codebases with AI assistance.

## 🚨 Important Notice

This application **intentionally contains legacy patterns and anti-patterns** that need modernization. It is not meant to represent best practices but rather realistic legacy code that developers encounter when modernizing existing systems.

## 🏗️ Architecture Overview

The application follows a traditional .NET Framework architecture:

- **Framework**: .NET Framework 4.8
- **Web API**: ASP.NET Web API 2
- **ORM**: Entity Framework 6
- **Database**: SQL Server LocalDB
- **Configuration**: Web.config
- **Dependency Management**: packages.config

## 📁 Project Structure

```
LegacyShop/
├── App_Start/
│   ├── RouteConfig.cs          # MVC routing configuration
│   └── WebApiConfig.cs         # Web API configuration
├── Controllers/
│   ├── ProductsController.cs   # Product management API
│   ├── CustomersController.cs  # Customer management API
│   ├── OrdersController.cs     # Order processing API
│   └── ReportsController.cs    # Reporting API
├── Data/
│   ├── LegacyShopContext.cs    # Entity Framework 6 DbContext
│   └── DatabaseHelper.cs       # Legacy data access helper
├── Models/
│   ├── Product.cs              # Product entity
│   ├── Customer.cs             # Customer entity
│   ├── Order.cs                # Order entity
│   └── OrderItem.cs            # Order item entity
├── Content/
│   └── Site.css                # Basic styling
├── Properties/
│   └── AssemblyInfo.cs         # Assembly information
├── Global.asax                 # Application entry point
├── Global.asax.cs              # Application startup logic
├── Web.config                  # Legacy configuration
├── packages.config             # NuGet packages
├── LegacyShop.csproj          # Project file
└── index.html                  # API documentation page
```

## 🔧 Legacy Patterns Demonstrated

This application includes the following legacy patterns that need modernization:

### 1. **Synchronous Operations**
- All database operations are synchronous
- No async/await patterns
- Blocking I/O operations

### 2. **Direct Database Access**
- Controllers directly instantiate and use DbContext
- No repository pattern or service layer
- Tight coupling between presentation and data layers

### 3. **No Dependency Injection**
- Dependencies created directly in classes
- No IoC container
- Hard to test and maintain

### 4. **Mixed Concerns**
- Business logic mixed in controllers
- Data access logic in multiple places
- No clear separation of responsibilities

### 5. **Poor Error Handling**
- Basic try-catch blocks
- Minimal error information
- No structured logging

### 6. **Minimal Validation**
- Basic input validation only
- No business rule enforcement
- No data annotations or FluentValidation

### 7. **Inefficient Queries**
- N+1 query problems
- Loading all data into memory
- No query optimization

### 8. **No Caching**
- No response caching
- No data caching
- Repeated database calls

### 9. **Security Issues**
- SQL injection vulnerabilities in DatabaseHelper
- No authentication or authorization
- Insecure configuration storage

### 10. **Configuration Issues**
- Hardcoded values throughout code
- Sensitive data in web.config
- No environment-specific configuration

### 11. **No Testing**
- No unit tests
- No integration tests
- No test infrastructure

### 12. **Legacy Framework Dependencies**
- .NET Framework 4.8
- Entity Framework 6
- Old-style project files

## 🚀 Getting Started

### Prerequisites

- Visual Studio 2019/2022 or VS Code with C# extension
- .NET Framework 4.8 Developer Pack
- SQL Server LocalDB (included with Visual Studio)
- IIS Express (included with Visual Studio)

### Running the Application

1. **Clone or download** the project files

2. **Restore NuGet packages**:
   ```bash
   nuget restore LegacyShop.csproj
   ```

3. **Build the solution**:
   ```bash
   msbuild LegacyShop.csproj
   ```

4. **Run with IIS Express**:
   - Open in Visual Studio and press F5
   - Or use IIS Express command line:
     ```bash
     "C:\Program Files\IIS Express\iisexpress.exe" /path:C:\path\to\LegacyShop /port:44362
     ```

5. **Access the application**:
   - Open browser to `http://localhost:44362`
   - View API documentation at `http://localhost:44362/index.html`

### Database Setup

The application uses **Code First** with Entity Framework 6:

- Database is created automatically on first run
- Uses SQL Server LocalDB by default
- Sample data is seeded automatically
- Connection string in `Web.config`

## 📋 API Endpoints

### Products API
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/search?term={searchTerm}` - Search products
- `GET /api/products/category/{category}` - Get products by category
- `GET /api/products/lowstock` - Get low stock products
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Customers API
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `GET /api/customers/search?email={email}` - Search customer by email
- `GET /api/customers/stats` - Get customer statistics
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Orders API
- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders/customer/{customerId}` - Get orders by customer
- `GET /api/orders/stats` - Get order statistics
- `POST /api/orders` - Create new order
- `PUT /api/orders/{id}/status` - Update order status

### Reports API
- `GET /api/reports/sales` - Get sales report
- `GET /api/reports/inventory` - Get inventory report
- `GET /api/reports/customers` - Get customer report
- `GET /api/reports/performance` - Get performance report

## 🎯 Modernization Goals

Use this application to practice modernizing to:

### Framework & Platform
- **Migrate to .NET 8** from .NET Framework 4.8
- **Convert to SDK-style project** from legacy .csproj format
- **Update to ASP.NET Core** from ASP.NET Web API

### Data Access
- **Migrate to Entity Framework Core** from EF6
- **Implement async/await patterns** throughout
- **Add repository pattern** and unit of work
- **Implement proper connection management**

### Architecture
- **Implement dependency injection** with built-in container
- **Add service layer** to separate business logic
- **Implement clean architecture** principles
- **Add proper error handling** and logging

### Modern Practices
- **Add comprehensive validation** with FluentValidation
- **Implement caching strategies** for performance
- **Add authentication and authorization**
- **Implement API versioning** and documentation
- **Add health checks** and monitoring

### Testing
- **Add unit tests** with xUnit and Moq
- **Implement integration tests** for APIs
- **Add performance tests** and benchmarks
- **Set up CI/CD pipeline**

### Configuration & Security
- **Migrate to appsettings.json** from web.config
- **Implement secure configuration** management
- **Add input validation** and sanitization
- **Fix security vulnerabilities**

## 🔍 Sample Requests

### Create a Product
```http
POST /api/products
Content-Type: application/json

{
  "name": "Wireless Headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "price": 199.99,
  "stockQuantity": 50,
  "category": "Electronics"
}
```

### Create a Customer
```http
POST /api/customers
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "555-0123",
  "address": "123 Main St, Anytown, ST 12345"
}
```

### Create an Order
```http
POST /api/orders
Content-Type: application/json

{
  "customerId": 1,
  "shippingAddress": "123 Main St, Anytown, ST 12345",
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ]
}
```

## 🐛 Known Issues (By Design)

These issues are intentional and represent common legacy problems:

1. **SQL Injection vulnerability** in `DatabaseHelper.ExecuteRawSql()`
2. **N+1 query problems** in various controllers
3. **Memory leaks** from improper disposal patterns
4. **Performance issues** from loading all data into memory
5. **Concurrency issues** from lack of proper transaction handling
6. **Security issues** from no authentication/authorization
7. **Configuration issues** from hardcoded values and insecure storage

## 📚 Learning Resources

- [.NET Upgrade Assistant](https://docs.microsoft.com/en-us/dotnet/core/porting/upgrade-assistant-overview)
- [Migrating from EF6 to EF Core](https://docs.microsoft.com/en-us/ef/efcore-and-ef6/porting/)
- [ASP.NET Core Migration Guide](https://docs.microsoft.com/en-us/aspnet/core/migration/mvc)
- [Clean Architecture in .NET](https://docs.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures)

## ⚠️ Disclaimer

This application is for **educational purposes only**. It intentionally contains security vulnerabilities, performance issues, and anti-patterns. **Do not use this code in production** without proper modernization and security review.

---

**Ready to modernize?** Use this legacy application with your AI coding assistant to practice AI-assisted modernization techniques!