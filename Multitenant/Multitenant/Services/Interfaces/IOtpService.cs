namespace Multitenant.Services.Interfaces
{
    public interface IOtpService
    {
        string GenerateOtp();
        void StoreOtp(string email, string otp);
        bool ValidateOtp(string email, string otp);
        void RemoveOtp(string email);
    }
}