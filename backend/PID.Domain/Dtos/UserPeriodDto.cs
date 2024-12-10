using PID.Domain.Enums;

namespace PID.Domain.Dtos;

public class UserPeriodDto
{
    public string Description { get; set; } = string.Empty;
    public EPlanSituation Situation { get; set; }
}