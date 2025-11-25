using Multitenant.Data;
using Microsoft.EntityFrameworkCore;

namespace Multitenant.Validators
{
    public class TenantValidator
    {
        private readonly MultitenantDbContext _context;

        public TenantValidator(MultitenantDbContext context)
        {
            _context = context;
        }

        public async Task ValidateTenantExistsAsync(string tenantId)
        {
            var tenant = await _context.Tenants.FindAsync(tenantId);
            if (tenant == null) throw new Exception("not found");
        }

        public async Task ValidateTenantByNameExistsAsync(string tenantName)
        {
            var users = await _context.Users
                .Include(u => u.Tenant)
                .Where(u => u.Tenant!.TenantName == tenantName)
                .AnyAsync();
            if (!users) throw new Exception("not found");
        }
    }
}