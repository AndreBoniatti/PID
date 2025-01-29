using PID.Domain.Dtos;
using PID.Domain.Entities;
using PID.Domain.Enums;
using PID.Domain.Repositories.Definitions;

namespace PID.Domain.Repositories;

public interface IPlanRepository : IRepositoryBase<Plan>
{
    Task<List<PlansDto>> GetUserPlansAsync(Guid userId);
    Task<PlanDto?> GetPlanByIdAsync(Guid? userId, Guid id);
    Task<List<PeriodPlanDto>> GetPeriodPlansAsync(Guid periodId, EPlanSituation planSituation, string? userName);
    Task<List<AggregatedPlansDto>> GetAggregatedPlansAsync(Guid periodId, Guid? activityTypeId);
}