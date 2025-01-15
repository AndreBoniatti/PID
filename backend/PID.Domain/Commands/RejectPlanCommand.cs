namespace PID.Domain.Commands;

public class RejectPlanCommand
{
    public string Reason { get; set; } = string.Empty;
}