using PID.Domain.Enums;

namespace PID.Domain.Dtos;

public class PlanDto
{
    public EPlanSituation Situation { get; set; }
    public string? Observation { get; set; }
    public string? ReasonForRejection { get; set; }
    public string Period { get; set; } = string.Empty;
    public bool OwnerUser { get; set; }
    public UserDto? User { get; set; }
    public List<PlanActivityDto>? Activities { get; set; }
}