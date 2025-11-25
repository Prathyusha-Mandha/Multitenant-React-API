using Multitenant.Data;
using Microsoft.EntityFrameworkCore;

namespace Multitenant.Validators
{
    public class NotificationValidator
    {
        private readonly MultitenantDbContext _context;

        public NotificationValidator(MultitenantDbContext context)
        {
            _context = context;
        }

        public async Task ValidateNotificationExistsAsync(string notificationId)
        {
            var notification = await _context.Notifications.FindAsync(notificationId);
            if (notification == null) throw new Exception("not found");
        }

        public async Task ValidateNotificationsByUserExistAsync(string userId)
        {
            var notifications = await _context.Notifications.Where(n => n.UserId == userId).AnyAsync();
            if (!notifications) throw new Exception("not found");
        }
    }
}