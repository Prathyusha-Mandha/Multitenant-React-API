using Multitenant.DTO;

namespace Multitenant.Services.Interfaces
{
    public interface INotificationService
    {
        Task<NotificationListDto> GetByUserIdAsync(string userId);
        Task<NotificationListDto> GetReadNotificationsAsync(string userId);
        Task<NotificationListDto> GetUnreadNotificationsAsync(string userId);
        Task<bool> MarkAsReadAsync(string notificationId, string currentUserId);
        Task<bool> DeleteByNotificationIdAsync(string notificationId, string currentUserId);
        Task<bool> DeleteNotificationByUserIdAsync(string userId);
    }
}