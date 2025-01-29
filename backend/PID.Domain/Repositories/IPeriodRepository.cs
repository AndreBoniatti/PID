using PID.Domain.Dtos;
using PID.Domain.Entities;
using PID.Domain.Repositories.Definitions;

namespace PID.Domain.Repositories;

public interface IPeriodRepository : IRepositoryBase<Period>
{
    Task<Period?> GetLastPeriodAsync();
    Task<PeriodDto?> GetPeriodByIdAsync(Guid id);
    Task<List<PeriodDto>> GetAllPeriodsAsync();
}