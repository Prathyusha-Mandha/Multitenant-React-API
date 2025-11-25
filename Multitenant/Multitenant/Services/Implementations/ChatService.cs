using Microsoft.EntityFrameworkCore;
using Multitenant.Data;
using Multitenant.DTO;
using Multitenant.Models;
using Multitenant.Services.Interfaces;
using Multitenant.Services;

namespace Multitenant.Services.Implementations
{
    public class ChatService : IChatService
    {
        private readonly MultitenantDbContext _context;

        public ChatService(MultitenantDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<ChatResponseDto>> GetConversationAsync(string senderId, string receiverId)
        {
            var senderUser = await _context.Users.FindAsync(senderId);
            var receiverUser = await _context.Users.FindAsync(receiverId);
            
            if (senderUser == null || receiverUser == null)
                throw new UnauthorizedAccessException("User not found");
                
            if (senderUser.Role == UserRole.Admin)
                throw new UnauthorizedAccessException("Admins cannot access chats");
                
            if (senderUser.TenantId != receiverUser.TenantId)
                throw new UnauthorizedAccessException("Can only chat with users from same tenant");

            var chats = await _context.Chats
                .Include(c => c.SenderUser)
                .Include(c => c.ReceiverUser)
                .Where(c => (c.SenderUserId == senderId && c.ReceiverUserId == receiverId) ||
                           (c.SenderUserId == receiverId && c.ReceiverUserId == senderId))
                .OrderBy(c => c.CreatedAt)
                .ToListAsync();

            return chats.Select(c => new ChatResponseDto
            {
                ChatId = c.ChatId!,
                SenderUserId = c.SenderUserId!,
                SenderUserName = c.SenderUser?.UserName ?? "",
                ReceiverUserId = c.ReceiverUserId!,
                ReceiverUserName = c.ReceiverUser?.UserName ?? "",
                Message = c.Message!,
                FileUrl = c.FileUrl,
                CreatedAt = c.CreatedAt,
                IsRead = c.IsRead
            });
        }

        public async Task<ChatResponseDto> SendMessageAsync(CreateChatDto createChatDto, string currentUserId)
        {
            var senderUser = await _context.Users
                .Include(u => u.Tenant)
                .FirstOrDefaultAsync(u => u.UserId == currentUserId);
                
            var receiverUser = await _context.Users.FindAsync(createChatDto.ReceiverUserId);
            
            if (senderUser == null || receiverUser == null)
                throw new UnauthorizedAccessException("User not found");
                
            if (senderUser.Role == UserRole.Admin)
                throw new UnauthorizedAccessException("Admins cannot send chat messages");
                
            if (senderUser.TenantId != receiverUser.TenantId)
                throw new UnauthorizedAccessException("Can only chat with users from same tenant");
            
            string companyName = senderUser.Tenant?.TenantName ?? "DEFAULT";

            byte[]? fileData = null;
            if (createChatDto.FileUpload != null)
            {
                using var memoryStream = new MemoryStream();
                await createChatDto.FileUpload.CopyToAsync(memoryStream);
                fileData = memoryStream.ToArray();
            }

            var chat = new Chat
            {
                ChatId = await IdGenerator.GenerateChatIdAsync(_context, companyName),
                SenderUserId = currentUserId,
                ReceiverUserId = createChatDto.ReceiverUserId,
                Message = createChatDto.Message,
                FileUrl = fileData,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            _context.Chats.Add(chat);
            await _context.SaveChangesAsync();

            chat.SenderUser = senderUser;
            chat.ReceiverUser = receiverUser;

            return new ChatResponseDto
            {
                ChatId = chat.ChatId!,
                SenderUserId = chat.SenderUserId!,
                SenderUserName = chat.SenderUser?.UserName ?? "",
                ReceiverUserId = chat.ReceiverUserId!,
                ReceiverUserName = chat.ReceiverUser?.UserName ?? "",
                Message = chat.Message!,
                FileUrl = chat.FileUrl,
                CreatedAt = chat.CreatedAt,
                IsRead = chat.IsRead
            };
        }

        public async Task<ChatResponseDto?> GetChatByIdAsync(string chatId, string currentUserId)
        {
            var currentUser = await _context.Users.FindAsync(currentUserId);
            if (currentUser == null) throw new UnauthorizedAccessException("User not found");
            
            if (currentUser.Role == UserRole.Admin)
                throw new UnauthorizedAccessException("Admins cannot access chats");

            var chat = await _context.Chats
                .Include(c => c.SenderUser)
                .Include(c => c.ReceiverUser)
                .FirstOrDefaultAsync(c => c.ChatId == chatId);

            if (chat == null) return null;

            // Check if user is part of this conversation and same tenant
            if ((chat.SenderUserId != currentUserId && chat.ReceiverUserId != currentUserId) ||
                (chat.SenderUser?.TenantId != currentUser.TenantId))
                throw new UnauthorizedAccessException("Access denied");

            return new ChatResponseDto
            {
                ChatId = chat.ChatId!,
                SenderUserId = chat.SenderUserId!,
                SenderUserName = chat.SenderUser?.UserName ?? "",
                ReceiverUserId = chat.ReceiverUserId!,
                ReceiverUserName = chat.ReceiverUser?.UserName ?? "",
                Message = chat.Message!,
                FileUrl = chat.FileUrl,
                CreatedAt = chat.CreatedAt,
                IsRead = chat.IsRead
            };
        }

        public async Task<bool> MarkAsReadAsync(string chatId, string currentUserId)
        {
            var chat = await _context.Chats.FindAsync(chatId);
            if (chat == null) return false;

            // Only receiver can mark message as read
            if (chat.ReceiverUserId != currentUserId)
                throw new UnauthorizedAccessException("Only the receiver can mark message as read");

            if (chat.IsRead)
                throw new InvalidOperationException("Message is already marked as read");

            chat.IsRead = true;
            _context.Chats.Update(chat);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}