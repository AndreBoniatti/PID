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
}