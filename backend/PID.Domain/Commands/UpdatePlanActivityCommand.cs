namespace PID.Domain.Commands;

public class UpdatePlanActivityCommand
{
    public Guid ActivityTypeId { get; set; }
    public string Description { get; set; } = string.Empty;
    public List<string> WorkloadAllocation { get; set; } = new List<string>();
}