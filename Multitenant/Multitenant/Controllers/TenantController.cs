using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Multitenant.DTO;
using Multitenant.Services.Interfaces;
using System.Security.Claims;

namespace Multitenant.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TenantController : ControllerBase
    {
        private readonly ITenantService _tenantService;

        public TenantController(ITenantService tenantService)
        {
            _tenantService = tenantService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TenantResponseDto>>> GetAll()
        {
            var tenants = await _tenantService.GetAllAsync();
            return Ok(tenants);
        }

        [HttpGet("names")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<string>>> GetTenantNames()
        {
            var tenantNames = await _tenantService.GetTenantNamesAsync();
            return Ok(tenantNames);
        }

        [HttpGet("{tenantId}/departments")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<string>>> GetDepartmentsByTenantId(string tenantId)
        {
            var departments = await _tenantService.GetDepartmentsByTenantIdAsync(tenantId);
            return Ok(departments);
        }

        [HttpGet("name/{tenantName}/departments")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<string>>> GetDepartmentsByTenantName(string tenantName)
        {
            var departments = await _tenantService.GetDepartmentsByTenantNameAsync(tenantName);
            return Ok(departments);
        }

        [HttpGet("{tenantId}")]
        public async Task<ActionResult<TenantResponseDto>> GetByTenantId(string tenantId)
        {
            var tenant = await _tenantService.GetByTenantIdAsync(tenantId);
            return tenant == null ? NotFound() : Ok(tenant);
        }

        [HttpGet("name/{tenantName}")]
        public async Task<ActionResult<TenantWithUsersDto>> GetByTenantName(string tenantName)
        {
            var tenant = await _tenantService.GetByTenantNameAsync(tenantName);
            return tenant == null ? NotFound() : Ok(tenant);
        }



        [HttpPut("{tenantId}")]
        public async Task<ActionResult<TenantResponseDto>> UpdateTenant(string tenantId, [FromForm] UpdateTenantDto updateTenantDto)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
                var tenant = await _tenantService.UpdateTenantAsync(tenantId, currentUserId, updateTenantDto);
                return tenant == null ? NotFound() : Ok(tenant);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpDelete("{tenantId}")]
        public async Task<ActionResult> DeleteTenant(string tenantId)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
                var result = await _tenantService.DeleteTenantAsync(tenantId, currentUserId);
                return result ? NoContent() : NotFound();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }
    }
}