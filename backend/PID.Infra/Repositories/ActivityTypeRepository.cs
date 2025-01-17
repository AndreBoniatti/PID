using Microsoft.EntityFrameworkCore;
using PID.Domain.Dtos;
using PID.Domain.Entities;
using PID.Domain.Repositories;
using PID.Infra.Context;
using PID.Infra.Repositories.Definitions;

namespace PID.Infra.Repositories;

public class ActivityTypeRepository : RepositoryBase<ActivityType>, IActivityTypeRepository
{
    public ActivityTypeRepository(PIDContext pIDContext) : base(pIDContext)
    {
    }

    public async Task<List<ActivityTypeDto>> GetAllTypesAsync()
    {
        return await _pIDContext.ActivityTypes
            .AsNoTracking()
            .OrderBy(x => x.Description)
            .Select(x => new ActivityTypeDto
            {
                Id = x.Id,
                Description = x.Description
            })
            .ToListAsync();
    }
}