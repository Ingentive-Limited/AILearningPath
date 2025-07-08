# KiloCode Demo - Quick Start Guide

This guide helps you get started with the KiloCode demonstration scenarios quickly.

## Prerequisites Checklist

Before starting any scenario, ensure you have:

- [ ] **Visual Studio 2022** (17.8+) or **VS Code** with C# extension
- [ ] **.NET 8 SDK** (latest version) - [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)
- [ ] **Git** for version control - [Download here](https://git-scm.com/)
- [ ] **KiloCode extension** installed in your IDE

## Quick Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd KiloCodeDemo
```

### 2. Verify Your Environment
```bash
# Check .NET version
dotnet --version

# Check Git
git --version
```

### 3. Choose Your Starting Point

| Experience Level | Recommended Scenario | Time Required |
|-----------------|---------------------|---------------|
| New to AI development | [Scenario 1: Weather API](./scenario-1-weather-api/) | 30-45 min |
| Experienced .NET developer | [Scenario 2: Legacy Modernization](./scenario-2-legacy-modernization/) | 60-90 min |

## KiloCode Setup Tips

### First-Time Setup
1. **Install the KiloCode extension** in your IDE
2. **Configure your API key** (if required)
3. **Test the connection** with a simple prompt
4. **Review the documentation** for your IDE integration

### Effective Prompting Quick Tips
- **Be specific**: "Create an ASP.NET Core 8 Web API" vs "Create an API"
- **Provide context**: Mention frameworks, databases, and requirements
- **Iterate gradually**: Start simple, then add complexity
- **Ask for explanations**: Request reasoning behind AI decisions

## Common Issues and Quick Fixes

### Issue: KiloCode not responding
**Quick Fix**: 
- Check internet connection
- Restart your IDE
- Verify KiloCode service status

### Issue: Generated code doesn't compile
**Quick Fix**:
- Run `dotnet restore` to install packages
- Check .NET SDK version compatibility
- Review any missing using statements

### Issue: Database connection errors
**Quick Fix**:
- Verify connection strings in appsettings.json
- Ensure database server is running
- Check firewall and network settings

## Getting Help

1. **Check scenario-specific troubleshooting** in each README
2. **Review KiloCode documentation** for your IDE
3. **Experiment with different prompt phrasings**
4. **Start with simpler requests** and build complexity

## Success Indicators

You'll know you're on the right track when:
- [ ] KiloCode responds to your prompts with relevant code
- [ ] Generated code compiles without major errors
- [ ] You can run and test the generated applications
- [ ] You understand the patterns KiloCode is applying

---

**Ready to start?** Choose your scenario and begin your AI-assisted development journey!