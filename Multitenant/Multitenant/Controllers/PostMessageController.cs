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
    public class PostMessageController : ControllerBase
    {
        private readonly IPostMessageService _postMessageService;

        public PostMessageController(IPostMessageService postMessageService)
        {
            _postMessageService = postMessageService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostMessageResponseDto>>> GetAll()
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
                var posts = await _postMessageService.GetAllAsync(currentUserId);
                return Ok(posts);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpGet("{postMessageId}")]
        public async Task<ActionResult<PostMessageResponseDto>> GetByPostMessageId(string postMessageId)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
                var post = await _postMessageService.GetByPostMessageIdAsync(postMessageId, currentUserId);
                return post == null ? NotFound() : Ok(post);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<PostMessageResponseDto>>> GetPostMessageByUserId(string userId)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            if (userId != currentUserId)
                return Forbid("Can only view your own messages");
                
            var posts = await _postMessageService.GetPostMessageByUserIdAsync(userId);
            return Ok(posts);
        }

        [HttpGet("{postMessageId}/responses/count")]
        public async Task<ActionResult<int>> GetResponseCount(string postMessageId)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
                var count = await _postMessageService.GetResponseCountAsync(postMessageId, currentUserId);
                return Ok(count);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpPost("form")]
        public async Task<ActionResult<PostMessageResponseDto>> AddPostMessageForm([FromForm] CreatePostMessageDto createPostMessageDto)
        {
            if (string.IsNullOrWhiteSpace(createPostMessageDto.Description))
                return BadRequest("Message cannot be empty");
                
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            var post = await _postMessageService.AddPostMessageAsync(createPostMessageDto, currentUserId);
            return CreatedAtAction(nameof(GetByPostMessageId), new { postMessageId = post.PostMessageId }, post);
        }

        [HttpGet("{postMessageId}/download")]
        public async Task<ActionResult> DownloadFile(string postMessageId)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
                var post = await _postMessageService.GetByPostMessageIdAsync(postMessageId, currentUserId);
                if (post?.FileUrl == null) return NotFound("File not found");
                
                return File(post.FileUrl, "application/pdf", $"post_{postMessageId}.pdf");
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }
    }
}