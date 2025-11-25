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
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet]
        public async Task<ActionResult<NotificationListDto>> GetByUserId()
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            var result = await _notificationService.GetByUserIdAsync(currentUserId);
            return Ok(result);
        }

        [HttpGet("read")]
        public async Task<ActionResult<NotificationListDto>> GetReadNotifications()
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            var result = await _notificationService.GetReadNotificationsAsync(currentUserId);
            return Ok(result);
        }

        [HttpGet("unread")]
        public async Task<ActionResult<NotificationListDto>> GetUnreadNotifications()
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            var result = await _notificationService.GetUnreadNotificationsAsync(currentUserId);
            return Ok(result);
        }

        [HttpPut("{notificationId}/read")]
        public async Task<ActionResult> MarkAsRead(string notificationId)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
                var result = await _notificationService.MarkAsReadAsync(notificationId, currentUserId);
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

        [HttpDelete("{notificationId}")]
        public async Task<ActionResult> DeleteByNotificationId(string notificationId)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
                var result = await _notificationService.DeleteByNotificationIdAsync(notificationId, currentUserId);
                return result ? NoContent() : NotFound();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteAllNotifications()
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            var result = await _notificationService.DeleteNotificationByUserIdAsync(currentUserId);
            return result ? NoContent() : NotFound();
        }
    }
}