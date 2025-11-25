using System.ComponentModel.DataAnnotations;
using Multitenant.Models;
using System.ComponentModel;
using Multitenant.Validators;
using System.Text.Json.Serialization;

namespace Multitenant.DTO
{
    public class CreateRegistrationRequestDto
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
        [MinLength(8)]
        [DataType(DataType.Password)]
        [DisplayName("Password")]
        public string Password { get; set; } = string.Empty;

        [Required]
        [Compare("Password")]
        [DataType(DataType.Password)]
        [DisplayName("Confirm Password")]
        public string ConfirmPassword { get; set; } = string.Empty;

        [Required]
        [DisplayName("Role")]
        public RegistrationRole Role { get; set; } = RegistrationRole.None;

        [DisplayName("Department")]
        public DepatmentType Department { get; set; } = DepatmentType.None;

        [Required]
        [MaxLength(200)]
        [DisplayName("Company Name")]
        public string CompanyName { get; set; } = string.Empty;
    }

    public class UpdateRegistrationStatusDto
    {
        [Required]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public RegistrationStatus Status { get; set; }
    }

    public class RegistrationRequestResponseDto
    {
        public string RegistrationId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string? AssignedManagerId { get; set; }
    }
}