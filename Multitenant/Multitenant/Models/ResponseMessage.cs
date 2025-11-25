using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Multitenant.Models
{

    public class ResponseMessage
    {
        [Key]
        public string? ResponseMessageId { get; set; }

        [Required]
        [ForeignKey("PostMessage")]
        public string? PostMessageId { get; set; }

        [Required]
        [ForeignKey("User")]
        public string? UserId { get; set; }

        [Required]
        public string? ReplyText { get; set; }
        public byte[]? FileUrl { get; set; }
        public DateTime RepliedAt { get; set; }

        [ForeignKey("Notification")]
        public string? NotificationId { get; set; }
        public Notification? Notification { get; set; }

        public PostMessage? PostMessage { get; set; }
        public User? User { get; set; }
    }

}
