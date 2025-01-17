namespace PID.Domain.Dtos;

public class AggregatedPlansDto
{
    public string Slot { get; set; } = string.Empty;
    public required List<AggregatedPlanActivitiesDto> Activities { get; set; }
}

public class AggregatedPlanActivitiesDto
{
    public string UserName { get; set; } = string.Empty;
    public string ActivityDescription { get; set; } = string.Empty;
    public Guid ActivityTypeId { get; set; }

}