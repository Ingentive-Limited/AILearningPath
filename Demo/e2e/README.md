# Todo Application - End-to-End Testing Suite

This directory contains comprehensive end-to-end tests for the Todo Application, including both frontend E2E tests using Playwright and backend API tests using .http files.

## 📁 Project Structure

```
e2e/
├── README.md                     # This file
├── package.json                  # Node.js dependencies and scripts
├── playwright.config.ts          # Playwright configuration
├── tsconfig.json                 # TypeScript configuration
├── tests/                        # Frontend E2E tests
│   ├── todo-crud.spec.ts         # CRUD operations tests
│   ├── todo-search-filter.spec.ts # Search and filter tests
│   └── todo-sort-responsive.spec.ts # Sorting and responsive tests
├── api-tests/                    # Backend API tests
│   ├── todos-api.http            # Main API test suite
│   ├── performance-tests.http    # Performance and load tests
│   └── error-handling.http       # Error scenarios and edge cases
├── page-objects/                 # Page Object Model classes
│   ├── BasePage.ts               # Base page object
│   └── TodoPage.ts               # Todo page object
├── fixtures/                     # Test data and fixtures
│   └── todoFixtures.ts           # Todo test data
└── utils/                        # Test utilities and helpers
    └── testHelpers.ts             # Test helper functions
```

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v18 or higher)
2. **Backend API** running on `http://localhost:5000`
3. **Frontend application** built and served on `http://localhost:4173`

### Installation

```bash
# Navigate to the e2e directory
cd Demo/e2e

# Install dependencies
npm install

# Install Playwright browsers
npm run install:browsers

# Install system dependencies (Linux/macOS)
npm run install:deps
```

### Running Tests

#### Frontend E2E Tests (Playwright)

```bash
# Run all E2E tests
npm test

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests with UI mode (interactive)
npm run test:ui

# Run specific test file
npx playwright test todo-crud.spec.ts

# Run tests in debug mode
npm run test:debug

# Generate test report
npm run test:report
```

#### Backend API Tests (.http files)

1. **Using VS Code REST Client Extension:**
   - Install the "REST Client" extension
   - Open any `.http` file in the `api-tests/` directory
   - Click "Send Request" above each HTTP request

2. **Using other HTTP clients:**
   - Import the `.http` files into Postman, Insomnia, or similar tools
   - Execute requests manually or as collections

## 📋 Test Coverage

### Frontend E2E Tests

#### CRUD Operations (`todo-crud.spec.ts`)
- ✅ Create todos with various data combinations
- ✅ Read/view todos in different states
- ✅ Update todo properties and status
- ✅ Delete individual and bulk todos
- ✅ Form validation and error handling
- ✅ Network error scenarios

#### Search and Filter (`todo-search-filter.spec.ts`)
- ✅ Real-time search functionality
- ✅ Case-insensitive and partial matching
- ✅ Status filtering (all, active, completed)
- ✅ Priority filtering (all, high, medium, low)
- ✅ Date filtering (all, today, this week, overdue)
- ✅ Combined filters and search
- ✅ Filter persistence and clearing

#### Sorting and Responsive Design (`todo-sort-responsive.spec.ts`)
- ✅ Sort by title, priority, due date, creation date
- ✅ Ascending and descending sort orders
- ✅ Mobile viewport testing (375x667)
- ✅ Tablet viewport testing (768x1024)
- ✅ Desktop viewport testing (1920x1080)
- ✅ Cross-viewport consistency
- ✅ Performance with large datasets

### Backend API Tests

#### Main API Suite (`todos-api.http`)
- ✅ All CRUD operations
- ✅ Query parameters and filtering
- ✅ Sorting and pagination
- ✅ Validation scenarios
- ✅ Error responses
- ✅ Edge cases and special characters

#### Performance Tests (`performance-tests.http`)
- ✅ Bulk operations
- ✅ Large payload handling
- ✅ Concurrent operations
- ✅ Complex queries
- ✅ Stress testing scenarios
- ✅ Response time benchmarks

#### Error Handling (`error-handling.http`)
- ✅ HTTP method errors
- ✅ Malformed requests
- ✅ Validation errors
- ✅ Resource not found scenarios
- ✅ Boundary value testing
- ✅ Security testing (XSS, SQL injection)

## 🎯 User Stories Coverage

Based on the PRD.md specifications, our tests cover all user stories:

### Epic 1: Task Management
- **US-1.1: Create Todo** ✅ Fully covered
- **US-1.2: View Todo List** ✅ Fully covered
- **US-1.3: Update Todo** ✅ Fully covered
- **US-1.4: Delete Todo** ✅ Fully covered

