using System.ComponentModel.DataAnnotations;

namespace Multitenant.DTO
{
    public class CreateNotificationDto
    {
        [Required]
        public string UserId { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string NotificationMessage { get; set; } = string.Empty;
    }

    public class NotificationResponseDto
    {
        public string NotificationId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string NotificationMessage { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class NotificationWithChatCountDto
    {
        public IEnumerable<NotificationResponseDto> Notifications { get; set; } = new List<NotificationResponseDto>();
        public int UnreadChatCount { get; set; }
        public int ReadChatCount { get; set; }
    }

    public class NotificationListDto
    {
        public IEnumerable<NotificationResponseDto> Notifications { get; set; } = new List<NotificationResponseDto>();
        public int Count { get; set; }
    }
}