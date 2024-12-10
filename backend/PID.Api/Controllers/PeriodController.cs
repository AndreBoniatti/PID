using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PID.Domain.Dtos;
using PID.Domain.Enums;
using PID.Domain.Repositories;

namespace PID.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PeriodController() : ControllerBase
{
    [HttpGet]
    public IActionResult GetPeriods(
        [FromServices] IPeriodRepository periodRepository,
        [FromServices] IPlanRepository planRepository
    )
    {
        var response = new List<UserPeriodDto>();

        var userPlans = planRepository
            .Find(x => x.UserId == new Guid("a643795a-2d36-494f-8bf4-028504529ebe"))
            .ToList();

        var periods = periodRepository.GetAll()
            .OrderByDescending(x => x.Year)
            .ThenByDescending(x => x.Semester);

        foreach (var period in periods)
        {
            var plan = userPlans.FirstOrDefault(x => x.PeriodId == period.Id);

            response.Add(new UserPeriodDto
            {
                Description = period.GetInfo(),
                Situation = plan == null ? EPlanSituation.PENDING : plan.Situation
            });
        }

        return Ok(response);
    }
}
