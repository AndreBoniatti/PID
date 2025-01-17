using Microsoft.EntityFrameworkCore;
using PID.Domain.Dtos;
using PID.Domain.Entities;
using PID.Domain.Enums;
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

    public async Task<PlanDto?> GetPlanByIdAsync(Guid? userId, Guid id)
    {
        return await _pIDContext.Plans
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new PlanDto
            {
                Situation = x.Situation,
                Observation = x.Observation,
                ReasonForRejection = x.ReasonForRejection,
                Period = x.Period == null ? string.Empty : x.Period.GetInfo(),
                OwnerUser = x.UserId == userId,
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

    public async Task<PagedList<PeriodPlanDto>> GetPeriodPlansAsync(Guid periodId, int pageIndex, int pageSize, string? userName, EPlanSituation? planSituation)
    {
        var query = _pIDContext.Plans
            .AsNoTracking()
            .Where(x => x.PeriodId == periodId)
            .Select(x => new PeriodPlanDto
            {
                UserName = x.User == null ? string.Empty : x.User.Name,
                UserWorkload = x.User == null ? 0 : x.User.Workload,
                PlanId = x.Id,
                PlanSituation = x.Situation
            });

        if (!string.IsNullOrWhiteSpace(userName))
        {
            userName = userName.ToLower().Trim();
            query = query.Where(x => x.UserName.ToLower().Contains(userName));
        }

        if (planSituation != null)
            query = query.Where(x => x.PlanSituation == planSituation);

        return new PagedList<PeriodPlanDto>
        {
            TotalCount = await query.CountAsync(),
            Data = await query
                .OrderBy(x => x.UserName)
                .Skip(pageSize * pageIndex)
                .Take(pageSize)
                .ToListAsync()
        };
    }

    public async Task<List<AggregatedPlansDto>> GetAggregatedPlansAsync(Guid periodId, Guid? activityTypeId)
    {
        var plans = await _pIDContext.Plans
            .AsNoTracking()
            .Where(x => x.PeriodId == periodId && x.Situation == EPlanSituation.APPROVED)
            .Select(x => new
            {
                UserName = x.User == null ? string.Empty : x.User.Name,
                Activities = x.Activities == null ? null : x.Activities
                    .Where(y => activityTypeId != null ? y.ActivityTypeId == activityTypeId : true)
                    .Select(y => new
                    {
                        y.Description,
                        y.WorkloadAllocation
                    })
            })
            .ToListAsync();

        var aggregatedPlans = new List<AggregatedPlansDto>();

        foreach (var plan in plans)
        {
            if (plan.Activities == null)
                continue;

            foreach (var activity in plan.Activities)
            {
                foreach (var workload in activity.WorkloadAllocation)
                {
                    var aggregatedPlanActivity = new AggregatedPlanActivitiesDto()
                    {
                        UserName = plan.UserName,
                        Activity = activity.Description
                    };

                    var aggregatedPlan = aggregatedPlans.FirstOrDefault(x => x.Slot == workload);
                    if (aggregatedPlan == null)
                    {
                        aggregatedPlans.Add(new AggregatedPlansDto
                        {
                            Slot = workload,
                            Activities = new() { aggregatedPlanActivity }
                        });
                    }
                    else
                    {
                        aggregatedPlan.Activities.Add(aggregatedPlanActivity);
                    }
                }
            }
        }

        return aggregatedPlans;
    }
}