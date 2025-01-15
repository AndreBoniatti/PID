using Microsoft.EntityFrameworkCore;
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

    public async Task<Period?> GetLastPeriodAsync()
    {
        return await _pIDContext.Periods
            .AsNoTracking()
            .OrderByDescending(x => x.Year)
            .ThenByDescending(x => x.Semester)
            .FirstOrDefaultAsync();
    }
}