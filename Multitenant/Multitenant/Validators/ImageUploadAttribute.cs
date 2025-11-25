using System.ComponentModel.DataAnnotations;

namespace Multitenant.Validators
{
    public class ImageUploadAttribute : ValidationAttribute
    {
        private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp" };
        private readonly string[] _allowedMimeTypes = { "image/jpeg", "image/jpg", "image/png", "image/gif", "image/bmp", "image/webp" };
        private readonly long _maxFileSize = 5 * 1024 * 1024; // 5MB

        public override bool IsValid(object? value)
        {
            if (value == null) return true; // Allow null for optional uploads

            if (value is not IFormFile file) return false;

            // Check file extension
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!_allowedExtensions.Contains(extension))
            {
                ErrorMessage = $"Only image files are allowed: {string.Join(", ", _allowedExtensions)}";
                return false;
            }

            // Check MIME type
            if (!_allowedMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
            {
                ErrorMessage = "Invalid file type. Only image files are allowed.";
                return false;
            }

            // Check file size
            if (file.Length > _maxFileSize)
            {
                ErrorMessage = "File size cannot exceed 5MB.";
                return false;
            }

            return true;
        }
    }
}