using PID.Domain.Entities;
using PID.Domain.Repositories;
using PID.Infra.Context;
using PID.Infra.Repositories.Definitions;

namespace PID.Infra.Repositories;

public class PeriodRepository : RepositoryBase<Period>, IPeriodRepository
{
    public PeriodRepository(PIDContext pIDContext) : base(pIDContext)
    {
    }
}