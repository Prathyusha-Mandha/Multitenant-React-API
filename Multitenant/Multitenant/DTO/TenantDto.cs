using System.ComponentModel.DataAnnotations;
using Multitenant.Validators;

namespace Multitenant.DTO
{
    public class CreateTenantDto
    {
        [Required]
        [MaxLength(200)]
        public string TenantName { get; set; } = string.Empty;
    }

    public class UpdateTenantDto
    {
        [MaxLength(200)]
        [UniqueTenantName]
        public string? TenantName { get; set; }
    }

    public class TenantResponseDto
    {
        public string TenantId { get; set; } = string.Empty;
        public string TenantName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class TenantWithUsersDto
    {
        public string TenantId { get; set; } = string.Empty;
        public string TenantName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public IEnumerable<UserResponseDto> Users { get; set; } = new List<UserResponseDto>();
        public int UserCount { get; set; }
    }
}