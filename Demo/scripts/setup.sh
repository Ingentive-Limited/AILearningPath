#!/bin/bash

# Full-Stack Todo Application Setup Script
# This script sets up the entire development environment

set -e  # Exit on any error

echo "🚀 Setting up Full-Stack Todo Application..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    print_success "Node.js $(node --version) ✓"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    print_success "npm $(npm --version) ✓"
    
    # Check .NET
    if ! command -v dotnet &> /dev/null; then
        print_error ".NET SDK is not installed. Please install .NET 9+ from https://dotnet.microsoft.com/download"
        exit 1
    fi
    
    DOTNET_VERSION=$(dotnet --version | cut -d'.' -f1)
    if [ "$DOTNET_VERSION" -lt 9 ]; then
        print_error ".NET 9+ is required. Current version: $(dotnet --version)"
        exit 1
    fi
    print_success ".NET $(dotnet --version) ✓"
    
    # Check Git
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git from https://git-scm.com/"
        exit 1
    fi
    print_success "Git $(git --version | cut -d' ' -f3) ✓"
}

# Setup backend
setup_backend() {
    print_status "Setting up backend (.NET API)..."
    
    cd backend
    
    # Restore packages
    print_status "Restoring .NET packages..."
    dotnet restore
    
    # Build solution
    print_status "Building .NET solution..."
    dotnet build
    
    print_success "Backend setup completed ✓"
    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend (React + TypeScript)..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing npm dependencies..."
    npm install
    
    # Build frontend
    print_status "Building frontend..."
    npm run build
    
    print_success "Frontend setup completed ✓"
    cd ..
}

# Setup E2E tests
setup_e2e() {
    print_status "Setting up E2E tests (Playwright)..."
    
    cd e2e
    
    # Install dependencies
    print_status "Installing E2E test dependencies..."
    npm install
    
    # Install Playwright browsers
    print_status "Installing Playwright browsers..."
    npm run install:browsers
    
    print_success "E2E tests setup completed ✓"
    cd ..
}

# Verify setup
verify_setup() {
    print_status "Verifying setup..."
    
    # Check if backend builds
    cd backend
    if dotnet build --verbosity quiet; then
        print_success "Backend builds successfully ✓"
    else
        print_error "Backend build failed ✗"
        exit 1
    fi
    cd ..
    
    # Check if frontend builds
    cd frontend
    if npm run build > /dev/null 2>&1; then
        print_success "Frontend builds successfully ✓"
    else
        print_error "Frontend build failed ✗"
        exit 1
    fi
    cd ..
    
    # Check if E2E tests are ready
    cd e2e
    if npx playwright --version > /dev/null 2>&1; then
        print_success "E2E tests are ready ✓"
    else
        print_error "E2E tests setup failed ✗"
        exit 1
    fi
    cd ..
}

# Main setup process
main() {
    echo "Starting setup process..."
    echo
    
    check_prerequisites
    echo
    
    setup_backend
    echo
    
    setup_frontend
    echo
    
    setup_e2e
    echo
    
    verify_setup
    echo
    
    print_success "🎉 Setup completed successfully!"
    echo
    echo "Next steps:"
    echo "1. Start the backend:  cd backend && dotnet run --project TodoApp.WebAPI"
    echo "2. Start the frontend: cd frontend && npm run dev"
    echo "3. Run E2E tests:      cd e2e && npm test"
    echo
    echo "Access the application:"
    echo "• Frontend: http://localhost:5173"
    echo "• Backend API: http://localhost:5000/api"
    echo "• Swagger UI: http://localhost:5000/swagger"
    echo
    echo "For detailed instructions, see GETTING_STARTED.md"
}

# Run main function
main "$@"