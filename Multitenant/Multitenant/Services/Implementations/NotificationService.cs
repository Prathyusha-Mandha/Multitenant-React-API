using Microsoft.EntityFrameworkCore;
using Multitenant.Data;
using Multitenant.DTO;
using Multitenant.Models;
using Multitenant.Services.Interfaces;
using Multitenant.Services;

namespace Multitenant.Services.Implementations
{
    public class NotificationService : INotificationService
    {
        private readonly MultitenantDbContext _context;

        public NotificationService(MultitenantDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<NotificationListDto> GetByUserIdAsync(string userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            var notificationDtos = notifications.Select(n => new NotificationResponseDto
            {
                NotificationId = n.NotificationId!,
                UserId = n.UserId!,
                NotificationMessage = n.NotificationMessage!,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            });

            return new NotificationListDto
            {
                Notifications = notificationDtos,
                Count = notifications.Count
            };
        }

        public async Task<NotificationListDto> GetReadNotificationsAsync(string userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId && n.IsRead == true)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            var notificationDtos = notifications.Select(n => new NotificationResponseDto
            {
                NotificationId = n.NotificationId!,
                UserId = n.UserId!,
                NotificationMessage = n.NotificationMessage!,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            });

            return new NotificationListDto
            {
                Notifications = notificationDtos,
                Count = notifications.Count
            };
        }

        public async Task<NotificationListDto> GetUnreadNotificationsAsync(string userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId && n.IsRead == false)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            var notificationDtos = notifications.Select(n => new NotificationResponseDto
            {
                NotificationId = n.NotificationId!,
                UserId = n.UserId!,
                NotificationMessage = n.NotificationMessage!,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            });

            return new NotificationListDto
            {
                Notifications = notificationDtos,
                Count = notifications.Count
            };
        }

        public async Task<bool> MarkAsReadAsync(string notificationId, string currentUserId)
        {
            var notification = await _context.Notifications.FindAsync(notificationId);
            if (notification == null) return false;

            if (notification.UserId != currentUserId)
                throw new UnauthorizedAccessException("Can only mark your own notifications as read");

            if (notification.IsRead)
                throw new InvalidOperationException("Notification is already marked as read");

            notification.IsRead = true;
            _context.Notifications.Update(notification);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteByNotificationIdAsync(string notificationId, string currentUserId)
        {
            var notification = await _context.Notifications.FindAsync(notificationId);
            if (notification == null) throw new Exception("Notification not found");

            if (notification.UserId != currentUserId)
                throw new UnauthorizedAccessException("Can only delete your own notifications");

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteNotificationByUserIdAsync(string userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId)
                .ToListAsync();

            if (!notifications.Any()) throw new Exception("not found");

            _context.Notifications.RemoveRange(notifications);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}