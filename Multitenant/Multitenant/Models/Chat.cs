using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Multitenant.Models
{
    public class Chat
    {
        [Key]
        public string? ChatId { get; set; }

        [Required]
        [ForeignKey("SenderUser")]
        public string? SenderUserId { get; set; }

        [Required]
        [ForeignKey("ReceiverUser")]
        public string? ReceiverUserId { get; set; }

        [Required]
        public string? Message { get; set; }
        public byte[]? FileUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsRead { get; set; } = false;

        public User? SenderUser { get; set; }
        public User? ReceiverUser { get; set; }
    }

}
