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
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpGet("conversation/{receiverId}")]
        public async Task<ActionResult<IEnumerable<ChatResponseDto>>> GetConversation(string receiverId)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
                var chats = await _chatService.GetConversationAsync(currentUserId, receiverId);
                return Ok(chats);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpPost("form")]
        public async Task<ActionResult<ChatResponseDto>> SendMessageForm([FromForm] CreateChatDto createChatDto)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
                var chat = await _chatService.SendMessageAsync(createChatDto, currentUserId);
                return Ok(chat);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpGet("{chatId}/download")]
        public async Task<ActionResult> DownloadFile(string chatId)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
                var chat = await _chatService.GetChatByIdAsync(chatId, currentUserId);
                if (chat?.FileUrl == null) return NotFound("File not found");
                
                return File(chat.FileUrl, "application/pdf", $"chat_{chatId}.pdf");
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpPut("{chatId}/read")]
        public async Task<ActionResult> MarkAsRead(string chatId)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
                var result = await _chatService.MarkAsReadAsync(chatId, currentUserId);
                return result ? Ok() : NotFound();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}