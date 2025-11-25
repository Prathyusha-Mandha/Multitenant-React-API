using System.ComponentModel.DataAnnotations;
using Multitenant.Data;
using Microsoft.EntityFrameworkCore;

namespace Multitenant.Validators
{
    public class UniqueTenantNameAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if (value == null || string.IsNullOrWhiteSpace(value.ToString()))
                return true;

            return true; // Actual validation will be done in service layer
        }
    }
}