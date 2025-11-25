using Microsoft.EntityFrameworkCore;
using Multitenant.Data;
using Multitenant.Models;
using Multitenant.Repositories.Interfaces;

namespace Multitenant.Repositories.Implementations
{
    public class UserRepository : IUserRepository
    {
        protected readonly MultitenantDbContext _context;
        protected readonly DbSet<User> _dbSet;

        public UserRepository(MultitenantDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _dbSet = _context.Set<User>();
        }

        public async Task<Dictionary<DepatmentType, int>> CountByDepartmentAsync()
        {
            return await _context.RegistrationRequests
                .GroupBy(r => r.Department)
                .Select(g => new
                {
                    Department = g.Key,
                    Count = g.Count()
                })
                .ToDictionaryAsync(key => key.Department, value => value.Count);
        }
    }
}
