using Multitenant.Models.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Multitenant.Models
{
    public class PostMessage
    {
        [Key]
        public string? PostMessageId { get; set; }

        [Required]
        [ForeignKey("Tenant")]
        public string? TenantId { get; set; }
        
        [Required]
        [ForeignKey("User")]
        public string? UserId { get; set; }

        [Required]
        public string? Description { get; set; }

        public Department Department { get; set; } = Department.All;

        public byte[]? FileUrl { get; set; }
        public int ReplyCount { get; set; } = 0;
        public DateTime CreatedAt { get; set; }

        public Tenant? Tenant { get; set; }
        public User? User { get; set; }
        public ICollection<ResponseMessage>? ResponseMessages { get; set; }
    }

}
