using PID.Domain.Entities;
using PID.Domain.Repositories;
using PID.Infra.Context;
using PID.Infra.Repositories.Definitions;

namespace PID.Infra.Repositories;

public class PlanActivityRepository : RepositoryBase<PlanActivity>, IPlanActivityRepository
{
    public PlanActivityRepository(PIDContext pIDContext) : base(pIDContext)
    {
    }
}