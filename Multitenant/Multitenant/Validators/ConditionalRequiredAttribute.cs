using System.ComponentModel.DataAnnotations;
using Multitenant.Models;

namespace Multitenant.Validators
{
    public class ConditionalRequiredAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var instance = validationContext.ObjectInstance;
            var roleProperty = instance.GetType().GetProperty("Role");
            
            if (roleProperty != null)
            {
                var role = (RegistrationRole)roleProperty.GetValue(instance);
                
                if (role == RegistrationRole.DeptManager || role == RegistrationRole.Employee)
                {
                    var department = (DepatmentType)value;
                    if (department == DepatmentType.None)
                    {
                        return new ValidationResult("Please select a department for DeptManager and Employee roles.");
                    }
                }
            }
            
            return ValidationResult.Success;
        }
    }
}