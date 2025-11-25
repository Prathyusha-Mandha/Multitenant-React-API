using Multitenant.DTO;
using Multitenant.Models;

namespace Multitenant.Services.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserResponseDto>> GetAllAsync(string currentUserId);
        Task<UserResponseDto?> GetByUserIdAsync(string userId, string currentUserId);
        Task<UserResponseDto?> GetByUserNameAsync(string userName);
        Task<IEnumerable<UserResponseDto>> GetListByDepartmentNameAsync(string departmentName, string currentUserId);
        Task<IEnumerable<UserResponseDto>> GetByTenantIdAsync(string tenantId);
        Task<int> GetCountByDepartmentNameAsync(string departmentName);
        Task<UserResponseDto> AddUserAsync(CreateUserDto createUserDto);
        Task<UserResponseDto?> UpdateUserAsync(string userId, UpdateUserDto updateUserDto);
        Task<UserResponseDto?> UpdateSelfAsync(string userId, UpdateSelfDto updateSelfDto);
        Task<bool> DeleteUserAsync(string userId);
        Task<bool> DeleteUserByDepartmentNameAsync(string departmentName);
    }
}