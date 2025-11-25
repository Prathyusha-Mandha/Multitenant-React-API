using System.Linq.Expressions;
using System.Security.Cryptography;

namespace Multitenant.Repositories.Interfaces
{
    public interface IMultitenantRepository<TEntity> where TEntity : class
    {
        Task<TEntity> AddAsync(TEntity entity);

        Task<IReadOnlyList<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>>? predicate = null);
        Task<TEntity?> GetByIdAsync(string id);
        Task<TEntity?> GetAsync(Expression<Func<TEntity, bool>> predicate);
        Task<TEntity> UpdateAsync(TEntity entity, Expression<Func<TEntity, bool>>? predicate = null);

        Task DeleteAsync(string id);
        Task<bool> ExistsAsync(Expression<Func<TEntity, bool>> predicate);
        Task<int> CountAsync(Expression<Func<TEntity, bool>>? predicate = null);

        
    }
}
