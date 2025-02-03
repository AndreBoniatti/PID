using PID.Domain.Enums;

namespace PID.Domain.Entities;

public class Plan : EntityBase
{
    public Plan(Guid userId, Guid periodId)
    {
        UserId = userId;
        PeriodId = periodId;
        Situation = EPlanSituation.PENDING;
    }

    public EPlanSituation Situation { get; private set; }
    public string? ReasonForRejection { get; private set; }

    public Guid UserId { get; private set; }
    public virtual User? User { get; private set; }

    public Guid PeriodId { get; private set; }
    public virtual Period? Period { get; private set; }

    public virtual ICollection<PlanActivity>? Activities { get; private set; }

    public void SetSituation(EPlanSituation situation)
    {
        Situation = situation;
        UpdatedAt = DateTime.UtcNow;
    }

    public void RejectPlan(string reason)
    {
        ReasonForRejection = reason;
        SetSituation(EPlanSituation.PENDING);
    }
}