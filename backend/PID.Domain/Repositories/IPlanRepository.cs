using PID.Domain.Dtos;
using PID.Domain.Entities;
using PID.Domain.Enums;
using PID.Domain.Repositories.Definitions;

namespace PID.Domain.Repositories;

public interface IPlanRepository : IRepositoryBase<Plan>
{
    Task<List<PlansDto>> GetUserPlansAsync(Guid userId);
    Task<PlanDto?> GetPlanByIdAsync(Guid userId, Guid id);
    Task<PagedList<PeriodPlanDto>> GetPeriodPlansAsync(Guid periodId, int pageIndex, int pageSize, string? userName, EPlanSituation? planSituation);
}