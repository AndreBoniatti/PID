namespace PID.Domain.Commands;

public class CreatePlanActivityCommand
{
    public Guid? PlanId { get; set; }
    public Guid ActivityTypeId { get; set; }
    public string Description { get; set; } = string.Empty;
    public List<string> WorkloadAllocation { get; set; } = new List<string>();
}