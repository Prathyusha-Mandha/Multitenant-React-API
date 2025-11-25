using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Multitenant.DTO;
using Multitenant.Models;
using Multitenant.Services.Interfaces;
using System.Security.Claims;

namespace Multitenant.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAll()
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
                var users = await _userService.GetAllAsync(currentUserId);
                return Ok(users);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<UserResponseDto>> GetByUserId(string userId)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
                var user = await _userService.GetByUserIdAsync(userId, currentUserId);
                return user == null ? NotFound() : Ok(user);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpGet("username/{userName}")]
        public async Task<ActionResult<UserResponseDto>> GetByUserName(string userName)
        {
            var user = await _userService.GetByUserNameAsync(userName);
            return user == null ? NotFound() : Ok(user);
        }

        [HttpGet("department/{departmentName}")]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetListByDepartmentName(string departmentName)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
                var users = await _userService.GetListByDepartmentNameAsync(departmentName, currentUserId);
                return Ok(users);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpGet("tenant/{tenantId}")]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetByTenantId(string tenantId)
        {
            var users = await _userService.GetByTenantIdAsync(tenantId);
            return Ok(users);
        }

        [HttpGet("department/{departmentName}/count")]
        public async Task<ActionResult<int>> GetCountByDepartmentName(string departmentName)
        {
            var count = await _userService.GetCountByDepartmentNameAsync(departmentName);
            return Ok(count);
        }



        [HttpPut("{userId}")]
        public async Task<ActionResult<UserResponseDto>> UpdateUser(string userId, UpdateUserDto updateUserDto)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            if (currentUserId != userId)
            {
                return Forbid("You can only update your own profile");
            }
            
            var user = await _userService.UpdateSelfAsync(userId, new UpdateSelfDto
            {
                UserName = updateUserDto.UserName,
                Email = updateUserDto.Email,
                ProfilePicture = updateUserDto.ProfilePicture
            });
            return user == null ? NotFound() : Ok(user);
        }

    }
}