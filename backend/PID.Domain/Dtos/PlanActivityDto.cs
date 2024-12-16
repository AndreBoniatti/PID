namespace PID.Domain.Dtos;

public class PlanActivityDto
{
    public Guid Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public int Workload { get; set; }
}