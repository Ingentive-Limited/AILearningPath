# Getting Started Guide

This guide provides step-by-step instructions to set up and run the Full-Stack Todo Application on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

| Software | Minimum Version | Download Link | Verification Command |
|----------|----------------|---------------|---------------------|
| **Node.js** | 18.0.0+ | [nodejs.org](https://nodejs.org/) | `node --version` |
| **npm** | 8.0.0+ | Included with Node.js | `npm --version` |
| **.NET SDK** | 9.0+ | [dotnet.microsoft.com](https://dotnet.microsoft.com/download) | `dotnet --version` |
| **Git** | 2.30.0+ | [git-scm.com](https://git-scm.com/) | `git --version` |

### System Requirements

- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **Network**: Internet connection for package downloads

### Verify Prerequisites

Run these commands to verify your system is ready:

```bash
# Check Node.js and npm
node --version    # Should show v18.0.0 or higher
npm --version     # Should show 8.0.0 or higher

# Check .NET SDK
dotnet --version  # Should show 9.0.0 or higher

# Check Git
git --version     # Should show 2.30.0 or higher
```

## 🚀 Quick Setup (5 Minutes)

### 1. Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd Demo

# Verify project structure
ls -la
# You should see: backend/, frontend/, e2e/, README.md, PRD.md
```

### 2. Start the Backend API

```bash
# Open Terminal 1 - Backend
cd backend

# Restore .NET dependencies
dotnet restore

# Build the solution
dotnet build

# Start the API server
dotnet run --project TodoApp.WebAPI
```

**Expected Output:**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:7000
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

**Verify Backend:**
- Open http://localhost:5000/swagger in your browser
- You should see the Swagger API documentation

### 3. Start the Frontend Application

```bash
# Open Terminal 2 - Frontend
cd frontend

# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

**Expected Output:**
```
  VITE v7.0.0  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Verify Frontend:**
- Open http://localhost:5173 in your browser
- You should see the Todo application interface

### 4. Run End-to-End Tests

```bash
# Open Terminal 3 - Testing
cd e2e

# Install test dependencies
npm install

# Install Playwright browsers
npm run install:browsers

# Run all tests
npm test
```

**Expected Output:**
```
Running 20 tests using 1 worker

  ✓ todo-crud.spec.ts:15:5 › Todo CRUD Operations › should create a simple todo successfully
  ✓ todo-crud.spec.ts:25:5 › Todo CRUD Operations › should edit todo title successfully
  ...
  
  20 passed (45.2s)
```

## 🔧 Detailed Setup Instructions

### Backend Setup (Detailed)

#### 1. Navigate to Backend Directory
```bash
cd Demo/backend
```

#### 2. Understand the Project Structure
```
backend/
├── TodoApp.sln                 # Solution file
├── TodoApp.Domain/             # Domain entities and enums
├── TodoApp.Application/        # Business logic and DTOs
├── TodoApp.Infrastructure/     # Data access layer
└── TodoApp.WebAPI/            # API controllers and startup
```

#### 3. Restore Dependencies
```bash
# This downloads all NuGet packages
dotnet restore

# Verify packages are restored
dotnet list package
```

#### 4. Build the Solution
```bash
# Build all projects
dotnet build

# Build specific project
dotnet build TodoApp.WebAPI
```

#### 5. Database Setup
The application uses SQLite with Entity Framework Core. The database is created automatically:

```bash
# Check if database exists (after first run)
ls -la *.db

# If you need to reset the database
rm todos.db
dotnet run --project TodoApp.WebAPI  # Recreates database
```

#### 6. Run the Application
```bash
# Run with hot reload (development)
dotnet run --project TodoApp.WebAPI

# Run in production mode
dotnet run --project TodoApp.WebAPI --configuration Release
```

#### 7. Verify Backend is Running
- **API Base URL**: http://localhost:5000/api
- **Swagger UI**: http://localhost:5000/swagger
- **Health Check**: http://localhost:5000/api/todos (should return empty array)

### Frontend Setup (Detailed)

#### 1. Navigate to Frontend Directory
```bash
cd Demo/frontend
```

#### 2. Understand the Project Structure
```
frontend/
├── package.json               # Dependencies and scripts
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── src/
│   ├── components/           # React components
│   ├── hooks/               # Custom hooks
│   ├── services/            # API services
│   ├── types/               # TypeScript types
│   └── lib/                 # Utilities
└── public/                  # Static assets
```

#### 3. Install Dependencies
```bash
# Install all dependencies
npm install

# Install specific dependency (if needed)
npm install <package-name>

# Check for outdated packages
npm outdated
```

#### 4. Environment Configuration
The frontend is configured to connect to the backend at `http://localhost:5000`. If your backend runs on a different port, update `src/services/api.ts`:

```typescript
// src/services/api.ts
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Update this if needed
  timeout: 10000,
});
```

#### 5. Development Server
```bash
# Start development server with hot reload
npm run dev

# Start on specific port
npm run dev -- --port 3000

# Start with network access
npm run dev -- --host
```

#### 6. Build for Production
```bash
# Create production build
npm run build

# Preview production build
npm run preview

# Check build size
npm run build && ls -lh dist/
```

#### 7. Verify Frontend is Running
- **Development URL**: http://localhost:5173
- **Production Preview**: http://localhost:4173 (after `npm run preview`)
- **Features to Test**:
  - Create a new todo
  - Mark todo as complete
  - Search and filter todos
  - Responsive design on mobile

### Testing Setup (Detailed)

#### 1. Navigate to E2E Directory
```bash
cd Demo/e2e
```

#### 2. Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Install Playwright browsers
npm run install:browsers

# Install system dependencies (Linux/macOS)
npm run install:deps
```

#### 3. Configure Test Environment
Ensure both backend and frontend are running before running tests:
- Backend: http://localhost:5000
- Frontend: http://localhost:4173 (production build)

#### 4. Run Different Test Types
```bash
# Run all tests
npm test

# Run tests with visible browser
npm run test:headed

# Run interactive test runner
npm run test:ui

# Run specific test file
npx playwright test todo-crud.spec.ts

# Run tests in debug mode
npm run test:debug

# Generate test report
npm run test:report
```

#### 5. API Testing
For API tests, use VS Code with the REST Client extension:

1. Install "REST Client" extension in VS Code
2. Open files in `api-tests/` directory
3. Click "Send Request" above each HTTP request

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Port Already in Use
```bash
# Find process using port 5000 (backend)
lsof -ti:5000

# Kill process
lsof -ti:5000 | xargs kill -9

# Find process using port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

#### .NET Build Errors
```bash
# Clear build cache
dotnet clean

# Restore packages
dotnet restore

# Rebuild solution
dotnet build
```

#### Node.js/npm Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Update npm to latest version
npm install -g npm@latest
```

#### Database Issues
```bash
# Reset SQLite database
cd backend
rm todos.db
dotnet run --project TodoApp.WebAPI
```

#### Playwright Test Failures
```bash
# Update Playwright
npm install @playwright/test@latest

# Reinstall browsers
npx playwright install --force

# Run tests with more verbose output
npx playwright test --reporter=verbose
```

#### CORS Issues
If you encounter CORS errors, verify:
1. Backend is running on port 5000
2. Frontend is configured to use correct API URL
3. CORS is properly configured in `Program.cs`

#### TypeScript Errors
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Update TypeScript
npm install typescript@latest
```

## 🔧 Development Workflow

### Daily Development Process

1. **Start Development Environment**
   ```bash
   # Terminal 1: Backend
   cd backend && dotnet run --project TodoApp.WebAPI
   
   # Terminal 2: Frontend
   cd frontend && npm run dev
   
   # Terminal 3: Tests (when needed)
   cd e2e && npm test
   ```

2. **Make Changes**
   - Backend: Edit C# files, changes auto-reload
   - Frontend: Edit React/TypeScript files, hot reload active
   - Tests: Add new test cases as needed

3. **Test Changes**
   ```bash
   # Run specific tests
   cd e2e
   npx playwright test todo-crud.spec.ts
   
   # Test API endpoints
   # Open api-tests/*.http files in VS Code
   ```

4. **Build for Production**
   ```bash
   # Frontend production build
   cd frontend
   npm run build
   npm run preview
   
   # Backend production build
   cd backend
   dotnet publish --configuration Release
   ```

### Code Quality Checks

```bash
# Frontend linting
cd frontend
npm run lint

# TypeScript type checking
npx tsc --noEmit

# Build verification
npm run build
```

## 📚 Next Steps

After successfully setting up the application:

1. **Explore the Code**
   - Review [`PRD.md`](./PRD.md) for feature specifications
   - Check [`backend/README.md`](./backend/README.md) for API details
   - Read [`frontend/README.md`](./frontend/README.md) for component architecture
   - Study [`e2e/README.md`](./e2e/README.md) for testing strategies

2. **Try the Features**
   - Create todos with different priorities
   - Test search and filtering
   - Try bulk operations
   - Test responsive design on mobile

3. **Run the Full Test Suite**
   - Execute all E2E tests
   - Try API tests with different scenarios
   - Check test coverage reports

4. **Development**
   - Make small changes and see hot reload
   - Add new features following the architecture
   - Write tests for new functionality

## 🆘 Getting Help

If you encounter issues not covered in this guide:

1. **Check Documentation**
   - Review component-specific README files
   - Check the main [`README.md`](./README.md)
   - Consult the [`PRD.md`](./PRD.md) for requirements

2. **Debug Steps**
   - Check browser console for errors
   - Review terminal output for error messages
   - Verify all prerequisites are installed
   - Ensure ports are not in use by other applications

3. **Common Resources**
   - [React Documentation](https://react.dev/)
   - [.NET Documentation](https://docs.microsoft.com/en-us/dotnet/)
   - [Playwright Documentation](https://playwright.dev/)
   - [Vite Documentation](https://vitejs.dev/)

## ✅ Success Checklist

Verify your setup is complete:

- [ ] Backend API running on http://localhost:5000
- [ ] Swagger UI accessible at http://localhost:5000/swagger
- [ ] Frontend running on http://localhost:5173
- [ ] Can create, edit, and delete todos
- [ ] Search and filtering work correctly
- [ ] E2E tests pass successfully
- [ ] API tests can be executed
- [ ] No console errors in browser
- [ ] Responsive design works on mobile

**Congratulations! 🎉 Your Todo Application is ready for development.**

---

*Last Updated: January 2025*  
*For additional help, refer to the main [README.md](./README.md) or component-specific documentation.*