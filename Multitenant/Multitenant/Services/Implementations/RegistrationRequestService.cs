using Microsoft.EntityFrameworkCore;
using Multitenant.Data;
using Multitenant.DTO;
using Multitenant.Models;
using Multitenant.Services.Interfaces;
using Multitenant.Services;
using Multitenant.Validators;

namespace Multitenant.Services.Implementations
{
    public class RegistrationRequestService : IRegistrationRequestService
    {
        private readonly MultitenantDbContext _context;
        private readonly RegistrationRequestValidator _validator;
        private readonly IEmailService _emailService;

        public RegistrationRequestService(MultitenantDbContext context, RegistrationRequestValidator validator, IEmailService emailService)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _validator = validator ?? throw new ArgumentNullException(nameof(validator));
            _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
        }

        public async Task<IEnumerable<RegistrationRequestResponseDto>> GetAllAsync(string userId)
        {
            var user = await _context.Users.Include(u => u.Tenant).FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null) return Enumerable.Empty<RegistrationRequestResponseDto>();

            IQueryable<RegistrationRequest> query = _context.RegistrationRequests;

            if (user.Role == UserRole.Admin)
            {
                query = query.Where(r => r.Role == RegistrationRole.Manager);
            }
            else if (user.Role == UserRole.Manager)
            {
                query = query.Where(r => r.Role == RegistrationRole.DeptManager && r.CompanyName == user.Tenant!.TenantName);
            }
            else if (user.Role == UserRole.DeptManager)
            {
                query = query.Where(r => r.Role == RegistrationRole.Employee && 
                                        r.CompanyName == user.Tenant!.TenantName &&
                                        r.Department.ToString() == user.DepartmentName);
            }
            else
            {
                return Enumerable.Empty<RegistrationRequestResponseDto>();
            }

            var requests = await query.OrderByDescending(r => r.CreatedAt).ToListAsync();

