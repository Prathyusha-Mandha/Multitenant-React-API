using Multitenant.Data;
using Multitenant.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace Multitenant.Validators
{
    public class RegistrationRequestValidator
    {
        private readonly MultitenantDbContext _context;

        public RegistrationRequestValidator(MultitenantDbContext context)
        {
            _context = context;
        }

        public async Task ValidateRegistrationRequestExistsAsync(string registrationRequestId)
        {
            var request = await _context.RegistrationRequests.FindAsync(registrationRequestId);
            if (request == null) throw new Exception("not found");
        }

        public async Task ValidateRegistrationRequestsByStatusExistAsync(RegistrationStatus status)
        {
            var requests = await _context.RegistrationRequests.Where(r => r.Status == status).AnyAsync();
            if (!requests) throw new Exception("not found");
        }

        public async Task ValidateEmailAsync(string email)
        {
            if (!email.EndsWith("@gmail.com", StringComparison.OrdinalIgnoreCase))
                throw new Exception("Email must end with @gmail.com");
                
            var emailExists = await _context.Users.AnyAsync(u => u.Email == email) || 
                             await _context.RegistrationRequests.AnyAsync(r => r.Email == email);
            if (emailExists)
                throw new Exception("Email already exists in the system");
        }

        public void ValidatePassword(string password)
        {
            if (string.IsNullOrEmpty(password))
                throw new Exception("Password is required");

            if (password.Length < 8)
                throw new Exception("Password must be at least 8 characters long");

            var hasUpper = Regex.IsMatch(password, @"[A-Z]");
            var hasLower = Regex.IsMatch(password, @"[a-z]");
            var hasNumber = Regex.IsMatch(password, @"[0-9]");
            var hasSymbol = Regex.IsMatch(password, @"[^a-zA-Z0-9]");

            if (!hasUpper || !hasLower || !hasNumber || !hasSymbol)
                throw new Exception("Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character");
        }

        public void ValidateRoleBasedFields(RegistrationRole role, DepatmentType department, string companyName)
        {
            if (role == RegistrationRole.Manager)
            {
                if (string.IsNullOrWhiteSpace(companyName))
                    throw new Exception("Company name is required for Manager role");
            }
            else if (role == RegistrationRole.DeptManager || role == RegistrationRole.Employee)
            {
                if (department == DepatmentType.None)
                    throw new Exception($"Department selection is required for {role} role");
                if (string.IsNullOrWhiteSpace(companyName))
                    throw new Exception($"Company selection is required for {role} role");
            }
        }

        public async Task ValidateCompanyExistsAsync(string companyName, RegistrationRole role)
        {
            var companyExists = await _context.Tenants.AnyAsync(t => t.TenantName == companyName);
            
            if (role == RegistrationRole.Manager)
            {
                if (companyExists)
                    throw new Exception($"Company '{companyName}' already exists in the system");
            }
            else if (role == RegistrationRole.DeptManager || role == RegistrationRole.Employee)
            {
                if (!companyExists)
                    throw new Exception($"Selected company '{companyName}' does not exist in the system");
            }
        }

        public async Task ValidateDeptManagerUniquenessAsync(string companyName, DepatmentType department, RegistrationRole role)
        {
            if (role == RegistrationRole.DeptManager)
            {
                var existingDeptManager = await _context.Users
                    .Include(u => u.Tenant)
                    .AnyAsync(u => u.Role == UserRole.DeptManager && 
                                 u.Tenant!.TenantName == companyName &&
                                 u.DepartmentName == department.ToString());
                                 
                if (existingDeptManager)
                    throw new Exception($"Department manager already exists for {department} department in company '{companyName}'");
            }
        }

        public async Task ValidateExistingRegistrationRequestAsync(string companyName, RegistrationRole role, DepatmentType department = DepatmentType.None)
        {
            if (role == RegistrationRole.Manager)
            {
                var existingRequest = await _context.RegistrationRequests
                    .AnyAsync(r => r.Role == RegistrationRole.Manager && 
                                 r.CompanyName == companyName &&
                                 r.Status == RegistrationStatus.Pending);
                                 
                if (existingRequest)
                    throw new Exception($"Already requested for manager role in company '{companyName}'");
            }
            else if (role == RegistrationRole.DeptManager)
            {
                var existingRequest = await _context.RegistrationRequests
                    .AnyAsync(r => r.Role == RegistrationRole.DeptManager && 
                                 r.CompanyName == companyName &&
                                 r.Department == department &&
                                 r.Status == RegistrationStatus.Pending);
                                 
                if (existingRequest)
                    throw new Exception($"Already requested for department manager role in {department} department of company '{companyName}'");
            }
        }

        public async Task ValidateDepartmentManagerExistsAsync(string companyName, DepatmentType department, RegistrationRole role)
        {
            if (role == RegistrationRole.Employee && department != DepatmentType.None)
            {
                var deptManagerExists = await _context.Users
                    .Include(u => u.Tenant)
                    .AnyAsync(u => u.Role == UserRole.DeptManager && 
                                 u.Tenant!.TenantName == companyName &&
                                 u.DepartmentName == department.ToString());
                                 
                if (!deptManagerExists)
                    throw new Exception($"No department manager exists for {department} department in company '{companyName}'. Please contact your administrator.");
            }
        }
    }
}