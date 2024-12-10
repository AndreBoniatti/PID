using PID.Domain.Enums;

namespace PID.Domain.Entities;

public class Plan : EntityBase
{
    public EPlanSituation Situation { get; private set; }
    public string? Observation { get; private set; }

    public Guid UserId { get; private set; }
    public virtual User? User { get; private set; }

    public Guid PeriodId { get; private set; }
    public virtual Period? Period { get; private set; }
}