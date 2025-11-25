using Microsoft.EntityFrameworkCore;
using Multitenant.Models;

namespace Multitenant.Data
{
    public class MultitenantDbContext : DbContext
    {
        public MultitenantDbContext(DbContextOptions<MultitenantDbContext> options) : base(options)
        {
        }
        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<PostMessage> PostMessages { get; set; }
        public DbSet<ResponseMessage> ResponseMessages { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<RegistrationRequest> RegistrationRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Chat>()
                .HasOne(c => c.SenderUser)
                .WithMany(u => u.SentChats)
                .HasForeignKey(c => c.SenderUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Chat>()
                .HasOne(c => c.ReceiverUser)
                .WithMany(u => u.ReceivedChats)
                .HasForeignKey(c => c.ReceiverUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Tenant)
                .WithMany(t => t.Users)
                .HasForeignKey(u => u.TenantId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ResponseMessage>()
                .HasOne(r => r.PostMessage)
                .WithMany(p => p.ResponseMessages)
                .HasForeignKey(r => r.PostMessageId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<RegistrationRequest>()
                .HasOne(r => r.ApprovedUser)
                .WithOne(u => u.RegistrationRequest)
                .HasForeignKey<User>(u => u.RegistrationRequestId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    UserId = "A001",
                    TenantId = null,
                    UserName = "Prathyusha", 
                    Email = "prathyushareddy3112@gmail.com",
                    Password = "prathyusha@123",
                    Role = UserRole.Admin,
                    DepartmentName = "Admin",
                    CreatedAt = new DateTime(2025, 11, 4)
                }
            );
        }
    }
}
