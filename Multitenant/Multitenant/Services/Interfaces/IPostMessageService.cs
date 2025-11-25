using Multitenant.DTO;

namespace Multitenant.Services.Interfaces
{
    public interface IPostMessageService
    {
        Task<IEnumerable<PostMessageResponseDto>> GetAllAsync(string currentUserId);
        Task<PostMessageResponseDto?> GetByPostMessageIdAsync(string postMessageId, string currentUserId);
        Task<IEnumerable<PostMessageResponseDto>> GetPostMessageByUserIdAsync(string userId);
        Task<int> GetResponseCountAsync(string postMessageId, string currentUserId);
        Task<PostMessageResponseDto> AddPostMessageAsync(CreatePostMessageDto createPostMessageDto, string currentUserId);
    }
}