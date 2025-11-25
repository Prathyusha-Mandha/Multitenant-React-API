using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using Multitenant.Validators;
using Multitenant.Models.Enums;
using System.Text.Json.Serialization;

namespace Multitenant.DTO
{
    public class CreatePostMessageDto
    {
        [Required]
        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        [DisplayName("Department")]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public Department Department { get; set; } = Department.All;

        [PdfFile]
        public IFormFile? FileUpload { get; set; }
    }

    public class PostMessageResponseDto
    {
        public string PostMessageId { get; set; } = string.Empty;
        public string TenantId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public byte[]? FileUrl { get; set; }
        public int ReplyCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public IEnumerable<ResponseMessageResponseDto>? ResponseMessages { get; set; }
    }
}