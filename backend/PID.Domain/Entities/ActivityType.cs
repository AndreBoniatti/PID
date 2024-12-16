namespace PID.Domain.Entities;

public class ActivityType : EntityBase
{
    public string Description { get; private set; } = string.Empty;

    public virtual ICollection<PlanActivity>? Activities { get; private set; }
}