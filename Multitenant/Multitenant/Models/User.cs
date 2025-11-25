using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Multitenant.Models
{
    public enum UserRole
    {
        Admin,
        Manager,
        DeptManager,
        Employee
    }

    public class User
    {
        [Key]
        public string? UserId { get; set; }

        [ForeignKey("Tenant")]
        public string? TenantId { get; set; }

        [MaxLength(100)]
        public string? DepartmentName { get; set; }

        [Required]
        [MaxLength(100)]
        public string? UserName { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(256)]
        public string? Email { get; set; }

        [Required] 
        public string? Password { get; set; }
        public byte[]? ProfilePicture { get; set; }

        [Required]
        public UserRole Role { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("ApprovedUser")]
        public string? RegistrationRequestId { get; set; }

        public Tenant? Tenant { get; set; }
        public RegistrationRequest? RegistrationRequest { get; set; } 
        public ICollection<PostMessage>? PostMessages { get; set; }
        public ICollection<ResponseMessage>? ResponseMessages { get; set; }
        public ICollection<Notification>? Notifications { get; set; }

        [InverseProperty("SenderUser")]
        public ICollection<Chat>? SentChats { get; set; }

        [InverseProperty("ReceiverUser")]
        public ICollection<Chat>? ReceivedChats { get; set; }
    }


}
