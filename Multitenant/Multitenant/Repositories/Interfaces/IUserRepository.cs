using Multitenant.Models;

namespace Multitenant.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<Dictionary<DepatmentType, int>> CountByDepartmentAsync();
    }
}
