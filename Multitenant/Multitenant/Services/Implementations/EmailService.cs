using System.Net;
using System.Net.Mail;
using Multitenant.Services.Interfaces;

namespace Multitenant.Services.Implementations
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendRegistrationStatusEmailAsync(string email, string userName, bool isAccepted, string? userId = null)
        {
            var subject = isAccepted ? "Registration Approved" : "Registration Rejected";
            var body = isAccepted 
                ? $"Dear {userName},\n\nYour registration has been approved. You can now log in to the system.\n\nYour User ID: {userId}"
                : $"Dear {userName},\n\nYour registration has been rejected. Please contact support for more information.";

            await SendEmailAsync(email, subject, body);
        }

        public async Task SendOtpEmailAsync(string email, string otp)
        {
            var subject = "Password Reset OTP";
            var body = $"Your OTP for password reset is: {otp}\n\nThis OTP will expire in 10 minutes.";

            await SendEmailAsync(email, subject, body);
        }

        private async Task SendEmailAsync(string email, string subject, string body)
        {
            var smtpHost = _configuration["Smtp:Host"];
            var smtpPort = int.Parse(_configuration["Smtp:Port"]);
            var smtpUser = _configuration["Smtp:Username"];
            var smtpPass = _configuration["Smtp:Password"];

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                Credentials = new NetworkCredential(smtpUser, smtpPass),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(smtpUser),
                Subject = subject,
                Body = body,
                IsBodyHtml = false
            };
            mailMessage.To.Add(email);

            await client.SendMailAsync(mailMessage);
        }
    }
}