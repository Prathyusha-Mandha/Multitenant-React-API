using Microsoft.EntityFrameworkCore;
using Multitenant.Data;
using Multitenant.Models;
using Multitenant.Repositories.Interfaces;
using System.Linq.Expressions;
using System.Reflection;

namespace Multitenant.Repositories.Implementations
{
    public class RegistrationRequestRepository : IRegistrationRequestRepository
    {
        protected readonly MultitenantDbContext _context;
        protected readonly DbSet<RegistrationRequest> _dbSet;

        public RegistrationRequestRepository(MultitenantDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _dbSet = _context.Set<RegistrationRequest>();
        }

        public Task<IReadOnlyList<RegistrationRequest>> GetByStatusAsync(RegistrationStatus status)
        {
            return Task.FromResult<IReadOnlyList<RegistrationRequest>>(
                _dbSet.AsNoTracking().Where(r => r.Status == status).ToList()
            );
        }
    }
}
