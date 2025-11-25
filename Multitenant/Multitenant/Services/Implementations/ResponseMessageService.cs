using Microsoft.EntityFrameworkCore;
using Multitenant.Data;
using Multitenant.DTO;
using Multitenant.Models;
using Multitenant.Services.Interfaces;
using Multitenant.Services;
using Multitenant.Models.Enums;

namespace Multitenant.Services.Implementations
{
    public class ResponseMessageService : IResponseMessageService
    {
        private readonly MultitenantDbContext _context;

        public ResponseMessageService(MultitenantDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<ResponseMessageResponseDto>> GetResponseMessageByPostMessageIdAsync(string postMessageId, string currentUserId)
        {
            var currentUser = await _context.Users.FindAsync(currentUserId);
            if (currentUser == null) throw new UnauthorizedAccessException("User not found");
            
            if (currentUser.Role == UserRole.Admin)
                throw new UnauthorizedAccessException("Admins cannot access response messages");

            var post = await _context.PostMessages
                .FirstOrDefaultAsync(p => p.PostMessageId == postMessageId && p.TenantId == currentUser.TenantId);

            if (post == null) throw new Exception("Post not found");

            // Check if user can see this post (same logic as PostMessage access)
            if (currentUser.Role != UserRole.Manager)
            {
                if (post.Department != Department.All && post.Department.ToString() != currentUser.DepartmentName)
                    throw new UnauthorizedAccessException("Access denied");
            }

            var responses = await _context.ResponseMessages
                .Include(r => r.User)
                .Where(r => r.PostMessageId == postMessageId)
                .OrderBy(r => r.RepliedAt)
                .ToListAsync();

            return responses.Select(r => new ResponseMessageResponseDto
            {
                ResponseMessageId = r.ResponseMessageId!,
                PostMessageId = r.PostMessageId!,
                UserId = r.UserId!,
                UserName = r.User?.UserName ?? "",
                ReplyText = r.ReplyText!,
                FileUrl = r.FileUrl,
                RepliedAt = r.RepliedAt
            });
        }

        public async Task<ResponseMessageResponseDto?> AddResponseMessageAsync(CreateResponseMessageDto createResponseMessageDto, string currentUserId)
        {
            var currentUser = await _context.Users
                .Include(u => u.Tenant)
                .FirstOrDefaultAsync(u => u.UserId == currentUserId);
            if (currentUser == null) throw new UnauthorizedAccessException("User not found");
            
            if (currentUser.Role == UserRole.Admin)
                throw new UnauthorizedAccessException("Admins cannot create response messages");

            var post = await _context.PostMessages
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.PostMessageId == createResponseMessageDto.PostMessageId && p.TenantId == currentUser.TenantId);
            
            if (post == null) throw new Exception("Post not found");

            // Check if user can see this post (same logic as PostMessage access)
            if (currentUser.Role != UserRole.Manager)
            {
                if (post.Department != Department.All && post.Department.ToString() != currentUser.DepartmentName)
                    throw new UnauthorizedAccessException("Cannot reply to this post");
            }

            byte[]? fileData = null;
            if (createResponseMessageDto.FileUpload != null)
            {
                using var memoryStream = new MemoryStream();
                await createResponseMessageDto.FileUpload.CopyToAsync(memoryStream);
                fileData = memoryStream.ToArray();
            }

            string companyName = currentUser.Tenant?.TenantName ?? "DEFAULT";

            var responseMessage = new ResponseMessage
            {
                ResponseMessageId = await IdGenerator.GenerateResponseIdAsync(_context, companyName),
                PostMessageId = createResponseMessageDto.PostMessageId,
                UserId = currentUserId,
                ReplyText = createResponseMessageDto.ReplyText,
                FileUrl = fileData,
                RepliedAt = DateTime.UtcNow
            };

            _context.ResponseMessages.Add(responseMessage);

            post.ReplyCount++;
            _context.PostMessages.Update(post);

            if (!string.IsNullOrEmpty(post.UserId) && post.UserId != currentUserId)
            {
                var notificationId = await IdGenerator.GenerateNotificationIdAsync(_context);
                var notification = new Notification
                {
                    NotificationId = notificationId,
                    UserId = post.UserId,
                    NotificationMessage = "Someone replied to your post",
                    CreatedAt = DateTime.UtcNow,
                    IsRead = false
                };
                _context.Notifications.Add(notification);
                responseMessage.NotificationId = notificationId;
            }

            await _context.SaveChangesAsync();

            return new ResponseMessageResponseDto
            {
                ResponseMessageId = responseMessage.ResponseMessageId!,
                PostMessageId = responseMessage.PostMessageId!,
                UserId = responseMessage.UserId!,
                UserName = currentUser.UserName ?? "",
                ReplyText = responseMessage.ReplyText!,
                FileUrl = responseMessage.FileUrl,
                RepliedAt = responseMessage.RepliedAt
            };
        }

        public async Task<ResponseMessageResponseDto?> GetByResponseMessageIdAsync(string responseMessageId, string currentUserId)
        {
            var currentUser = await _context.Users.FindAsync(currentUserId);
            if (currentUser == null) throw new UnauthorizedAccessException("User not found");
            
            if (currentUser.Role == UserRole.Admin)
                throw new UnauthorizedAccessException("Admins cannot access response messages");

            var response = await _context.ResponseMessages
                .Include(r => r.User)
                .Include(r => r.PostMessage)
                .FirstOrDefaultAsync(r => r.ResponseMessageId == responseMessageId);

            if (response == null) return null;

            if (response.PostMessage?.TenantId != currentUser.TenantId)
                throw new UnauthorizedAccessException("Access denied");

            return new ResponseMessageResponseDto
            {
                ResponseMessageId = response.ResponseMessageId!,
                PostMessageId = response.PostMessageId!,
                UserId = response.UserId!,
                UserName = response.User?.UserName ?? "",
                ReplyText = response.ReplyText!,
                FileUrl = response.FileUrl,
                RepliedAt = response.RepliedAt
            };
        }

        public async Task<bool> DeleteByResponseMessageIdAsync(string responseMessageId, string currentUserId)
        {
            var currentUser = await _context.Users.FindAsync(currentUserId);
            if (currentUser?.Role == UserRole.Admin)
                throw new UnauthorizedAccessException("Admins cannot access response messages");
                
            var response = await _context.ResponseMessages.FindAsync(responseMessageId);
            if (response == null) throw new Exception("Response not found");

            if (response.UserId != currentUserId)
                throw new UnauthorizedAccessException("Can only delete your own responses");

            var post = await _context.PostMessages.FindAsync(response.PostMessageId);
            if (post != null && post.ReplyCount > 0)
            {
                post.ReplyCount--;
                _context.PostMessages.Update(post);
            }

            _context.ResponseMessages.Remove(response);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}