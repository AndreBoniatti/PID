using Microsoft.EntityFrameworkCore;
using PID.Domain.Dtos;
using PID.Domain.Entities;
using PID.Domain.Repositories;
using PID.Infra.Context;
using PID.Infra.Repositories.Definitions;

namespace PID.Infra.Repositories;

public class PlanRepository : RepositoryBase<Plan>, IPlanRepository
{
    public PlanRepository(PIDContext pIDContext) : base(pIDContext)
    {
    }

    public async Task<List<PlansDto>> GetUserPlansAsync(Guid userId)
    {
        return await _pIDContext.Plans
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .Select(x => new PlansDto
            {
                Id = x.Id,
                Situation = x.Situation,
                Period = x.Period == null ? string.Empty : x.Period.GetInfo()
            })
            .ToListAsync();
    }

    public async Task<PlanDto?> GetPlanByIdAsync(Guid userId, Guid id)
    {
        return await _pIDContext.Plans
            .AsNoTracking()
            .Where(x => x.UserId == userId && x.Id == id)
            .Select(x => new PlanDto
            {
                Period = x.Period == null ? string.Empty : x.Period.GetInfo(),
                User = x.User == null ? null : new UserDto
                {
                    Name = x.User.Name,
                    Workload = x.User.Workload
                },
                Activities = x.Activities == null ? null : x.Activities
                    .OrderBy(x => x.Description)
                    .Select(y => new PlanActivityDto
                    {
                        Id = y.Id,
                        Description = y.Description,
                        Workload = y.GetWorkload(),
                        WorkloadAllocation = y.WorkloadAllocation,
                        ActivityType = y.ActivityType == null ? null : new ActivityTypeDto
                        {
                            Id = y.ActivityType.Id,
                            Description = y.ActivityType.Description
                        }
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync();
    }
}