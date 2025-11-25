using Multitenant.DTO;
using Multitenant.Models;

namespace Multitenant.Services.Interfaces
{
    public interface IRegistrationRequestService
    {
        Task<IEnumerable<RegistrationRequestResponseDto>> GetAllAsync(string userId);
        Task<RegistrationRequestResponseDto?> GetByRegistrationRequestIdAsync(string registrationRequestId);
        Task<IEnumerable<RegistrationRequestResponseDto>> GetByDepartmentNameAsync(DepatmentType departmentName, string userId);
        Task<IEnumerable<RegistrationRequestResponseDto>> GetByCompanyNameAsync(string companyName, string userId);
        Task<IEnumerable<RegistrationRequestResponseDto>> GetByStatusAsync(RegistrationStatus status, string userId);
        Task<RegistrationRequestResponseDto> AddRegistrationRequestAsync(CreateRegistrationRequestDto createRegistrationRequestDto);
        Task<RegistrationRequestResponseDto?> UpdateStatusAsync(string registrationRequestId, UpdateRegistrationStatusDto updateStatusDto);
        Task<RegistrationRequestResponseDto?> UpdateStatusAsync(string registrationRequestId, UpdateRegistrationStatusDto updateStatusDto, string approverId);
        Task<IEnumerable<RegistrationRequestResponseDto>> GetPendingRequestsForApproverAsync(string approverId);
        Task<bool> DeleteByRegistrationIdAsync(string registrationId);
        Task<bool> DeleteRegistrationByStatusAsync(RegistrationStatus status, string userId);
    }
}