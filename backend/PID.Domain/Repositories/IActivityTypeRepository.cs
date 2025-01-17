using PID.Domain.Dtos;
using PID.Domain.Entities;
using PID.Domain.Repositories.Definitions;

namespace PID.Domain.Repositories;

public interface IActivityTypeRepository : IRepositoryBase<ActivityType>
{
    Task<List<ActivityTypeDto>> GetAllTypesAsync();
}