### Epic 2: Organization & Filtering
- **US-2.1: Filter Todos** ✅ Fully covered
- **US-2.2: Sort Todos** ✅ Fully covered
- **US-2.3: Search Todos** ✅ Fully covered

## 🔧 Configuration

### Playwright Configuration

The `playwright.config.ts` file includes:

- **Cross-browser testing**: Chrome, Firefox, Safari, Edge
- **Mobile testing**: Pixel 5, iPhone 12
- **Automatic server startup**: Frontend and backend
- **Test artifacts**: Screenshots, videos, traces
- **Parallel execution**: Optimized for CI/CD

### Test Data Management

Test data is organized in `fixtures/todoFixtures.ts`:

- **Valid test todos**: Various scenarios and edge cases
- **Invalid test data**: For validation testing
- **Bulk test data**: For performance testing
- **Search test data**: For search functionality testing

## 🛠️ Development Guidelines

### Writing New Tests

1. **Follow the Page Object Model pattern**
2. **Use descriptive test names**
3. **Include proper setup and teardown**
4. **Test both positive and negative scenarios**
5. **Add appropriate assertions**

Example test structure:

```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page, request }) => {
    // Setup code
  });

  test.afterEach(async () => {
    // Cleanup code
  });

  test('should perform specific action', async () => {
    // Test implementation
  });
});
```

### Adding New Page Objects

1. Extend the `BasePage` class
2. Define locators as private readonly properties
3. Implement public methods for user actions
4. Include proper error handling and waits

### API Test Guidelines

1. **Use descriptive comments** for each request
2. **Include both success and error scenarios**
3. **Test boundary conditions**
4. **Use variables for dynamic data**
5. **Include cleanup requests**

## 🚨 Troubleshooting

### Common Issues

#### Tests Failing Due to Timing
```bash
# Increase timeout in playwright.config.ts
timeout: 60000
```

#### Browser Installation Issues
```bash
# Reinstall browsers
npx playwright install --force
```

#### API Connection Issues
```bash
# Verify backend is running
curl http://localhost:5000/api/todos

# Check frontend build
cd ../frontend && npm run build && npm run preview
```

#### Port Conflicts
```bash
# Kill processes on required ports
lsof -ti:4173 | xargs kill -9  # Frontend
lsof -ti:5000 | xargs kill -9  # Backend
```

### Debug Mode

For debugging failing tests:

```bash
# Run in debug mode
npm run test:debug

# Run specific test with debug
npx playwright test todo-crud.spec.ts --debug

# Generate trace for failed tests
npx playwright test --trace on
```

### Test Reports

View detailed test reports:

```bash
# Generate and open HTML report
npm run test:report

# View test results in JSON format
cat test-results/results.json
```

## 📊 Performance Benchmarks

### Expected Response Times
- **GET /api/todos**: < 200ms
- **POST /api/todos**: < 100ms
- **PUT /api/todos/{id}**: < 100ms
- **DELETE /api/todos/{id}**: < 100ms

### Frontend Performance
- **Page load time**: < 2 seconds
- **Search response**: < 500ms
- **Filter application**: < 300ms

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd Demo/e2e
          npm ci
      - name: Install Playwright
        run: |
          cd Demo/e2e
          npx playwright install --with-deps
      - name: Run E2E tests
        run: |
          cd Demo/e2e
          npm test
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: Demo/e2e/playwright-report/
```

## 📝 Test Scenarios

### Critical User Journeys

1. **New User Journey**
   - Visit application
   - Create first todo
   - Mark as complete
   - Delete todo

2. **Power User Journey**
   - Create multiple todos
   - Use search and filters
   - Bulk operations
   - Sort by different criteria

3. **Mobile User Journey**
   - Access on mobile device
   - Create and edit todos
   - Use touch interactions
   - Responsive layout verification

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Add comprehensive tests**
4. **Ensure all tests pass**
5. **Submit a pull request**

### Test Review Checklist

- [ ] Tests cover both positive and negative scenarios
- [ ] Proper setup and cleanup
- [ ] Descriptive test names and comments
- [ ] No hardcoded values
- [ ] Appropriate assertions
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [REST Client Extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Test Best Practices](https://playwright.dev/docs/best-practices)

## 📞 Support

For questions or issues with the testing suite:

1. Check this README and troubleshooting section
2. Review existing test examples
3. Consult the main project documentation
4. Create an issue in the project repository

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Todo App Development Team