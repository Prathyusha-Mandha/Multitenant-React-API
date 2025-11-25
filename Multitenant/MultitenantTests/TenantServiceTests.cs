using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Microsoft.EntityFrameworkCore;
using Multitenant.Data;
using Multitenant.DTO;
using Multitenant.Models;
using Multitenant.Services.Implementations;

namespace Multitenant
{
    public class TenantServiceTests : IDisposable
    {
        private readonly MultitenantDbContext _context;
        private readonly TenantService _service;

        public TenantServiceTests()
        {
            var options = new DbContextOptionsBuilder<MultitenantDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            
            _context = new MultitenantDbContext(options);
            _service = new TenantService(_context);
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllTenants()
        {
            // Arrange
            var tenant1 = new Tenant { TenantId = "T1", TenantName = "Company1", CreatedAt = DateTime.UtcNow };
            var tenant2 = new Tenant { TenantId = "T2", TenantName = "Company2", CreatedAt = DateTime.UtcNow };

            await _context.Tenants.AddRangeAsync(tenant1, tenant2);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.Equal("Company1", result.First().TenantName);
        }

        [Fact]
        public async Task GetTenantNamesAsync_ShouldReturnTenantNames()
        {
            // Arrange
            var tenant1 = new Tenant { TenantId = "T1", TenantName = "Company1", CreatedAt = DateTime.UtcNow };
            var tenant2 = new Tenant { TenantId = "T2", TenantName = "Company2", CreatedAt = DateTime.UtcNow };

            await _context.Tenants.AddRangeAsync(tenant1, tenant2);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.GetTenantNamesAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.Contains("Company1", result);
            Assert.Contains("Company2", result);
        }

        [Fact]
        public async Task GetDepartmentsByTenantNameAsync_ShouldReturnDepartments()
        {
            // Arrange
            var tenant = new Tenant { TenantId = "T1", TenantName = "Company1", CreatedAt = DateTime.UtcNow };
            var user1 = new User { UserId = "U1", TenantId = "T1", DepartmentName = "HR", UserName = "User1", Email = "user1@test.com", Password = "pass", Role = UserRole.Employee, CreatedAt = DateTime.UtcNow };
            var user2 = new User { UserId = "U2", TenantId = "T1", DepartmentName = "IT", UserName = "User2", Email = "user2@test.com", Password = "pass", Role = UserRole.Employee, CreatedAt = DateTime.UtcNow };

            await _context.Tenants.AddAsync(tenant);
            await _context.Users.AddRangeAsync(user1, user2);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.GetDepartmentsByTenantNameAsync("Company1");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.Contains("HR", result);
            Assert.Contains("IT", result);
        }

        [Fact]
        public async Task AddTenantAsync_ShouldAddTenant()
        {
            // Arrange
            var createTenantDto = new CreateTenantDto { TenantName = "NewCompany" };

            // Act
            var result = await _service.AddTenantAsync(createTenantDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("NewCompany", result.TenantName);
            
            var tenantInDb = await _context.Tenants.FirstOrDefaultAsync(t => t.TenantName == "NewCompany");
            Assert.NotNull(tenantInDb);
        }
    }
}