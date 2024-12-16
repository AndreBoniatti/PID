using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PID.Infra.Migrations
{
    /// <inheritdoc />
    public partial class CreatedActivityTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Observation",
                table: "Plans",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateTable(
                name: "ActivityTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PlanActivities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Workload = table.Column<int>(type: "integer", nullable: false),
                    ActivityTypeId = table.Column<Guid>(type: "uuid", nullable: false),
                    PlanId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlanActivities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlanActivities_ActivityTypes_ActivityTypeId",
                        column: x => x.ActivityTypeId,
                        principalTable: "ActivityTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlanActivities_Plans_PlanId",
                        column: x => x.PlanId,
                        principalTable: "Plans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ActivityTypes_Description",
                table: "ActivityTypes",
                column: "Description",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlanActivities_ActivityTypeId",
                table: "PlanActivities",
                column: "ActivityTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_PlanActivities_Description_ActivityTypeId_PlanId",
                table: "PlanActivities",
                columns: new[] { "Description", "ActivityTypeId", "PlanId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlanActivities_PlanId",
                table: "PlanActivities",
                column: "PlanId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PlanActivities");

            migrationBuilder.DropTable(
                name: "ActivityTypes");

            migrationBuilder.AlterColumn<string>(
                name: "Observation",
                table: "Plans",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}
