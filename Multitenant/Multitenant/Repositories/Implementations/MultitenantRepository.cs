using Microsoft.EntityFrameworkCore;
using Multitenant.Data;
using Multitenant.Repositories.Interfaces;
using System.Linq.Expressions;
using System.Reflection;


namespace Multitenant.Repositories.Implementations
{
    public class MultitenantRepository<TEntity> : IMultitenantRepository<TEntity> where TEntity : class
    {
        protected readonly MultitenantDbContext _context;
        protected readonly DbSet<TEntity> _dbSet;

        public MultitenantRepository(MultitenantDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _dbSet = _context.Set<TEntity>();
        }

        public virtual async Task<TEntity> AddAsync(TEntity entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            var result = await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
            return result.Entity;
        }

        public virtual async Task<IReadOnlyList<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>>? predicate = null)
        {
            var query = _dbSet.AsNoTracking();

            if (predicate != null)
                query = query.Where(predicate);

            return await query.ToListAsync();
        }

        public virtual async Task<TEntity?> GetByIdAsync(string id)
        {
            return await _dbSet.FindAsync(id);
        }

        public virtual async Task<TEntity?> GetAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await _dbSet.AsNoTracking().FirstOrDefaultAsync(predicate);
        }

        public virtual async Task<TEntity> UpdateAsync(TEntity entity, Expression<Func<TEntity, bool>>? predicate = null)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            TEntity? existingEntity;

            if (predicate != null)
            {
                existingEntity = await _dbSet.FirstOrDefaultAsync(predicate);
                if (existingEntity == null)
                    throw new ArgumentException($"{typeof(TEntity)} not found with the given predicate");
            }
            else
            {
                var keyProperty = GetKeyProperty();
                var keyValue = keyProperty.GetValue(entity);
                existingEntity = await _dbSet.FindAsync(keyValue);
                if (existingEntity == null)
                    throw new ArgumentException($"{typeof(TEntity)} with ID {keyValue} not found");
            }

            _context.Entry(existingEntity).CurrentValues.SetValues(entity);
            await _context.SaveChangesAsync();
            return existingEntity;
        }

        public virtual async Task DeleteAsync(string id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity != null)
            {
                _dbSet.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        

        public virtual async Task<bool> ExistsAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await _dbSet.AnyAsync(predicate);
        }

        public virtual async Task<int> CountAsync(Expression<Func<TEntity, bool>>? predicate = null)
        {
            return predicate == null
                ? await _dbSet.CountAsync()
                : await _dbSet.CountAsync(predicate);
        }

        private PropertyInfo GetKeyProperty()
        {
            var keyProperty = typeof(TEntity).GetProperties()
                .FirstOrDefault(p => p.GetCustomAttributes(typeof(System.ComponentModel.DataAnnotations.KeyAttribute), true).Length > 0);

            return keyProperty ?? throw new InvalidOperationException($"Entity does not have a Key attribute");
        }
    }
}
