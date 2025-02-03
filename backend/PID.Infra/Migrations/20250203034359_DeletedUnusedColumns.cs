using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PID.Infra.Migrations
{
    /// <inheritdoc />
    public partial class DeletedUnusedColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Picure",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Observation",
                table: "Plans");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Picure",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Observation",
                table: "Plans",
                type: "text",
                nullable: true);
        }
    }
}
