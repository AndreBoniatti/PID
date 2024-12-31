namespace PID.Domain.Entities;

public class PlanActivity : EntityBase
{
    public PlanActivity(Guid planId, Guid activityTypeId, string description, List<string> workloadAllocation)
    {
        PlanId = planId;
        ActivityTypeId = activityTypeId;
        Description = description;
        WorkloadAllocation = workloadAllocation;
    }

    public string Description { get; private set; } = string.Empty;
    public List<string> WorkloadAllocation { get; private set; } = new List<string>();

    public Guid ActivityTypeId { get; private set; }
    public virtual ActivityType? ActivityType { get; private set; }

    public Guid PlanId { get; private set; }
    public virtual Plan? Plan { get; private set; }

    public int GetWorkload()
    {
        return WorkloadAllocation.Count;
    }

    public void Update(Guid activityTypeId, string description, List<string> workloadAllocation)
    {
        ActivityTypeId = activityTypeId;
        Description = description;
        WorkloadAllocation = workloadAllocation;
        UpdatedAt = DateTime.UtcNow;
    }
}