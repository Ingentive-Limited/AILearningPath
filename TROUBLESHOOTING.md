# AI Coding Assistant Demo - Troubleshooting Guide

This guide provides solutions to common issues you might encounter while working through the AI coding assistant demonstration scenarios.

## General Issues

### AI Coding Assistant Extension Issues

#### Problem: AI coding assistant extension not working or not responding
**Symptoms**: No response to prompts, extension appears inactive
**Solutions**:
1. **Check internet connection**: AI coding assistants require stable internet connectivity
2. **Restart your IDE**: Close and reopen Visual Studio or VS Code
3. **Verify extension installation**: Check that your AI assistant is properly installed and enabled
4. **Update the extension**: Ensure you have the latest version
5. **Check service status**: Verify your AI assistant service availability
6. **Review API key/authentication**: Ensure proper authentication is configured

#### Problem: Generated code is incomplete or truncated
**Symptoms**: Code generation stops mid-way, missing closing braces
**Solutions**:
1. **Break down large requests**: Split complex prompts into smaller, focused requests
2. **Request continuation**: Ask your AI assistant to "continue the previous code" or "complete the implementation"
3. **Be more specific**: Provide clearer requirements and constraints
4. **Check token limits**: Large codebases may hit response limits

### Development Environment Issues

#### Problem: .NET SDK not found or wrong version
**Symptoms**: `dotnet` command not recognized, version mismatch errors
**Solutions**:
1. **Install .NET 8 SDK**: Download from [Microsoft .NET Downloads](https://dotnet.microsoft.com/download/dotnet/8.0)
2. **Verify installation**: Run `dotnet --version` in terminal
3. **Check PATH environment**: Ensure .NET is in your system PATH
4. **Restart terminal/IDE**: Refresh environment variables

#### Problem: NuGet package restore failures
**Symptoms**: Missing references, package not found errors
**Solutions**:
1. **Clear NuGet cache**: Run `dotnet nuget locals all --clear`
2. **Restore packages**: Run `dotnet restore` in project directory
3. **Check package sources**: Verify NuGet.org is accessible
4. **Update package references**: Ensure compatible package versions

## Scenario-Specific Issues

### Scenario 1: Weather API Issues

#### Problem: Database connection errors with SQLite
**Symptoms**: "Unable to open database file" or connection string errors
**Solutions**:
1. **Check connection string**: Verify path in `appsettings.json`
2. **Run migrations**: Execute `dotnet ef database update`
3. **Install EF tools**: Run `dotnet tool install --global dotnet-ef`
4. **Check file permissions**: Ensure write access to database file location

#### Problem: Swagger UI not loading
**Symptoms**: 404 error when accessing `/swagger`
**Solutions**:
1. **Verify Swagger configuration**: Check `Program.cs` for Swagger setup
2. **Check environment**: Ensure running in Development mode
3. **Verify URL**: Use correct port and path (usually `https://localhost:7xxx/swagger`)
4. **Clear browser cache**: Refresh browser or try incognito mode

### Scenario 2: Legacy Modernization Issues

#### Problem: Migration from .NET Framework to .NET 8 fails
**Symptoms**: Compilation errors, missing references
**Solutions**:
1. **Install .NET Framework Developer Pack**: Required for migration tools
2. **Update project file format**: Convert to SDK-style project format
3. **Replace incompatible packages**: Find .NET 8 compatible alternatives
4. **Update using statements**: Some namespaces have changed

#### Problem: Entity Framework 6 to EF Core migration issues
**Symptoms**: Context errors, LINQ query failures
**Solutions**:
1. **Update DbContext**: Inherit from `DbContext` instead of `DbContext`
2. **Replace EF6 packages**: Install EF Core packages
3. **Update LINQ queries**: Some EF6 patterns don't work in EF Core
4. **Reconfigure relationships**: EF Core has different configuration syntax

### Scenario 3: Microservices Issues

#### Problem: Docker containers not starting
**Symptoms**: Container exit codes, port binding errors
**Solutions**:
1. **Check Docker Desktop**: Ensure Docker is running
2. **Verify port availability**: Check for port conflicts
3. **Review Dockerfile**: Ensure proper base images and commands
4. **Check resource limits**: Ensure sufficient memory and CPU

#### Problem: Service-to-service communication failures
**Symptoms**: HTTP errors, timeouts between services
**Solutions**:
1. **Check service discovery**: Verify service registration and discovery
2. **Review network configuration**: Ensure services can reach each other
3. **Verify load balancer**: Check API Gateway routing configuration
4. **Check firewall rules**: Ensure ports are open for communication

#### Problem: Message queue (RabbitMQ) connection issues
**Symptoms**: Connection refused, authentication failures
**Solutions**:
1. **Verify RabbitMQ is running**: Check container or service status
2. **Check connection string**: Verify host, port, and credentials
3. **Review queue configuration**: Ensure exchanges and queues exist
4. **Check network connectivity**: Verify services can reach RabbitMQ

## Performance Issues

### Problem: Slow application startup
**Symptoms**: Long initialization times, timeouts
**Solutions**:
1. **Review dependency injection**: Check for heavy operations in constructors
2. **Optimize database connections**: Use connection pooling
3. **Check async operations**: Ensure proper async/await usage
4. **Profile startup**: Use diagnostic tools to identify bottlenecks

### Problem: High memory usage
**Symptoms**: Out of memory exceptions, slow performance
**Solutions**:
1. **Review object disposal**: Ensure proper `using` statements and disposal
2. **Check for memory leaks**: Use memory profilers
3. **Optimize caching**: Review cache expiration and size limits
4. **Monitor garbage collection**: Check GC pressure and frequency

## Testing Issues

### Problem: Unit tests failing after code generation
**Symptoms**: Test compilation errors, assertion failures
**Solutions**:
1. **Update test references**: Ensure tests reference correct assemblies
2. **Review test data**: Update test data to match new implementations
3. **Check mocking setup**: Verify mock configurations are correct
4. **Update assertions**: Ensure expectations match new behavior

### Problem: Integration tests timing out
**Symptoms**: Test timeouts, database connection issues
**Solutions**:
1. **Check test database**: Ensure test database is accessible
2. **Review test isolation**: Ensure tests don't interfere with each other
3. **Increase timeouts**: Allow more time for complex operations
4. **Optimize test data**: Use minimal data sets for faster execution

## IDE-Specific Issues

### Visual Studio Issues

#### Problem: IntelliSense not working with generated code
**Solutions**:
1. **Rebuild solution**: Clean and rebuild the entire solution
2. **Clear Visual Studio cache**: Delete `bin` and `obj` folders
3. **Restart Visual Studio**: Close and reopen the IDE
4. **Check project references**: Ensure all references are correct

### VS Code Issues

#### Problem: C# extension not recognizing generated code
**Solutions**:
1. **Reload window**: Use Ctrl+Shift+P → "Developer: Reload Window"
2. **Check OmniSharp**: Ensure OmniSharp is running correctly
3. **Update C# extension**: Ensure latest version is installed
4. **Check .NET SDK**: Verify correct SDK version is detected

## Getting Additional Help

### When to Seek Help
- Issues persist after trying suggested solutions
- Errors are not covered in this guide
- Need clarification on AI coding assistant capabilities
- Encountering environment-specific problems

### How to Report Issues
When reporting issues, include:
1. **Scenario and step** where the issue occurred
2. **Complete error messages** (copy/paste exact text)
3. **Environment details** (OS, .NET version, IDE version)
4. **Steps to reproduce** the issue
5. **Expected vs actual behavior**

### Resources for Additional Help
- **AI Coding Assistant Documentation**: Check official documentation for your specific tool
- **Community Forums**: Search for similar issues
- **GitHub Issues**: Report bugs or request features
- **Stack Overflow**: Search for .NET and development issues

## Prevention Tips

### Best Practices to Avoid Issues
1. **Start simple**: Begin with basic functionality before adding complexity
2. **Test incrementally**: Verify each step before proceeding
3. **Keep backups**: Use version control to save working states
4. **Read error messages**: Often contain specific guidance
5. **Follow scenario instructions**: Complete steps in the recommended order

### Environment Maintenance
1. **Keep tools updated**: Regularly update .NET SDK, IDE, and extensions
2. **Clean regularly**: Clear caches and temporary files periodically
3. **Monitor resources**: Ensure adequate disk space and memory
4. **Document changes**: Keep notes of customizations and configurations

---

**Remember**: Most issues have simple solutions. Start with the basics (restart, rebuild, restore) before trying complex fixes!