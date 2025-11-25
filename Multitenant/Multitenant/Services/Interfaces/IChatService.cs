using Multitenant.DTO;

namespace Multitenant.Services.Interfaces
{
    public interface IChatService
    {
        Task<IEnumerable<ChatResponseDto>> GetConversationAsync(string senderId, string receiverId);
        Task<ChatResponseDto?> GetChatByIdAsync(string chatId, string currentUserId);
        Task<ChatResponseDto> SendMessageAsync(CreateChatDto createChatDto, string currentUserId);
        Task<bool> MarkAsReadAsync(string chatId, string currentUserId);
    }
}