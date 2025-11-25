using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Multitenant.Models
{
    public enum RegistrationStatus
    {
        Pending,
        Accepted,
        Rejected
    }

    public enum RegistrationRole
    {
        None = 0,
        Manager,
        DeptManager,
        Employee
    }

    public enum DepatmentType
    {
        None = 0,
        HR,
        IT,
        Sales,
        Marketing,
        Finance,
        CustomerSupport
    }

    public class RegistrationRequest
    {
        [Key]
        public string? RegistrationId { get; set; }

        [Required]
        [MaxLength(100)]
        public string? UserName { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(256)]
        public string? Email { get; set; }

        [Required]
        public string? Password { get; set; }
        public string? ConfirmPassword { get; set; }

        [Required]
        public RegistrationRole Role { get; set; }

        [Required]
        public DepatmentType Department { get; set; }

        [ForeignKey("Notification")]
        public string? NotificationId { get; set; }
        public Notification? Notification { get; set; }

        [Required]
        [MaxLength(200)]
        public string? CompanyName { get; set; }

        [Required]
        public RegistrationStatus Status { get; set; } = RegistrationStatus.Pending;
        public DateTime CreatedAt { get; set; }
        
        public string? AssignedManagerId { get; set; }

        public User? ApprovedUser { get; set; }
    }
}
