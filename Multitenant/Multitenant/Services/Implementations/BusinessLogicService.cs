using Microsoft.EntityFrameworkCore;
using Multitenant.Data;
using Multitenant.Models;
using Multitenant.Services.Interfaces;

namespace Multitenant.Services.Implementations
{
    public class BusinessLogicService : IBusinessLogicService
    {
        private readonly MultitenantDbContext _context;

        public BusinessLogicService(MultitenantDbContext context)
        {
            _context = context;
        }

        public async Task<ResponseMessage> AddResponseWithNotificationAsync(string postMessageId, ResponseMessage responseMessage)
        {
            var post = await _context.PostMessages
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.PostMessageId == postMessageId);
            
            if (post == null)
                throw new ArgumentException("Post message not found");

            responseMessage.PostMessageId = postMessageId;
            responseMessage.ResponseMessageId = "R" + Random.Shared.Next(1000, 9999).ToString();
            responseMessage.RepliedAt = DateTime.UtcNow;

            _context.ResponseMessages.Add(responseMessage);

            post.ReplyCount++;
            _context.PostMessages.Update(post);

            if (post.UserId != responseMessage.UserId)
            {
                var notification = new Notification
                {
                    NotificationId = "N" + Random.Shared.Next(1000, 9999).ToString(),
                    UserId = post.UserId,
                    NotificationMessage = $"Someone replied to your post",
                    CreatedAt = DateTime.UtcNow,
                    IsRead = false
                };
                _context.Notifications.Add(notification);
                responseMessage.NotificationId = notification.NotificationId;
            }

            await _context.SaveChangesAsync();
            return responseMessage;
        }

        public async Task<User> CreateUserFromRegistrationAsync(RegistrationRequest registrationRequest)
        {
            if (registrationRequest.Status != RegistrationStatus.Accepted)
                throw new InvalidOperationException("Registration request must be accepted");

            var user = new User
            {
                UserId = await IdGenerator.GenerateUserIdAsync(_context, registrationRequest.Role == RegistrationRole.Manager ? UserRole.Manager : UserRole.Employee),
                UserName = registrationRequest.UserName,
                Email = registrationRequest.Email,
                Password = registrationRequest.Password,
                Role = registrationRequest.Role == RegistrationRole.Manager ? UserRole.Manager : UserRole.Employee,
                DepartmentName = registrationRequest.Department.ToString(),
                CreatedAt = DateTime.UtcNow,
                RegistrationRequestId = registrationRequest.RegistrationId
            };

            var tenant = await _context.Tenants
                .FirstOrDefaultAsync(t => t.TenantName == registrationRequest.CompanyName);
            
            if (tenant != null)
            {
                user.TenantId = tenant.TenantId;
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<Tenant> CreateTenantFromRegistrationAsync(RegistrationRequest registrationRequest)
        {
            if (registrationRequest.Role != RegistrationRole.Manager)
                throw new InvalidOperationException("Only manager registrations can create tenants");

            if (registrationRequest.Status != RegistrationStatus.Accepted)
                throw new InvalidOperationException("Registration request must be accepted");

            var existingTenant = await _context.Tenants
                .FirstOrDefaultAsync(t => t.TenantName == registrationRequest.CompanyName);
            
            if (existingTenant != null)
                return existingTenant;

            var tenant = new Tenant
            {
                TenantId = "T" + Random.Shared.Next(1000, 9999).ToString(),
                TenantName = registrationRequest.CompanyName,
                CreatedAt = DateTime.UtcNow
            };

            _context.Tenants.Add(tenant);
            await _context.SaveChangesAsync();
            return tenant;
        }

        public async Task ValidateRegistrationUniquenessAsync(RegistrationRequest registrationRequest)
        {
            if (registrationRequest.Role == RegistrationRole.Manager)
            {
                var existingManager = await _context.Users
                    .Include(u => u.Tenant)
                    .FirstOrDefaultAsync(u => u.Role == UserRole.Manager && u.Tenant!.TenantName == registrationRequest.CompanyName);
                if (existingManager != null)
                    throw new InvalidOperationException($"A manager already exists for company '{registrationRequest.CompanyName}'");
            }
            else if (registrationRequest.Role == RegistrationRole.DeptManager)
            {
                var existingDeptManager = await _context.Users
                    .Include(u => u.Tenant)
                    .FirstOrDefaultAsync(u => u.Role == UserRole.DeptManager && 
                                            u.Tenant!.TenantName == registrationRequest.CompanyName &&
                                            u.DepartmentName == registrationRequest.Department.ToString());
                if (existingDeptManager != null)
                    throw new InvalidOperationException($"A department manager already exists for {registrationRequest.Department} department in company '{registrationRequest.CompanyName}'");
            }
        }

        public async Task<bool> CanApproveRequestAsync(string approverId, RegistrationRequest registrationRequest)
        {
            var approver = await _context.Users
                .Include(u => u.Tenant)
                .FirstOrDefaultAsync(u => u.UserId == approverId);
            
            if (approver == null) return false;

            return registrationRequest.Role switch
            {
                RegistrationRole.Manager => approver.Role == UserRole.Admin,
                RegistrationRole.DeptManager => approver.Role == UserRole.Manager && 
                                              approver.Tenant?.TenantName == registrationRequest.CompanyName,
                RegistrationRole.Employee => approver.Role == UserRole.DeptManager && 
                                           approver.Tenant?.TenantName == registrationRequest.CompanyName &&
                                           approver.DepartmentName == registrationRequest.Department.ToString(),
                _ => false
            };
        }
    }
}