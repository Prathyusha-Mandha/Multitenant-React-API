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
    public class ResponseMessageController : ControllerBase
    {
        private readonly IResponseMessageService _responseMessageService;

        public ResponseMessageController(IResponseMessageService responseMessageService)
        {
            _responseMessageService = responseMessageService;
        }

        [HttpGet("post/{postMessageId}")]
        public async Task<ActionResult<IEnumerable<ResponseMessageResponseDto>>> GetResponseMessageByPostMessageId(string postMessageId)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
                var responses = await _responseMessageService.GetResponseMessageByPostMessageIdAsync(postMessageId, currentUserId);
                return Ok(responses);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpPost("form")]
        public async Task<ActionResult<ResponseMessageResponseDto>> AddResponseMessageForm([FromForm] CreateResponseMessageDto createResponseMessageDto)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
                var response = await _responseMessageService.AddResponseMessageAsync(createResponseMessageDto, currentUserId);
                return response == null ? BadRequest("Post message not found") : CreatedAtAction(nameof(GetResponseMessageByPostMessageId), new { postMessageId = response.PostMessageId }, response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpDelete("{responseMessageId}")]
        public async Task<ActionResult> DeleteByResponseMessageId(string responseMessageId)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
                var result = await _responseMessageService.DeleteByResponseMessageIdAsync(responseMessageId, currentUserId);
                return result ? NoContent() : NotFound();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpGet("{responseMessageId}/download")]
        public async Task<ActionResult> DownloadFile(string responseMessageId)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
                var response = await _responseMessageService.GetByResponseMessageIdAsync(responseMessageId, currentUserId);
                if (response?.FileUrl == null) return NotFound("File not found");
                
                return File(response.FileUrl, "application/pdf", $"response_{responseMessageId}.pdf");
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }
    }
}