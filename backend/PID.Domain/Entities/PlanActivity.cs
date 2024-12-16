namespace PID.Domain.Entities;

public class PlanActivity : EntityBase
{
    public string Description { get; private set; } = string.Empty;
    public int Workload { get; private set; }

    public Guid ActivityTypeId { get; private set; }
    public virtual ActivityType? ActivityType { get; private set; }

    public Guid PlanId { get; private set; }
    public virtual Plan? Plan { get; private set; }
}