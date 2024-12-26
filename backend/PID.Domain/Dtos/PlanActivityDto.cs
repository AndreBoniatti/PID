namespace PID.Domain.Dtos;

public class PlanActivityDto
{
    public Guid Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public int Workload { get; set; }
    public List<string> WorkloadAllocation { get; set; } = new List<string>();
    public ActivityTypeDto? ActivityType { get; set; }
}