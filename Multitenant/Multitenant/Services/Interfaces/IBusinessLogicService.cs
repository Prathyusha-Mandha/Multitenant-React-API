using Multitenant.Models;

namespace Multitenant.Services.Interfaces
{
    public interface IBusinessLogicService
    {
        Task<ResponseMessage> AddResponseWithNotificationAsync(string postMessageId, ResponseMessage responseMessage);
        Task<User> CreateUserFromRegistrationAsync(RegistrationRequest registrationRequest);
        Task<Tenant> CreateTenantFromRegistrationAsync(RegistrationRequest registrationRequest);
        Task ValidateRegistrationUniquenessAsync(RegistrationRequest registrationRequest);
        Task<bool> CanApproveRequestAsync(string approverId, RegistrationRequest registrationRequest);
    }
}