using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PID.Infra.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedPlanActivity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Workload",
                table: "PlanActivities");

            migrationBuilder.AddColumn<List<string>>(
                name: "WorkloadAllocation",
                table: "PlanActivities",
                type: "text[]",
                nullable: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WorkloadAllocation",
                table: "PlanActivities");

            migrationBuilder.AddColumn<int>(
                name: "Workload",
                table: "PlanActivities",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
