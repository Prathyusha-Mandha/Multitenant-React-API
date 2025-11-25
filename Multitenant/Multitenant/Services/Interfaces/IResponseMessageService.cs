using Multitenant.DTO;

namespace Multitenant.Services.Interfaces
{
    public interface IResponseMessageService
    {
        Task<IEnumerable<ResponseMessageResponseDto>> GetResponseMessageByPostMessageIdAsync(string postMessageId, string currentUserId);
        Task<ResponseMessageResponseDto?> GetByResponseMessageIdAsync(string responseMessageId, string currentUserId);
        Task<ResponseMessageResponseDto?> AddResponseMessageAsync(CreateResponseMessageDto createResponseMessageDto, string currentUserId);
        Task<bool> DeleteByResponseMessageIdAsync(string responseMessageId, string currentUserId);
    }
}