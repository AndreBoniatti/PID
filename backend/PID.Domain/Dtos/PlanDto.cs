namespace PID.Domain.Dtos;

public class PlanDto
{
    public string Period { get; set; } = string.Empty;
    public UserDto? User { get; set; }
    public List<PlanActivityDto>? Activities { get; set; }
}