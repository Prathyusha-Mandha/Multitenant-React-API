using Multitenant.Data;
using Microsoft.EntityFrameworkCore;

namespace Multitenant.Validators
{
    public class PostMessageValidator
    {
        private readonly MultitenantDbContext _context;

        public PostMessageValidator(MultitenantDbContext context)
        {
            _context = context;
        }

        public async Task ValidatePostExistsAsync(string postMessageId)
        {
            var post = await _context.PostMessages.FindAsync(postMessageId);
            if (post == null) throw new Exception("not found");
        }

        public async Task ValidatePostByResponseExistsAsync(string responseMessageId)
        {
            var post = await _context.PostMessages
                .FirstOrDefaultAsync(p => p.ResponseMessages!.Any(r => r.ResponseMessageId == responseMessageId));
            if (post == null) throw new Exception("not found");
        }
    }
}