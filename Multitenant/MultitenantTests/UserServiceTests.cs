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
    public class UserServiceTests : IDisposable
    {
        private readonly MultitenantDbContext _context;
        private readonly UserService _service;

        public UserServiceTests()
        {
            var options = new DbContextOptionsBuilder<MultitenantDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            
            _context = new MultitenantDbContext(options);
            _service = new UserService(_context);
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        [Fact]
        public async Task GetAllAsync_Admin_ShouldReturnAllUsers()
        {
            // Arrange
            var tenant1 = new Tenant { TenantId = "T1", TenantName = "Company1" };
            var tenant2 = new Tenant { TenantId = "T2", TenantName = "Company2" };
            
            await _context.Tenants.AddRangeAsync(tenant1, tenant2);
            
            var adminUser = new User
            {
                UserId = "U1",
                UserName = "Admin",
                Email = "admin@company.com",
                Password = "password",
                Role = UserRole.Admin,
                TenantId = "T1",
                CreatedAt = DateTime.UtcNow
            };

            var employee = new User
            {
                UserId = "U2",
                UserName = "User1",
                Email = "user1@company.com",
                Password = "password",
                Role = UserRole.Employee,
                TenantId = "T2",
                CreatedAt = DateTime.UtcNow
            };

            await _context.Users.AddRangeAsync(adminUser, employee);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.GetAllAsync("U1");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetByUserIdAsync_ShouldReturnUser_WhenAdmin()
        {
            // Arrange
            var tenant = new Tenant { TenantId = "T1", TenantName = "Company1" };
            await _context.Tenants.AddAsync(tenant);
            
            var adminUser = new User
            {
                UserId = "U1",
                UserName = "Admin",
                Email = "admin@company.com",
                Password = "password",
                Role = UserRole.Admin,
                TenantId = "T1",
                CreatedAt = DateTime.UtcNow
            };
            
            var targetUser = new User
            {
                UserId = "U2",
                UserName = "Emp1",
                Email = "emp1@company.com",
                Password = "password",
                Role = UserRole.Employee,
                TenantId = "T1",
                CreatedAt = DateTime.UtcNow
            };

            await _context.Users.AddRangeAsync(adminUser, targetUser);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.GetByUserIdAsync("U2", "U1");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("U2", result.UserId);
        }

        [Fact]
        public async Task AddUserAsync_ShouldAddUser_WhenValid()
        {
            // Arrange
            var tenant = new Tenant { TenantId = "T1", TenantName = "Kanini" };
            await _context.Tenants.AddAsync(tenant);
            await _context.SaveChangesAsync();
            
            var createUser = new CreateUserDto
            {
                UserName = "EmpNew",
                Email = "emp@company.com",
                Password = "123",
                TenantId = "T1",
                DepartmentName = "HR",
                Role = UserRole.Manager
            };

            // Act
            var result = await _service.AddUserAsync(createUser);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("EmpNew", result.UserName);
            
            var userInDb = await _context.Users.FirstOrDefaultAsync(u => u.UserName == "EmpNew");
            Assert.NotNull(userInDb);
        }

        [Fact]
        public async Task DeleteUserAsync_ShouldRemoveUser_WhenExists()
        {
            // Arrange
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
            var result = await _service.DeleteUserAsync("U1");

            // Assert
            Assert.True(result);
            
            var deletedUser = await _context.Users.FindAsync("U1");
            Assert.Null(deletedUser);
        }

        [Fact]
        public async Task DeleteUserAsync_ShouldThrowException_WhenNotFound()
        {
            // Act + Assert
            await Assert.ThrowsAsync<Exception>(() => _service.DeleteUserAsync("U404"));
        }

        [Fact]
        public async Task GetAllAsync_ShouldThrowUnauthorized_WhenUserNotFound()
        {
            // Act + Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _service.GetAllAsync("U404"));
        }
    }
}


