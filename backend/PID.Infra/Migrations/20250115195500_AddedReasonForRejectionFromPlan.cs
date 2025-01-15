using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PID.Infra.Migrations
{
    /// <inheritdoc />
    public partial class AddedReasonForRejectionFromPlan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ReasonForRejection",
                table: "Plans",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReasonForRejection",
                table: "Plans");
        }
    }
}
