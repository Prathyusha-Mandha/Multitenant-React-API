using Multitenant.DTO;

namespace Multitenant.Services.Interfaces
{
    public interface ITenantService
    {
        Task<IEnumerable<TenantResponseDto>> GetAllAsync();
        Task<IEnumerable<string>> GetTenantNamesAsync();
        Task<IEnumerable<string>> GetDepartmentsByTenantIdAsync(string tenantId);
        Task<IEnumerable<string>> GetDepartmentsByTenantNameAsync(string tenantName);
        Task<TenantResponseDto?> GetByTenantIdAsync(string tenantId);
        Task<TenantWithUsersDto?> GetByTenantNameAsync(string tenantName);
        Task<TenantResponseDto> AddTenantAsync(CreateTenantDto createTenantDto);
        Task<TenantResponseDto?> UpdateTenantAsync(string tenantId, string currentUserId, UpdateTenantDto updateTenantDto);
        Task<bool> DeleteTenantAsync(string tenantId, string currentUserId);
    }
}