using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Multitenant.Data;
using Microsoft.EntityFrameworkCore;
using Multitenant.DTO;
using Multitenant.Services.Interfaces;

namespace Multitenant.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly MultitenantDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly IOtpService _otpService;

        public AuthController(MultitenantDbContext context, IConfiguration configuration, IEmailService emailService, IOtpService otpService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
            _otpService = otpService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login([FromForm] LoginDto loginDto)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Tenant)
                    .FirstOrDefaultAsync(u => u.UserId == loginDto.UserId && u.Password == loginDto.Password);

                if (user == null || string.IsNullOrEmpty(user.UserId))
                {
                    return Ok(new LoginResponseDto
                    {
                        Success = false,
                        Message = "Invalid credentials"
                    });
                }

                var tenantId = user.TenantId ?? "admin";
                if (user.Role != Models.UserRole.Admin && string.IsNullOrEmpty(user.TenantId))
                {
                    return Ok(new LoginResponseDto
                    {
                        Success = false,
                        Message = "Invalid credentials"
                    });
                }

                var token = GenerateJwtToken(user.UserId, user.Role.ToString(), tenantId);

                return Ok(new LoginResponseDto
                {
                    Success = true,
                    Token = token,
                    UserId = user.UserId!,
                    UserName = user.UserName!,
                    Email = user.Email!,
                    Role = user.Role.ToString(),
                    TenantId = tenantId,
                    TenantName = user.Tenant?.TenantName
                });
            }
            catch (Exception)
            {
                return Ok(new LoginResponseDto
                {
                    Success = false,
                    Message = "An error occurred during login"
                });
            }
        }

        [HttpPost("forgot-password")]
        public async Task<ActionResult<ForgotPasswordResponseDto>> ForgotPassword([FromForm] ForgotPasswordDto forgotPasswordDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return Ok(new ForgotPasswordResponseDto
                    {
                        Success = false,
                        Message = "Invalid email format"
                    });
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == forgotPasswordDto.Email);
                if (user == null)
                {
                    return Ok(new ForgotPasswordResponseDto
                    {
                        Success = false,
                        Message = "Email not found"
                    });
                }

                var otp = _otpService.GenerateOtp();
                _otpService.StoreOtp(forgotPasswordDto.Email, otp);
                await _emailService.SendOtpEmailAsync(forgotPasswordDto.Email, otp);

                return Ok(new ForgotPasswordResponseDto
                {
                    Success = true,
                    Message = "OTP sent to your email"
                });
            }
            catch (Exception)
            {
                return Ok(new ForgotPasswordResponseDto
                {
                    Success = false,
                    Message = "An error occurred while sending OTP"
                });
            }
        }

        [HttpPost("reset-password")]
        public async Task<ActionResult<ResetPasswordResponseDto>> ResetPassword([FromForm] ResetPasswordDto resetPasswordDto)
        {
            try
            {
                if (!_otpService.ValidateOtp(resetPasswordDto.Email, resetPasswordDto.Otp))
                {
                    return Ok(new ResetPasswordResponseDto
                    {
                        Success = false,
                        Message = "Invalid or expired OTP"
                    });
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == resetPasswordDto.Email);
                if (user == null)
                {
                    return Ok(new ResetPasswordResponseDto
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                user.Password = resetPasswordDto.NewPassword;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                _otpService.RemoveOtp(resetPasswordDto.Email);

                return Ok(new ResetPasswordResponseDto
                {
                    Success = true,
                    Message = "Password reset successfully"
                });
            }
            catch (Exception)
            {
                return Ok(new ResetPasswordResponseDto
                {
                    Success = false,
                    Message = "An error occurred during password reset"
                });
            }
        }
        

        private string GenerateJwtToken(string userId, string role, string tenantId)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Role, role),
                new Claim("TenantId", tenantId)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["Jwt:ExpireMinutes"])),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}