using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Multitenant.Models
{
    public class Notification
    {
        [Key]
        public string? NotificationId { get; set; }

        [Required]
        [ForeignKey("User")]
        public string? UserId { get; set; }

        [Required]
        public string? NotificationMessage { get; set; }

        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; }

        public User? User { get; set; }
    }

}
