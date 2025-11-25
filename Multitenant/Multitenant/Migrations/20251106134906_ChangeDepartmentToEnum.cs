using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Multitenant.Migrations
{
    /// <inheritdoc />
    public partial class ChangeDepartmentToEnum : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DepartmentName",
                table: "PostMessages");

            migrationBuilder.AddColumn<int>(
                name: "Department",
                table: "PostMessages",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Department",
                table: "PostMessages");

            migrationBuilder.AddColumn<string>(
                name: "DepartmentName",
                table: "PostMessages",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);
        }
    }
}
