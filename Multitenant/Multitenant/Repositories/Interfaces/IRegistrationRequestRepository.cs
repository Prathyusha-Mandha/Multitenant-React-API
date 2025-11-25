using Multitenant.Models;

namespace Multitenant.Repositories.Interfaces
{
    public interface IRegistrationRequestRepository
    {
        Task<IReadOnlyList<RegistrationRequest>> GetByStatusAsync(RegistrationStatus status);
    }
}
