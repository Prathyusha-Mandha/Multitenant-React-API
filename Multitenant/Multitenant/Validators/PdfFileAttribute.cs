using System.ComponentModel.DataAnnotations;

namespace Multitenant.Validators
{
    public class PdfFileAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if (value == null) return true;

            if (value is not IFormFile file) return false;

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (extension != ".pdf")
            {
                ErrorMessage = "Only PDF files are allowed.";
                return false;
            }

            if (file.ContentType.ToLowerInvariant() != "application/pdf")
            {
                ErrorMessage = "Invalid file type. Only PDF files are allowed.";
                return false;
            }

            return true;
        }
    }
}