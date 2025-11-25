using Microsoft.EntityFrameworkCore;
using Multitenant.Data;
using Multitenant.DTO;
using Multitenant.Models;
using Multitenant.Services.Interfaces;

namespace Multitenant.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly MultitenantDbContext _context;

        public UserService(MultitenantDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserResponseDto>> GetAllAsync(string currentUserId)
        {
            var currentUser = await _context.Users.FindAsync(currentUserId);
            if (currentUser == null) throw new UnauthorizedAccessException("User not found");

            IQueryable<User> query = _context.Users.Include(u => u.Tenant);

            if (currentUser.Role != UserRole.Admin)
            {
                query = query.Where(u => u.TenantId == currentUser.TenantId);
            }

            var users = await query.ToListAsync();
            return users.Select(u => new UserResponseDto
            {
                UserId = u.UserId!,
                UserName = u.UserName!,
                Email = u.Email!,
                DepartmentName = u.DepartmentName,
                Role = u.Role.ToString(),
                CreatedAt = u.CreatedAt,
                TenantId = u.TenantId,
                TenantName = u.Tenant?.TenantName,
                ProfilePicture = u.ProfilePicture
            });
        }

        public async Task<UserResponseDto?> GetByUserIdAsync(string userId, string currentUserId)
        {
            var currentUser = await _context.Users.FindAsync(currentUserId);
            if (currentUser == null) throw new UnauthorizedAccessException("User not found");

            var user = await _context.Users
                .Include(u => u.Tenant)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null) return null;

            // Authorization check - all users can view users from same tenant
            if (currentUser.Role != UserRole.Admin && user.TenantId != currentUser.TenantId)
                throw new UnauthorizedAccessException("Can only view users from your company");

            return new UserResponseDto
            {
                UserId = user.UserId!,
                UserName = user.UserName!,
                Email = user.Email!,
                DepartmentName = user.DepartmentName,
                Role = user.Role.ToString(),
                CreatedAt = user.CreatedAt,
                TenantId = user.TenantId,
                TenantName = user.Tenant?.TenantName,
                ProfilePicture = user.ProfilePicture
            };
        }

        public async Task<UserResponseDto?> GetByUserNameAsync(string userName)
        {
            var user = await _context.Users
                .Include(u => u.Tenant)
                .FirstOrDefaultAsync(u => u.UserName == userName);

            if (user == null) throw new Exception("not found");

            return new UserResponseDto
            {
                UserId = user.UserId!,
                UserName = user.UserName!,
                Email = user.Email!,
                DepartmentName = user.DepartmentName,
                Role = user.Role.ToString(),
                CreatedAt = user.CreatedAt,
                TenantId = user.TenantId,
                TenantName = user.Tenant?.TenantName,
                ProfilePicture = user.ProfilePicture
            };
        }

        public async Task<IEnumerable<UserResponseDto>> GetListByDepartmentNameAsync(string departmentName, string currentUserId)
        {
            var currentUser = await _context.Users.FindAsync(currentUserId);
            if (currentUser == null) throw new UnauthorizedAccessException("User not found");

            IQueryable<User> query = _context.Users
                .Include(u => u.Tenant)
                .Where(u => u.DepartmentName == departmentName);

            switch (currentUser.Role)
            {
                case UserRole.Manager:
                    query = query.Where(u => u.TenantId == currentUser.TenantId);
                    break;
                case UserRole.DeptManager:
                    if (departmentName != currentUser.DepartmentName)
                        throw new UnauthorizedAccessException("Can only view your own department");
                    query = query.Where(u => u.TenantId == currentUser.TenantId);
                    break;
                default:
                    throw new UnauthorizedAccessException("Insufficient permissions");
            }

            var users = await query.ToListAsync();
            return users.Select(u => new UserResponseDto
            {
                UserId = u.UserId!,
                UserName = u.UserName!,
                Email = u.Email!,
                DepartmentName = u.DepartmentName,
                Role = u.Role.ToString(),
                CreatedAt = u.CreatedAt,
                TenantId = u.TenantId,
                TenantName = u.Tenant?.TenantName,
                ProfilePicture = u.ProfilePicture
            });
        }

        public async Task<int> GetCountByDepartmentNameAsync(string departmentName)
        {
            return await _context.Users
                .CountAsync(u => u.DepartmentName == departmentName);
        }

        public async Task<UserResponseDto> AddUserAsync(CreateUserDto createUserDto)
        {
            var tenant = await _context.Tenants.FindAsync(createUserDto.TenantId);
            string companyName = tenant?.TenantName ?? "DEFAULT";

            // Check if department manager exists for employee role
            if (createUserDto.Role == UserRole.Employee && !string.IsNullOrEmpty(createUserDto.DepartmentName))
            {
                var deptManagerExists = await _context.Users
                    .AnyAsync(u => u.DepartmentName == createUserDto.DepartmentName && 
                                  u.Role == UserRole.DeptManager && 
                                  u.TenantId == createUserDto.TenantId);
                
                if (!deptManagerExists)
                {
                    throw new Exception($"Department manager not found for department: {createUserDto.DepartmentName}");
                }
            }

            byte[]? profilePictureBytes = null;
            if (createUserDto.ProfilePicture != null)
            {
                using var memoryStream = new MemoryStream();
                await createUserDto.ProfilePicture.CopyToAsync(memoryStream);
                profilePictureBytes = memoryStream.ToArray();
            }

            var user = new User
            {
                UserId = await IdGenerator.GenerateUserIdAsync(_context, createUserDto.Role, companyName),
                UserName = createUserDto.UserName,
                Email = createUserDto.Email,
                Password = createUserDto.Password,
                TenantId = createUserDto.TenantId,
                DepartmentName = createUserDto.DepartmentName,
                Role = createUserDto.Role,
                ProfilePicture = profilePictureBytes,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return new UserResponseDto
            {
                UserId = user.UserId,
                UserName = user.UserName!,
                Email = user.Email!,
                DepartmentName = user.DepartmentName,
                Role = user.Role.ToString(),
                CreatedAt = user.CreatedAt,
                TenantId = user.TenantId,
                TenantName = tenant?.TenantName,
                ProfilePicture = user.ProfilePicture
            };
        }

        public async Task<UserResponseDto?> UpdateUserAsync(string userId, UpdateUserDto updateUserDto)
        {
            var user = await _context.Users.Include(u => u.Tenant).FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null) throw new Exception("not found");

            if (!string.IsNullOrEmpty(updateUserDto.UserName)) user.UserName = updateUserDto.UserName;
            if (!string.IsNullOrEmpty(updateUserDto.Email)) user.Email = updateUserDto.Email;
            if (updateUserDto.ProfilePicture != null)
            {
                using var memoryStream = new MemoryStream();
                await updateUserDto.ProfilePicture.CopyToAsync(memoryStream);
                user.ProfilePicture = memoryStream.ToArray();
            }

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return new UserResponseDto
            {
                UserId = user.UserId!,
                UserName = user.UserName!,
                Email = user.Email!,
                DepartmentName = user.DepartmentName,
                Role = user.Role.ToString(),
                CreatedAt = user.CreatedAt,
                TenantId = user.TenantId,
                TenantName = user.Tenant?.TenantName,
                ProfilePicture = user.ProfilePicture
            };
        }

        public async Task<UserResponseDto?> UpdateSelfAsync(string userId, UpdateSelfDto updateSelfDto)
        {
            var user = await _context.Users.Include(u => u.Tenant).FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null) return null;

            if (!string.IsNullOrEmpty(updateSelfDto.UserName)) user.UserName = updateSelfDto.UserName;
            if (!string.IsNullOrEmpty(updateSelfDto.Email)) user.Email = updateSelfDto.Email;
            if (updateSelfDto.ProfilePicture != null)
            {
                using var memoryStream = new MemoryStream();
                await updateSelfDto.ProfilePicture.CopyToAsync(memoryStream);
                user.ProfilePicture = memoryStream.ToArray();
            }

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return new UserResponseDto
            {
                UserId = user.UserId!,
                UserName = user.UserName!,
                Email = user.Email!,
                DepartmentName = user.DepartmentName,
                Role = user.Role.ToString(),
                CreatedAt = user.CreatedAt,
                TenantId = user.TenantId,
                TenantName = user.Tenant?.TenantName,
                ProfilePicture = user.ProfilePicture
            };
        }

        public async Task<bool> DeleteUserAsync(string userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new Exception("not found");

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<UserResponseDto>> GetByTenantIdAsync(string tenantId)
        {
            var users = await _context.Users
                .Include(u => u.Tenant)
                .Where(u => u.TenantId == tenantId)
                .ToListAsync();

            return users.Select(u => new UserResponseDto
            {
                UserId = u.UserId!,
                UserName = u.UserName!,
                Email = u.Email!,
                DepartmentName = u.DepartmentName,
                Role = u.Role.ToString(),
                CreatedAt = u.CreatedAt,
                TenantId = u.TenantId,
                TenantName = u.Tenant?.TenantName,
                ProfilePicture = u.ProfilePicture
            });
        }

        public async Task<bool> DeleteUserByDepartmentNameAsync(string departmentName)
        {
            var users = await _context.Users
                .Where(u => u.DepartmentName == departmentName)
                .ToListAsync();

            if (!users.Any()) throw new Exception("not found");

            _context.Users.RemoveRange(users);
            await _context.SaveChangesAsync();
            return true;
        }


    }
}