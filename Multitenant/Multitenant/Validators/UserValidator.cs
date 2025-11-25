using Multitenant.Data;
using Microsoft.EntityFrameworkCore;

namespace Multitenant.Validators
{
    public class UserValidator
    {
        private readonly MultitenantDbContext _context;

        public UserValidator(MultitenantDbContext context)
        {
            _context = context;
        }

        public async Task ValidateUserExistsAsync(string userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new Exception("not found");
        }

        public async Task ValidateUserByNameExistsAsync(string userName)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);
            if (user == null) throw new Exception("not found");
        }

        public async Task ValidateUsersInDepartmentExistAsync(string departmentName)
        {
            var users = await _context.Users.Where(u => u.DepartmentName == departmentName).AnyAsync();
            if (!users) throw new Exception("not found");
        }
    }
}