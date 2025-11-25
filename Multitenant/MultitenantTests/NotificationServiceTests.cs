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
    public class NotificationServiceTests : IDisposable
    {
        private readonly MultitenantDbContext _context;
        private readonly NotificationService _service;

        public NotificationServiceTests()
        {
            var options = new DbContextOptionsBuilder<MultitenantDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            
            _context = new MultitenantDbContext(options);
            _service = new NotificationService(_context);
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        [Fact]
        public async Task GetByUserIdAsync_ShouldReturnUserNotifications()
        {
            // Arrange
            var notification1 = new Notification 
            { 
                NotificationId = "N1", 
                UserId = "U1", 
                NotificationMessage = "Test message 1",
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };
            var notification2 = new Notification 
            { 
                NotificationId = "N2", 
                UserId = "U1", 
                NotificationMessage = "Test message 2",
                IsRead = true,
                CreatedAt = DateTime.UtcNow.AddMinutes(-10)
            };

            await _context.Notifications.AddRangeAsync(notification1, notification2);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.GetByUserIdAsync("U1");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Equal(2, result.Notifications.Count());
        }

        [Fact]
        public async Task GetUnreadNotificationsAsync_ShouldReturnOnlyUnreadNotifications()
        {
            // Arrange
            var notification1 = new Notification 
            { 
                NotificationId = "N1", 
                UserId = "U1", 
                NotificationMessage = "Read message",
                IsRead = true,
                CreatedAt = DateTime.UtcNow
            };
            var notification2 = new Notification 
            { 
                NotificationId = "N2", 
                UserId = "U1", 
                NotificationMessage = "Unread message",
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Notifications.AddRangeAsync(notification1, notification2);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.GetUnreadNotificationsAsync("U1");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.Count);
            Assert.False(result.Notifications.First().IsRead);
        }

        [Fact]
        public async Task MarkAsReadAsync_ShouldMarkNotificationAsRead()
        {
            // Arrange
            var notification = new Notification 
            { 
                NotificationId = "N1", 
                UserId = "U1", 
                NotificationMessage = "Test message",
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.MarkAsReadAsync("N1", "U1");

            // Assert
            Assert.True(result);
            
            var updatedNotification = await _context.Notifications.FindAsync("N1");
            Assert.True(updatedNotification.IsRead);
        }

        [Fact]
        public async Task DeleteByNotificationIdAsync_ShouldDeleteNotification()
        {
            // Arrange
            var notification = new Notification 
            { 
                NotificationId = "N1", 
                UserId = "U1",
                NotificationMessage = "Test message",
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.DeleteByNotificationIdAsync("N1", "U1");

            // Assert
            Assert.True(result);
            
            var deletedNotification = await _context.Notifications.FindAsync("N1");
            Assert.Null(deletedNotification);
        }
    }
}