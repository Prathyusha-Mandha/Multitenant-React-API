using System.ComponentModel.DataAnnotations;

namespace Multitenant.Models
{
    public class Tenant
    {
        [Key]
        public string? TenantId { get; set; }

        [Required]
        [MaxLength(200)]
        public string? TenantName { get; set; }
        public DateTime CreatedAt { get; set; }


        public ICollection<User>? Users { get; set; }
        public ICollection<PostMessage>? PostMessages { get; set; }
    }
}