            return requests.Select(r => new RegistrationRequestResponseDto
            {
                RegistrationId = r.RegistrationId!,
                UserName = r.UserName!,
                Email = r.Email!,
                Role = r.Role.ToString(),
                Department = r.Department.ToString(),
                CompanyName = r.CompanyName!,
                Status = r.Status.ToString(),
                CreatedAt = r.CreatedAt,
                AssignedManagerId = r.AssignedManagerId
            });
        }

        public async Task<RegistrationRequestResponseDto?> GetByRegistrationRequestIdAsync(string registrationRequestId)
        {
            var request = await _context.RegistrationRequests
                .Include(r => r.ApprovedUser)
                .Include(r => r.Notification)
                .FirstOrDefaultAsync(r => r.RegistrationId == registrationRequestId);

            if (request == null) throw new Exception("not found");

            return new RegistrationRequestResponseDto
            {
                RegistrationId = request.RegistrationId!,
                UserName = request.UserName!,
                Email = request.Email!,
                Role = request.Role.ToString(),
                Department = request.Department.ToString(),
                CompanyName = request.CompanyName!,
                Status = request.Status.ToString(),
                CreatedAt = request.CreatedAt,
                AssignedManagerId = request.AssignedManagerId
            };
        }

        public async Task<IEnumerable<RegistrationRequestResponseDto>> GetByDepartmentNameAsync(DepatmentType departmentName, string userId)
        {
            var filteredRequests = await GetAllAsync(userId);
            return filteredRequests.Where(r => r.Department == departmentName.ToString());
        }

        public async Task<IEnumerable<RegistrationRequestResponseDto>> GetByCompanyNameAsync(string companyName, string userId)
        {
            var filteredRequests = await GetAllAsync(userId);
            return filteredRequests.Where(r => r.CompanyName == companyName);
        }

        public async Task<IEnumerable<RegistrationRequestResponseDto>> GetByStatusAsync(RegistrationStatus status, string userId)
        {
            var filteredRequests = await GetAllAsync(userId);
            return filteredRequests.Where(r => r.Status == status.ToString());
        }

        public async Task<RegistrationRequestResponseDto> AddRegistrationRequestAsync(CreateRegistrationRequestDto createRegistrationRequestDto)
        {
            await _validator.ValidateEmailAsync(createRegistrationRequestDto.Email!);
            _validator.ValidatePassword(createRegistrationRequestDto.Password!);
            
            _validator.ValidateRoleBasedFields(createRegistrationRequestDto.Role, createRegistrationRequestDto.Department, createRegistrationRequestDto.CompanyName!);
            
            await _validator.ValidateCompanyExistsAsync(createRegistrationRequestDto.CompanyName!, createRegistrationRequestDto.Role);
            
            await _validator.ValidateDeptManagerUniquenessAsync(createRegistrationRequestDto.CompanyName!, createRegistrationRequestDto.Department, createRegistrationRequestDto.Role);
            
            await _validator.ValidateExistingRegistrationRequestAsync(createRegistrationRequestDto.CompanyName!, createRegistrationRequestDto.Role, createRegistrationRequestDto.Department);
            
            await _validator.ValidateDepartmentManagerExistsAsync(createRegistrationRequestDto.CompanyName!, createRegistrationRequestDto.Department, createRegistrationRequestDto.Role);

            var registrationRequest = new RegistrationRequest
            {
                RegistrationId = await IdGenerator.GenerateRegistrationIdAsync(_context),
                UserName = createRegistrationRequestDto.UserName,
                Email = createRegistrationRequestDto.Email,
                Password = createRegistrationRequestDto.Password,
                ConfirmPassword = createRegistrationRequestDto.ConfirmPassword,
                Role = createRegistrationRequestDto.Role,
                Department = createRegistrationRequestDto.Department,
                CompanyName = createRegistrationRequestDto.CompanyName,
                CreatedAt = DateTime.UtcNow,
                Status = RegistrationStatus.Pending
            };

            _context.RegistrationRequests.Add(registrationRequest);
            await _context.SaveChangesAsync();

            var notification = new Notification
            {
                NotificationId = await IdGenerator.GenerateNotificationIdAsync(_context),
                NotificationMessage = $"New {registrationRequest.Role.ToString().ToLower()} registration request from {registrationRequest.UserName}",
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            if (registrationRequest.Role == RegistrationRole.Manager)
            {
                var admin = await _context.Users.FirstOrDefaultAsync(u => u.Role == UserRole.Admin);
                if (admin != null)
                {
                    notification.UserId = admin.UserId;
                    registrationRequest.AssignedManagerId = admin.UserId;
                    _context.Notifications.Add(notification);
                }
            }
            else if (registrationRequest.Role == RegistrationRole.DeptManager)
            {
                var manager = await _context.Users
                    .Include(u => u.Tenant)
                    .FirstOrDefaultAsync(u => u.Role == UserRole.Manager && u.Tenant!.TenantName == registrationRequest.CompanyName);
                if (manager != null)
                {
                    notification.UserId = manager.UserId;
                    registrationRequest.AssignedManagerId = manager.UserId;
                    _context.Notifications.Add(notification);
                }
            }
            else if (registrationRequest.Role == RegistrationRole.Employee)
            {
                var deptManager = await _context.Users
                    .Include(u => u.Tenant)
                    .FirstOrDefaultAsync(u => u.Role == UserRole.DeptManager && 
                                            u.Tenant!.TenantName == registrationRequest.CompanyName &&
                                            u.DepartmentName == registrationRequest.Department.ToString());
                if (deptManager != null)
                {
                    notification.UserId = deptManager.UserId;
                    registrationRequest.AssignedManagerId = deptManager.UserId;
                    _context.Notifications.Add(notification);
                }
            }

            await _context.SaveChangesAsync();

            return new RegistrationRequestResponseDto
            {
                RegistrationId = registrationRequest.RegistrationId!,
                UserName = registrationRequest.UserName!,
                Email = registrationRequest.Email!,
                Role = registrationRequest.Role.ToString(),
                Department = registrationRequest.Department.ToString(),
                CompanyName = registrationRequest.CompanyName!,
                Status = registrationRequest.Status.ToString(),
                CreatedAt = registrationRequest.CreatedAt,
                AssignedManagerId = registrationRequest.AssignedManagerId
            };
        }

        public async Task<RegistrationRequestResponseDto?> UpdateStatusAsync(string registrationRequestId, UpdateRegistrationStatusDto updateStatusDto)
        {
            return await UpdateStatusAsync(registrationRequestId, updateStatusDto, null);
        }

        public async Task<RegistrationRequestResponseDto?> UpdateStatusAsync(string registrationRequestId, UpdateRegistrationStatusDto updateStatusDto, string approverId)
        {
            var registrationRequest = await _context.RegistrationRequests.FindAsync(registrationRequestId);
            if (registrationRequest == null) throw new Exception("not found");

            if (registrationRequest.Status != RegistrationStatus.Pending)
                throw new InvalidOperationException("Already responded to this request");

            if (!string.IsNullOrEmpty(approverId))
            {
                var approver = await _context.Users
                    .Include(u => u.Tenant)
                    .FirstOrDefaultAsync(u => u.UserId == approverId);
                
                if (approver == null) return null;

                if (registrationRequest.Role == RegistrationRole.Manager && approver.Role != UserRole.Admin)
                    return null;

                if (registrationRequest.Role == RegistrationRole.DeptManager && 
                    (approver.Role != UserRole.Manager || approver.Tenant?.TenantName != registrationRequest.CompanyName))
                    return null;

                if (registrationRequest.Role == RegistrationRole.Employee && 
                    (approver.Role != UserRole.DeptManager || 
                     approver.Tenant?.TenantName != registrationRequest.CompanyName ||
                     approver.DepartmentName != registrationRequest.Department.ToString()))
                    return null;
            }

            if (updateStatusDto.Status == RegistrationStatus.Accepted)
            {
                if (registrationRequest.Role == RegistrationRole.Manager)
                {
                    var existingManager = await _context.Users
                        .Include(u => u.Tenant)
                        .FirstOrDefaultAsync(u => u.Role == UserRole.Manager && u.Tenant!.TenantName == registrationRequest.CompanyName);
                    if (existingManager != null)
                        throw new InvalidOperationException($"A manager already exists for company '{registrationRequest.CompanyName}'");
                }

                if (registrationRequest.Role == RegistrationRole.DeptManager)
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

            registrationRequest.Status = updateStatusDto.Status;
            _context.RegistrationRequests.Update(registrationRequest);

            string? userId = null;
            if (updateStatusDto.Status == RegistrationStatus.Accepted)
            {
                UserRole userRole = registrationRequest.Role switch
                {
                    RegistrationRole.Manager => UserRole.Manager,
                    RegistrationRole.DeptManager => UserRole.DeptManager,
                    RegistrationRole.Employee => UserRole.Employee,
                    _ => UserRole.Employee
                };
                userId = await IdGenerator.GenerateUserIdAsync(_context, userRole, registrationRequest.CompanyName!);
            }

            await _emailService.SendRegistrationStatusEmailAsync(
                registrationRequest.Email!, 
                registrationRequest.UserName!, 
                updateStatusDto.Status == RegistrationStatus.Accepted,
                userId);

            if (updateStatusDto.Status == RegistrationStatus.Accepted)
            {
                UserRole userRole = registrationRequest.Role switch
                {
                    RegistrationRole.Manager => UserRole.Manager,
                    RegistrationRole.DeptManager => UserRole.DeptManager,
                    RegistrationRole.Employee => UserRole.Employee,
                    _ => UserRole.Employee
                };

                var user = new User
                {
                    UserId = await IdGenerator.GenerateUserIdAsync(_context, userRole, registrationRequest.CompanyName!),
                    UserName = registrationRequest.UserName,
                    Email = registrationRequest.Email,
                    Password = registrationRequest.Password,
                    Role = userRole,
                    DepartmentName = registrationRequest.Department.ToString(),
                    CreatedAt = DateTime.UtcNow,
                    RegistrationRequestId = registrationRequest.RegistrationId
                };

                var existingTenant = await _context.Tenants
                    .FirstOrDefaultAsync(t => t.TenantName == registrationRequest.CompanyName);
                
                if (existingTenant == null && registrationRequest.Role == RegistrationRole.Manager)
                {
                    var tenant = new Tenant
                    {
                        TenantId = await IdGenerator.GenerateTenantIdAsync(_context),
                        TenantName = registrationRequest.CompanyName,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.Tenants.Add(tenant);
                    user.TenantId = tenant.TenantId;
                }
                else if (existingTenant != null)
                {
                    user.TenantId = existingTenant.TenantId;
                }

                _context.Users.Add(user);
            }

            await _context.SaveChangesAsync();

            return new RegistrationRequestResponseDto
            {
                RegistrationId = registrationRequest.RegistrationId!,
                UserName = registrationRequest.UserName!,
                Email = registrationRequest.Email!,
                Role = registrationRequest.Role.ToString(),
                Department = registrationRequest.Department.ToString(),
                CompanyName = registrationRequest.CompanyName!,
                Status = registrationRequest.Status.ToString(),
                CreatedAt = registrationRequest.CreatedAt,
                AssignedManagerId = registrationRequest.AssignedManagerId
            };
        }

        public async Task<bool> DeleteByRegistrationIdAsync(string registrationId)
        {
            var registrationRequest = await _context.RegistrationRequests.FindAsync(registrationId);
            if (registrationRequest == null) throw new Exception("not found");

            if (registrationRequest.Status == RegistrationStatus.Pending)
                throw new InvalidOperationException("Before deleting perform the action");

            _context.RegistrationRequests.Remove(registrationRequest);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteRegistrationByStatusAsync(RegistrationStatus status, string userId)
        {
            if (status == RegistrationStatus.Pending)
                throw new InvalidOperationException("Cannot delete pending requests. Perform any action before to delete");

            var user = await _context.Users.Include(u => u.Tenant).FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null) throw new UnauthorizedAccessException("User not found");

            var registrationRequests = await _context.RegistrationRequests
                .Where(r => r.Status == status)
                .ToListAsync();

            var authorizedRequests = new List<RegistrationRequest>();
            foreach (var request in registrationRequests)
            {
                if (await CanApproveRequestAsync(userId, request))
                    authorizedRequests.Add(request);
            }

            if (!authorizedRequests.Any()) throw new Exception("No authorized requests found");

            _context.RegistrationRequests.RemoveRange(authorizedRequests);
            await _context.SaveChangesAsync();
            return true;
        }

        private async Task<bool> CanApproveRequestAsync(string userId, RegistrationRequest request)
        {
            var user = await _context.Users.Include(u => u.Tenant).FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null) return false;

            return request.Role switch
            {
                RegistrationRole.Manager => user.Role == UserRole.Admin,
                RegistrationRole.DeptManager => user.Role == UserRole.Manager && user.Tenant?.TenantName == request.CompanyName,
                RegistrationRole.Employee => user.Role == UserRole.DeptManager && 
                                           user.Tenant?.TenantName == request.CompanyName &&
                                           user.DepartmentName == request.Department.ToString(),
                _ => false
            };
        }

        public async Task<IEnumerable<RegistrationRequestResponseDto>> GetPendingRequestsForApproverAsync(string approverId)
        {
            var approver = await _context.Users
                .Include(u => u.Tenant)
                .FirstOrDefaultAsync(u => u.UserId == approverId);
            
            if (approver == null) return Enumerable.Empty<RegistrationRequestResponseDto>();

            IQueryable<RegistrationRequest> query = _context.RegistrationRequests
                .Where(r => r.Status == RegistrationStatus.Pending);

            if (approver.Role == UserRole.Admin)
            {
                query = query.Where(r => r.Role == RegistrationRole.Manager);
            }
            else if (approver.Role == UserRole.Manager)
            {
                query = query.Where(r => r.Role == RegistrationRole.DeptManager && 
                                        r.CompanyName == approver.Tenant!.TenantName);
            }
            else if (approver.Role == UserRole.DeptManager)
            {
                query = query.Where(r => r.Role == RegistrationRole.Employee && 
                                        r.CompanyName == approver.Tenant!.TenantName &&
                                        r.Department.ToString() == approver.DepartmentName);
            }
            else
            {
                return Enumerable.Empty<RegistrationRequestResponseDto>();
            }

            var requests = await query.OrderByDescending(r => r.CreatedAt).ToListAsync();

            return requests.Select(r => new RegistrationRequestResponseDto
            {
                RegistrationId = r.RegistrationId!,
                UserName = r.UserName!,
                Email = r.Email!,
                Role = r.Role.ToString(),
                Department = r.Department.ToString(),
                CompanyName = r.CompanyName!,
                Status = r.Status.ToString(),
                CreatedAt = r.CreatedAt,
                AssignedManagerId = r.AssignedManagerId
            });
        }
    }
}