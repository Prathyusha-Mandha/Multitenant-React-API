using System.ComponentModel.DataAnnotations;
using Multitenant.Models;
using System.ComponentModel;
using Multitenant.Validators;

namespace Multitenant.DTO
{
    public class CreateUserDto
    {
        [Required]
        [MaxLength(100)]
        [DisplayName("User Name")]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(256)]
        [DisplayName("Email Address")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        [DataType(DataType.Password)]
        [DisplayName("Password")]
        public string Password { get; set; } = string.Empty;

        [Required]
        [DisplayName("Tenant ID")]
        public string TenantId { get; set; } = string.Empty;

        [MaxLength(100)]
        [DisplayName("Department Name")]
        public string? DepartmentName { get; set; }

        [Required]
        [DisplayName("Role")]
        public UserRole Role { get; set; }

        [DataType(DataType.Upload)]
        [DisplayName("Profile Picture")]
        [ImageUpload]
        public IFormFile? ProfilePicture { get; set; }
    }

    public class UpdateUserDto
    {
        [MaxLength(100)]
        [DisplayName("User Name")]
        public string? UserName { get; set; }

        [EmailAddress]
        [MaxLength(256)]
        [DisplayName("Email Address")]
        public string? Email { get; set; }
        
        [DataType(DataType.Upload)]
        [DisplayName("Profile Picture")]
        [ImageUpload]
        public IFormFile? ProfilePicture { get; set; }
    }

    public class UpdateSelfDto
    {
        [MaxLength(100)]
        [DisplayName("User Name")]
        public string? UserName { get; set; }

        [EmailAddress]
        [MaxLength(256)]
        [DisplayName("Email Address")]
        public string? Email { get; set; }
        
        [DataType(DataType.Upload)]
        [DisplayName("Profile Picture")]
        [ImageUpload]
        public IFormFile? ProfilePicture { get; set; }
    }

    public class UserResponseDto
    {
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? DepartmentName { get; set; }
        public string Role { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string? TenantId { get; set; }
        public string? TenantName { get; set; }
        public byte[]? ProfilePicture { get; set; }
    }
}