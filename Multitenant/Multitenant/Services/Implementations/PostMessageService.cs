using Microsoft.EntityFrameworkCore;
using Multitenant.Data;
using Multitenant.DTO;
using Multitenant.Models;
using Multitenant.Services.Interfaces;
using Multitenant.Services;
using Multitenant.Models.Enums;

namespace Multitenant.Services.Implementations
{
    public class PostMessageService : IPostMessageService
    {
        private readonly MultitenantDbContext _context;

        public PostMessageService(MultitenantDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<PostMessageResponseDto>> GetAllAsync(string currentUserId)
        {
            var currentUser = await _context.Users.FindAsync(currentUserId);
            if (currentUser == null) throw new UnauthorizedAccessException("User not found");
            
            if (currentUser.Role == UserRole.Admin)
                throw new UnauthorizedAccessException("Admins cannot access post messages");

            IQueryable<PostMessage> query = _context.PostMessages
                .Include(p => p.User)
                .Include(p => p.ResponseMessages)
                .Where(p => p.TenantId == currentUser.TenantId);

            if (currentUser.Role == UserRole.Manager)
            {
                // Manager can see all messages in tenant
            }
            else
            {
                // Employee/DeptManager can only see messages for their department or "All"
                query = query.Where(p => p.Department == Department.All || p.Department.ToString() == currentUser.DepartmentName);
            }

            var posts = await query.OrderByDescending(p => p.CreatedAt).ToListAsync();

            return posts.Select(p => new PostMessageResponseDto
            {
                PostMessageId = p.PostMessageId!,
                TenantId = p.TenantId!,
                UserId = p.UserId!,
                UserName = p.User?.UserName ?? "",
                Description = p.Description!,
                Department = p.Department.ToString(),
                FileUrl = p.FileUrl,
                ReplyCount = p.ReplyCount,
                CreatedAt = p.CreatedAt,
                ResponseMessages = p.ResponseMessages?.Select(r => new ResponseMessageResponseDto
                {
                    ResponseMessageId = r.ResponseMessageId!,
                    PostMessageId = r.PostMessageId!,
                    UserId = r.UserId!,
                    UserName = r.User?.UserName ?? "",
                    ReplyText = r.ReplyText!,
                    FileUrl = r.FileUrl,
                    RepliedAt = r.RepliedAt
                })
            });
        }

        public async Task<PostMessageResponseDto?> GetByPostMessageIdAsync(string postMessageId, string currentUserId)
        {
            var currentUser = await _context.Users.FindAsync(currentUserId);
            if (currentUser == null) throw new UnauthorizedAccessException("User not found");
            
            if (currentUser.Role == UserRole.Admin)
                throw new UnauthorizedAccessException("Admins cannot access post messages");

            var post = await _context.PostMessages
                .Include(p => p.User)
                .Include(p => p.ResponseMessages)
                .FirstOrDefaultAsync(p => p.PostMessageId == postMessageId && p.TenantId == currentUser.TenantId);

            if (post == null) throw new Exception("not found");

            // Check department access for non-managers
            if (currentUser.Role != UserRole.Manager)
            {
                if (post.Department != Department.All && post.Department.ToString() != currentUser.DepartmentName)
                    throw new UnauthorizedAccessException("Access denied");
            }

            return new PostMessageResponseDto
            {
                PostMessageId = post.PostMessageId!,
                TenantId = post.TenantId!,
                UserId = post.UserId!,
                UserName = post.User?.UserName ?? "",
                Description = post.Description!,
                Department = post.Department.ToString(),
                FileUrl = post.FileUrl,
                ReplyCount = post.ReplyCount,
                CreatedAt = post.CreatedAt,
                ResponseMessages = post.ResponseMessages?.Select(r => new ResponseMessageResponseDto
                {
                    ResponseMessageId = r.ResponseMessageId!,
                    PostMessageId = r.PostMessageId!,
                    UserId = r.UserId!,
                    UserName = r.User?.UserName ?? "",
                    ReplyText = r.ReplyText!,
                    FileUrl = r.FileUrl,
                    RepliedAt = r.RepliedAt
                })
            };
        }

        public async Task<int> GetResponseCountAsync(string postMessageId, string currentUserId)
        {
            var currentUser = await _context.Users.FindAsync(currentUserId);
            if (currentUser == null) throw new UnauthorizedAccessException("User not found");
            
            if (currentUser.Role == UserRole.Admin)
                throw new UnauthorizedAccessException("Admins cannot access post messages");

            var post = await _context.PostMessages
                .FirstOrDefaultAsync(p => p.PostMessageId == postMessageId && p.UserId == currentUserId);

            if (post == null) throw new UnauthorizedAccessException("Can only view response count for your own messages");

            return post.ReplyCount;
        }

        public async Task<IEnumerable<PostMessageResponseDto>> GetPostMessageByUserIdAsync(string userId)
        {
            var posts = await _context.PostMessages
                .Include(p => p.ResponseMessages)
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return posts.Select(p => new PostMessageResponseDto
            {
                PostMessageId = p.PostMessageId!,
                TenantId = p.TenantId!,
                UserId = p.UserId!,
                UserName = p.User?.UserName ?? "",
                Description = p.Description!,
                Department = p.Department.ToString(),
                FileUrl = p.FileUrl,
                ReplyCount = p.ReplyCount,
                CreatedAt = p.CreatedAt
            });
        }

        public async Task<PostMessageResponseDto> AddPostMessageAsync(CreatePostMessageDto createPostMessageDto, string currentUserId)
        {
            var user = await _context.Users
                .Include(u => u.Tenant)
                .FirstOrDefaultAsync(u => u.UserId == currentUserId);
            
            if (user?.Role == UserRole.Admin)
                throw new UnauthorizedAccessException("Admins cannot create post messages");
            
            string companyName = user?.Tenant?.TenantName ?? "DEFAULT";

            byte[]? fileData = null;
            if (createPostMessageDto.FileUpload != null)
            {
                using var memoryStream = new MemoryStream();
                await createPostMessageDto.FileUpload.CopyToAsync(memoryStream);
                fileData = memoryStream.ToArray();
            }

            var postMessage = new PostMessage
            {
                PostMessageId = await IdGenerator.GeneratePostIdAsync(_context, companyName),
                TenantId = user?.TenantId,
                UserId = currentUserId,
                Description = createPostMessageDto.Description,
                Department = createPostMessageDto.Department,
                FileUrl = fileData,
                CreatedAt = DateTime.UtcNow,
                ReplyCount = 0
            };

            _context.PostMessages.Add(postMessage);
            await _context.SaveChangesAsync();
            return new PostMessageResponseDto
            {
                PostMessageId = postMessage.PostMessageId!,
                TenantId = postMessage.TenantId!,
                UserId = postMessage.UserId!,
                UserName = user?.UserName ?? "",
                Description = postMessage.Description!,
                Department = postMessage.Department.ToString(),
                FileUrl = postMessage.FileUrl,
                ReplyCount = postMessage.ReplyCount,
                CreatedAt = postMessage.CreatedAt
            };
        }


    }
}