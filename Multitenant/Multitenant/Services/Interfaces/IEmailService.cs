namespace Multitenant.Services.Interfaces
{
    public interface IEmailService
    {
        Task SendRegistrationStatusEmailAsync(string email, string userName, bool isAccepted, string? userId = null);
        Task SendOtpEmailAsync(string email, string otp);
    }
}