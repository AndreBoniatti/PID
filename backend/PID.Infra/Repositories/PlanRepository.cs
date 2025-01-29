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

    public async Task<List<PeriodPlanDto>> GetPeriodPlansAsync(Guid periodId, EPlanSituation planSituation, string? userName)
    {
        var query = _pIDContext.Plans
            .AsNoTracking()
            .Where(x => x.PeriodId == periodId && x.Situation == planSituation)
            .Select(x => new PeriodPlanDto
            {
                UserName = x.User == null ? string.Empty : x.User.Name,
                UserWorkload = x.User == null ? 0 : x.User.Workload,
                PlanId = x.Id,
                PlanSituation = x.Situation
            });

        if (planSituation != EPlanSituation.PENDING && !string.IsNullOrWhiteSpace(userName))
        {
            userName = userName.ToLower().Trim();
            query = query.Where(x => x.UserName.ToLower().Contains(userName));
        }

        var periodPlans = await query.ToListAsync();

        if (planSituation == EPlanSituation.PENDING)
        {
            var allPeriodPlanUsers = await _pIDContext.Plans
                .AsNoTracking()
                .Where(x => x.PeriodId == periodId)
                .Select(x => x.UserId)
                .ToListAsync();

            var usersWithoutPlan = await _pIDContext.Users
                .AsNoTracking()
                .Where(x => x.Type != EUserType.ADMIN && !allPeriodPlanUsers.Contains(x.Id))
                .Select(x => new
                {
                    x.Name,
                    x.Workload
                })
                .ToListAsync();

            foreach (var user in usersWithoutPlan)
            {
                periodPlans.Add(new PeriodPlanDto
                {
                    UserName = user.Name,
                    UserWorkload = user.Workload,
                    PlanId = null,
                    PlanSituation = EPlanSituation.PENDING
                });
            }

            if (!string.IsNullOrWhiteSpace(userName))
            {
                userName = userName.ToLower().Trim();
                periodPlans = periodPlans
                    .Where(x => x.UserName.ToLower().Contains(userName))
                    .ToList();
            }
        }

        return periodPlans
            .OrderBy(x => x.UserName)
            .ToList();
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
                        y.WorkloadAllocation,
                        y.ActivityTypeId
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
                        ActivityDescription = activity.Description,
                        ActivityTypeId = activity.ActivityTypeId
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