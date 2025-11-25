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
    public class RegistrationRequestController : ControllerBase
    {
        private readonly IRegistrationRequestService _registrationRequestService;
        private readonly ITenantService _tenantService;

        public RegistrationRequestController(IRegistrationRequestService registrationRequestService, ITenantService tenantService)
        {
            _registrationRequestService = registrationRequestService;
            _tenantService = tenantService;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<RegistrationRequestResponseDto>>> GetRegistrationRequests()
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            var requests = await _registrationRequestService.GetAllAsync(currentUserId);
            return Ok(requests);
        }

        [HttpGet("companies")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<string>>> GetAvailableCompanies()
        {
            var companies = await _tenantService.GetTenantNamesAsync();
            return Ok(companies);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<RegistrationRequestResponseDto>> AddRegistrationRequest([FromForm] CreateRegistrationRequestDto createRegistrationRequestDto)
        {
            var request = await _registrationRequestService.AddRegistrationRequestAsync(createRegistrationRequestDto);
            return Ok(request);
        }

        [HttpPut("{registrationRequestId}/status")]
        [Authorize]
        public async Task<ActionResult<RegistrationRequestResponseDto>> UpdateStatus(string registrationRequestId, [FromForm] UpdateRegistrationStatusDto updateStatusDto)
        {
            var approverId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            var request = await _registrationRequestService.UpdateStatusAsync(registrationRequestId, updateStatusDto, approverId);
            return request == null ? BadRequest("Unauthorized to approve this request") : Ok(request);
        }

        [HttpDelete("{registrationId}")]
        [Authorize]
        public async Task<ActionResult> DeleteByRegistrationId(string registrationId)
        {
            var result = await _registrationRequestService.DeleteByRegistrationIdAsync(registrationId);
            return result ? NoContent() : NotFound();
        }
    }
}