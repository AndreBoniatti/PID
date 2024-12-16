using PID.Domain.Enums;

namespace PID.Domain.Dtos;

public class PlansDto
{
    public Guid? Id { get; set; }
    public EPlanSituation Situation { get; set; }
    public string Period { get; set; } = string.Empty;
}