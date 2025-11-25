using System.ComponentModel.DataAnnotations;
using Multitenant.Validators;

namespace Multitenant.DTO
{
    public class CreateResponseMessageDto
    {
        [Required]
        public string PostMessageId { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string ReplyText { get; set; } = string.Empty;

        [PdfFile]
        public IFormFile? FileUpload { get; set; }
    }

    public class ResponseMessageResponseDto
    {
        public string ResponseMessageId { get; set; } = string.Empty;
        public string PostMessageId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string ReplyText { get; set; } = string.Empty;
        public byte[]? FileUrl { get; set; }
        public DateTime RepliedAt { get; set; }
    }
}