using System;
using System.Threading.Tasks;
using Xunit;
using Microsoft.EntityFrameworkCore;
using Multitenant.Data;
using Multitenant.DTO;
using Multitenant.Models;
using Multitenant.Services.Implementations;

namespace Multitenant
{
    public class SimpleServiceTests : IDisposable
    {
        private readonly MultitenantDbContext _context;

        public SimpleServiceTests()
        {
            var options = new DbContextOptionsBuilder<MultitenantDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            
            _context = new MultitenantDbContext(options);
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        [Fact]
        public async Task TenantService_GetAllAsync_ShouldReturnTenants()
        {
            // Arrange
            var service = new TenantService(_context);
            var tenant = new Tenant { TenantId = "T1", TenantName = "TestCompany", CreatedAt = DateTime.UtcNow };
            
            await _context.Tenants.AddAsync(tenant);
            await _context.SaveChangesAsync();

            // Act
            var result = await service.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal("TestCompany", result.First().TenantName);
        }

        [Fact]
        public async Task TenantService_GetTenantNamesAsync_ShouldReturnNames()
        {
            // Arrange
            var service = new TenantService(_context);
            var tenant = new Tenant { TenantId = "T1", TenantName = "TestCompany", CreatedAt = DateTime.UtcNow };
            
            await _context.Tenants.AddAsync(tenant);
            await _context.SaveChangesAsync();

            // Act
            var result = await service.GetTenantNamesAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Contains("TestCompany", result);
        }

        [Fact]
        public async Task TenantService_GetDepartmentsByTenantNameAsync_ShouldReturnDepartments()
        {
            // Arrange
            var service = new TenantService(_context);
            var tenant = new Tenant { TenantId = "T1", TenantName = "TestCompany", CreatedAt = DateTime.UtcNow };
            
            var user = new User
            {
                UserId = "U1",
                UserName = "TestUser",
                Email = "test@company.com",
                Password = "password",
                Role = UserRole.Employee,
                TenantId = "T1",
                DepartmentName = "HR",
                CreatedAt = DateTime.UtcNow
            };

            await _context.Tenants.AddAsync(tenant);
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            // Act
            var result = await service.GetDepartmentsByTenantNameAsync("TestCompany");

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Contains("HR", result);
        }

        [Fact]
        public async Task UserService_DeleteUserAsync_ShouldRemoveUser()
        {
            // Arrange
            var service = new UserService(_context);
            var user = new User
            {
                UserId = "U1",
                UserName = "TestUser",
                Email = "test@company.com",
                Password = "password",
                Role = UserRole.Employee,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            // Act
            var result = await service.DeleteUserAsync("U1");

            // Assert
            Assert.True(result);
            var deletedUser = await _context.Users.FindAsync("U1");
            Assert.Null(deletedUser);
        }
    }
}