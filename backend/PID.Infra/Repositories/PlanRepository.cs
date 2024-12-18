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
            .Include(x => x.Period)
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
            .Include(x => x.Activities)
            .Where(x => x.UserId == userId && x.Id == id)
            .Select(x => new PlanDto
            {
                Activities = x.Activities == null ? null : x.Activities.Select(y => new PlanActivityDto
                {
                    Id = y.Id,
                    Description = y.Description,
                    Workload = y.Workload
                })
                .ToList()
            })
            .FirstOrDefaultAsync();
    }
}