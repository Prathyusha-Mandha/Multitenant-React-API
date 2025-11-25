using Multitenant.Services.Interfaces;
using System.Collections.Concurrent;

namespace Multitenant.Services.Implementations
{
    public class OtpService : IOtpService
    {
        private readonly ConcurrentDictionary<string, (string Otp, DateTime Expiry)> _otpStore = new();

        public string GenerateOtp()
        {
            return new Random().Next(100000, 999999).ToString();
        }

        public void StoreOtp(string email, string otp)
        {
            _otpStore[email] = (otp, DateTime.UtcNow.AddMinutes(10));
        }

        public bool ValidateOtp(string email, string otp)
        {
            if (_otpStore.TryGetValue(email, out var storedOtp))
            {
                if (storedOtp.Expiry > DateTime.UtcNow && storedOtp.Otp == otp)
                {
                    return true;
                }
                _otpStore.TryRemove(email, out _);
            }
            return false;
        }

        public void RemoveOtp(string email)
        {
            _otpStore.TryRemove(email, out _);
        }
    }
}