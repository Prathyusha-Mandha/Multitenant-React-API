using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Multitenant.Migrations
{
    /// <inheritdoc />
    public partial class AddDepartmentNameToPostMessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DepartmentName",
                table: "PostMessages",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DepartmentName",
                table: "PostMessages");
        }
    }
}
