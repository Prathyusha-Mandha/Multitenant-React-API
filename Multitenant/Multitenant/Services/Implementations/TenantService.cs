using Microsoft.EntityFrameworkCore;
using Multitenant.Data;
using Multitenant.DTO;
using Multitenant.Models;
using Multitenant.Services.Interfaces;
using Multitenant.Services;

namespace Multitenant.Services.Implementations
{
    public class TenantService : ITenantService
    {
        private readonly MultitenantDbContext _context;

        public TenantService(MultitenantDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<TenantResponseDto>> GetAllAsync()
        {
            var tenants = await _context.Tenants.ToListAsync();
            return tenants.Select(t => new TenantResponseDto
            {
                TenantId = t.TenantId!,
                TenantName = t.TenantName!,
                CreatedAt = t.CreatedAt
            });
        }

        public async Task<IEnumerable<string>> GetTenantNamesAsync()
        {
            return await _context.Tenants.Select(t => t.TenantName!).ToListAsync();
        }

        public async Task<IEnumerable<string>> GetDepartmentsByTenantIdAsync(string tenantId)
        {
            return await _context.Users
                .Where(u => u.TenantId == tenantId && !string.IsNullOrEmpty(u.DepartmentName))
                .Select(u => u.DepartmentName!)
                .Distinct()
                .ToListAsync();
        }

        public async Task<IEnumerable<string>> GetDepartmentsByTenantNameAsync(string tenantName)
        {
            return await _context.Users
                .Include(u => u.Tenant)
                .Where(u => u.Tenant!.TenantName == tenantName && !string.IsNullOrEmpty(u.DepartmentName))
                .Select(u => u.DepartmentName!)
                .Distinct()
                .ToListAsync();
        }

        public async Task<TenantResponseDto?> GetByTenantIdAsync(string tenantId)
        {
            var tenant = await _context.Tenants
                .Include(t => t.Users)
                .FirstOrDefaultAsync(t => t.TenantId == tenantId);

            if (tenant == null) throw new Exception("not found");

            return new TenantResponseDto
            {
                TenantId = tenant.TenantId!,
                TenantName = tenant.TenantName!,
                CreatedAt = tenant.CreatedAt
            };
        }

        public async Task<TenantWithUsersDto?> GetByTenantNameAsync(string tenantName)
        {
            var users = await _context.Users
                .Include(u => u.Tenant)
                .Where(u => u.Tenant!.TenantName == tenantName)
                .ToListAsync();

            if (!users.Any()) throw new Exception("not found");

            var tenant = users.First().Tenant;
            var userDtos = users.Select(u => new UserResponseDto
            {
                UserId = u.UserId!,
                UserName = u.UserName!,
                Email = u.Email!,
                DepartmentName = u.DepartmentName,
                Role = u.Role.ToString(),
                CreatedAt = u.CreatedAt,
                TenantId = u.TenantId,
                TenantName = u.Tenant?.TenantName
            });

            return new TenantWithUsersDto
            {
                TenantId = tenant!.TenantId!,
                TenantName = tenant.TenantName!,
                CreatedAt = tenant.CreatedAt,
                Users = userDtos,
                UserCount = users.Count
            };
        }

        public async Task<TenantResponseDto> AddTenantAsync(CreateTenantDto createTenantDto)
        {
            var tenant = new Tenant
            {
                TenantId = await IdGenerator.GenerateTenantIdAsync(_context),
                TenantName = createTenantDto.TenantName,
                CreatedAt = DateTime.UtcNow
            };

            _context.Tenants.Add(tenant);
            await _context.SaveChangesAsync();

            return new TenantResponseDto
            {
                TenantId = tenant.TenantId!,
                TenantName = tenant.TenantName!,
                CreatedAt = tenant.CreatedAt
            };
        }

        public async Task<TenantResponseDto?> UpdateTenantAsync(string tenantId, string currentUserId, UpdateTenantDto updateTenantDto)
        {
            var currentUser = await _context.Users.FindAsync(currentUserId);
            if (currentUser?.Role != UserRole.Manager)
                throw new UnauthorizedAccessException("Only managers can update tenant names");

            var tenant = await _context.Tenants.FindAsync(tenantId);
            if (tenant == null) throw new Exception("not found");

            if (!string.IsNullOrEmpty(updateTenantDto.TenantName))
            {
                var existingTenant = await _context.Tenants
                    .FirstOrDefaultAsync(t => t.TenantName == updateTenantDto.TenantName && t.TenantId != tenantId);
                if (existingTenant != null)
                    throw new InvalidOperationException("Tenant name must be unique");
                    
                tenant.TenantName = updateTenantDto.TenantName;
            }

            _context.Tenants.Update(tenant);
            await _context.SaveChangesAsync();

            return new TenantResponseDto
            {
                TenantId = tenant.TenantId!,
                TenantName = tenant.TenantName!,
                CreatedAt = tenant.CreatedAt
            };
        }

        public async Task<bool> DeleteTenantAsync(string tenantId, string currentUserId)
        {
            var currentUser = await _context.Users.FindAsync(currentUserId);
            if (currentUser?.Role != UserRole.Admin)
                throw new UnauthorizedAccessException("Only admins can delete tenants");

            var tenant = await _context.Tenants
                .Include(t => t.Users)
                .FirstOrDefaultAsync(t => t.TenantId == tenantId);
            if (tenant == null) throw new Exception("not found");

            if (tenant.Users != null && tenant.Users.Any())
            {
                _context.Users.RemoveRange(tenant.Users);
            }

            _context.Tenants.Remove(tenant);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}