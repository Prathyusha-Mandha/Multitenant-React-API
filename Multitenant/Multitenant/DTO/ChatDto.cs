using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel;

namespace Multitenant.DTO
{
    public class CreateChatDto
    {
        [Required]
        [DisplayName("Receiver User ID")]
        public string ReceiverUserId { get; set; } = string.Empty;

        [Required]
        [MaxLength(1000)]
        [DataType(DataType.MultilineText)]
        [DisplayName("Message")]
        public string Message { get; set; } = string.Empty;

        [DisplayName("File")]
        public IFormFile? FileUpload { get; set; }
    }

    public class ChatResponseDto
    {
        public string ChatId { get; set; } = string.Empty;
        public string SenderUserId { get; set; } = string.Empty;
        public string SenderUserName { get; set; } = string.Empty;
        public string ReceiverUserId { get; set; } = string.Empty;
        public string ReceiverUserName { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public byte[]? FileUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsRead { get; set; }
    }
}