using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Multitenant.Migrations
{
    /// <inheritdoc />
    public partial class ConvertChatFileUrlToBytes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add temporary column
            migrationBuilder.AddColumn<byte[]>(
                name: "FileUrl_New",
                table: "Chats",
                type: "varbinary(max)",
                nullable: true);

            // Drop old column
            migrationBuilder.DropColumn(
                name: "FileUrl",
                table: "Chats");

            // Rename new column
            migrationBuilder.RenameColumn(
                name: "FileUrl_New",
                table: "Chats",
                newName: "FileUrl");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Add temporary column
            migrationBuilder.AddColumn<string>(
                name: "FileUrl_Old",
                table: "Chats",
                type: "nvarchar(max)",
                nullable: true);

            // Drop current column
            migrationBuilder.DropColumn(
                name: "FileUrl",
                table: "Chats");

            // Rename old column back
            migrationBuilder.RenameColumn(
                name: "FileUrl_Old",
                table: "Chats",
                newName: "FileUrl");
        }
    }
}
