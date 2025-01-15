using PID.Domain.Enums;

namespace PID.Domain.Dtos;

public class PeriodPlanDto
{
    public string UserName { get; set; } = string.Empty;
    public int UserWorkload { get; set; }
    public Guid PlanId { get; set; }
    public EPlanSituation PlanSituation { get; set; }
}