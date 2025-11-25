using Multitenant.Data;
using Microsoft.EntityFrameworkCore;

namespace Multitenant.Validators
{
    public class ResponseMessageValidator
    {
        private readonly MultitenantDbContext _context;

        public ResponseMessageValidator(MultitenantDbContext context)
        {
            _context = context;
        }

        public async Task ValidateResponseExistsAsync(string responseMessageId)
        {
            var response = await _context.ResponseMessages.FindAsync(responseMessageId);
            if (response == null) throw new Exception("not found");
        }

        public async Task ValidatePostExistsForResponseAsync(string postMessageId)
        {
            var post = await _context.PostMessages.FindAsync(postMessageId);
            if (post == null) throw new Exception("not found");
        }
    }
}