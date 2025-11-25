using Microsoft.EntityFrameworkCore;
using Multitenant.Data;
using Multitenant.Models;

namespace Multitenant.Services
{
    public static class IdGenerator
    {
        public static async Task<string> GenerateUserIdAsync(MultitenantDbContext context, UserRole role)
        {
            return await GenerateUserIdAsync(context, role, "DEFAULT");
        }

        public static async Task<string> GenerateUserIdAsync(MultitenantDbContext context, UserRole role, string companyName)
        {
            string roleSuffix = role switch
            {
                UserRole.Manager => "MA",
                UserRole.DeptManager => "DMA",
                UserRole.Employee => "EMP",
                _ => "EMP"
            };

            string companyPrefix = await GetUniqueCompanyPrefixAsync(context, companyName);
            string basePrefix = companyPrefix + roleSuffix;

            var existingUsers = await context.Users
                .Where(u => u.UserId!.StartsWith(basePrefix))
                .Select(u => u.UserId)
                .ToListAsync();

            int nextNumber = 1;
            if (existingUsers.Any())
            {
                var numbers = existingUsers
                    .Select(id => {
                        var numberPart = id!.Substring(basePrefix.Length);
                        return int.TryParse(numberPart, out int num) ? num : 0;
                    })
                    .Where(num => num > 0);
                
                nextNumber = numbers.Any() ? numbers.Max() + 1 : 1;
            }

            return basePrefix + nextNumber.ToString("D3");
        }

        private static async Task<string> GetUniqueCompanyPrefixAsync(MultitenantDbContext context, string companyName)
        {
            if (string.IsNullOrEmpty(companyName)) return "XX";

            var existingUserIds = await context.Users
                .Select(u => u.UserId)
                .Where(id => id != null)
                .ToListAsync();

            var existingPrefixes = new HashSet<string>();
            foreach (var userId in existingUserIds)
            {
                if (userId!.Length >= 2)
                {
                    var beforeMA = userId.IndexOf("MA");
                    var beforeDMA = userId.IndexOf("DMA");
                    var beforeEMP = userId.IndexOf("EMP");
                    
                    int roleIndex = -1;
                    if (beforeMA > 0) roleIndex = beforeMA;
                    else if (beforeDMA > 0) roleIndex = beforeDMA;
                    else if (beforeEMP > 0) roleIndex = beforeEMP;
                    
                    if (roleIndex > 0)
                    {
                        existingPrefixes.Add(userId.Substring(0, roleIndex));
                    }
                }
            }

            string cleanCompanyName = new string(companyName.Where(char.IsLetterOrDigit).ToArray()).ToUpper();
            if (string.IsNullOrEmpty(cleanCompanyName)) return "XX";

            for (int length = 2; length <= Math.Min(cleanCompanyName.Length, 10); length++)
            {
                string prefix = cleanCompanyName.Substring(0, length);
                if (!existingPrefixes.Contains(prefix))
                {
                    return prefix;
                }
            }

            string basePrefix = cleanCompanyName.Substring(0, Math.Min(cleanCompanyName.Length, 3));
            int counter = 1;
            while (existingPrefixes.Contains(basePrefix + counter))
            {
                counter++;
            }
            return basePrefix + counter;
        }

        public static async Task<string> GenerateTenantIdAsync(MultitenantDbContext context)
        {
            var lastTenant = await context.Tenants.OrderByDescending(t => t.TenantId).FirstOrDefaultAsync();
            if (lastTenant == null) return "T001";
            
            var lastNumber = int.Parse(lastTenant.TenantId!.Substring(1));
            return "T" + (lastNumber + 1).ToString("D3");
        }

        public static async Task<string> GeneratePostIdAsync(MultitenantDbContext context)
        {
            return await GeneratePostIdAsync(context, "DEFAULT");
        }

        public static async Task<string> GeneratePostIdAsync(MultitenantDbContext context, string companyName)
        {
            string companyPrefix = await GetUniqueCompanyPrefixAsync(context, companyName);
            string basePrefix = companyPrefix + "P";

            var existingPosts = await context.PostMessages
                .Where(p => p.PostMessageId!.StartsWith(basePrefix))
                .Select(p => p.PostMessageId)
                .ToListAsync();

            int nextNumber = 1;
            if (existingPosts.Any())
            {
                var numbers = existingPosts
                    .Select(id => {
                        var numberPart = id!.Substring(basePrefix.Length);
                        return int.TryParse(numberPart, out int num) ? num : 0;
                    })
                    .Where(num => num > 0);
                
                nextNumber = numbers.Any() ? numbers.Max() + 1 : 1;
            }

            return basePrefix + nextNumber.ToString("D3");
        }

        public static async Task<string> GenerateResponseIdAsync(MultitenantDbContext context)
        {
            return await GenerateResponseIdAsync(context, "DEFAULT");
        }

        public static async Task<string> GenerateResponseIdAsync(MultitenantDbContext context, string companyName)
        {
            string companyPrefix = await GetUniqueCompanyPrefixAsync(context, companyName);
            string basePrefix = companyPrefix + "R";

            var existingResponses = await context.ResponseMessages
                .Where(r => r.ResponseMessageId!.StartsWith(basePrefix))
                .Select(r => r.ResponseMessageId)
                .ToListAsync();

            int nextNumber = 1;
            if (existingResponses.Any())
            {
                var numbers = existingResponses
                    .Select(id => {
                        var numberPart = id!.Substring(basePrefix.Length);
                        return int.TryParse(numberPart, out int num) ? num : 0;
                    })
                    .Where(num => num > 0);
                
                nextNumber = numbers.Any() ? numbers.Max() + 1 : 1;
            }

            return basePrefix + nextNumber.ToString("D3");
        }

        public static async Task<string> GenerateNotificationIdAsync(MultitenantDbContext context)
        {
            var lastNotification = await context.Notifications.OrderByDescending(n => n.NotificationId).FirstOrDefaultAsync();
            if (lastNotification == null) return "N001";
            
            var lastNumber = int.Parse(lastNotification.NotificationId!.Substring(1));
            return "N" + (lastNumber + 1).ToString("D3");
        }

        public static async Task<string> GenerateRegistrationIdAsync(MultitenantDbContext context)
        {
            var lastRegistration = await context.RegistrationRequests.OrderByDescending(r => r.RegistrationId).FirstOrDefaultAsync();
            if (lastRegistration == null) return "RR001";
            
            var lastNumber = int.Parse(lastRegistration.RegistrationId!.Substring(2));
            return "RR" + (lastNumber + 1).ToString("D3");
        }

        public static async Task<string> GenerateChatIdAsync(MultitenantDbContext context)
        {
            return await GenerateChatIdAsync(context, "DEFAULT");
        }

        public static async Task<string> GenerateChatIdAsync(MultitenantDbContext context, string companyName)
        {
            string companyPrefix = await GetUniqueCompanyPrefixAsync(context, companyName);
            string basePrefix = companyPrefix + "C";

            var existingChats = await context.Chats
                .Where(c => c.ChatId!.StartsWith(basePrefix))
                .Select(c => c.ChatId)
                .ToListAsync();

            int nextNumber = 1;
            if (existingChats.Any())
            {
                var numbers = existingChats
                    .Select(id => {
                        var numberPart = id!.Substring(basePrefix.Length);
                        return int.TryParse(numberPart, out int num) ? num : 0;
                    })
                    .Where(num => num > 0);
                
                nextNumber = numbers.Any() ? numbers.Max() + 1 : 1;
            }

            return basePrefix + nextNumber.ToString("D3");
        }
    }
}